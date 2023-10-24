package at.codemonkey.stream;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.common.PersonAccount;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Produced;

import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;

import static java.util.stream.Collectors.toList;

@Log4j2
public class PersonJoinAccountProcessor {
    public static void main(String[] args) {

        StreamsBuilder builder = new StreamsBuilder();

        var personStream = builder.stream("person", Consumed.with(Serdes.String(), JsonSerializer.serdeFrom(Person.class)));
        var accountStream = builder.stream("account", Consumed.with(Serdes.String(), JsonSerializer.serdeFrom(Account.class)));
        var usergroupIdToPersonsTable = builder.table("usergroupIdToPersons", Consumed.with(Serdes.String(), JsonSerializer.serdeFrom(UsergroupIdToPersons.class)));
        var usergroupIdToAccountsTable = builder.table("usergroupIdToAccounts", Consumed.with(Serdes.String(), JsonSerializer.serdeFrom(UsergroupIdToAccounts.class)));

        personStream.leftJoin(usergroupIdToPersonsTable,
                        (person, usergroupIdToPersons) -> {
                            if (person.isActive()) {
                                return Optional.ofNullable(usergroupIdToPersons).orElseGet(UsergroupIdToPersons::new)
                                        .setUsergroupId(person.getUsergroupId())
                                        .addPerson(person);
                            } else if (usergroupIdToPersons != null) {
                                usergroupIdToPersons.removePerson(person);
                                if (usergroupIdToPersons.getPersons().isEmpty()) {
                                    return null; // delete
                                }
                                return usergroupIdToPersons;
                            }
                            return null;
                        })
                .peek((key, value) -> log.info("usergroupIdToPersons {}/{}-{}", key, value == null ? "null" : value.getPersons().size(), value == null ? "null" : value.getPersons()))
                .to("usergroupIdToPersons", Produced.with(Serdes.String(), JsonSerializer.serdeFrom(UsergroupIdToPersons.class)));

        accountStream.leftJoin(usergroupIdToAccountsTable,
                        (account, usergroupIdToAccounts) -> {
                            if (account.isActive()) {
                                return Optional.ofNullable(usergroupIdToAccounts).orElseGet(UsergroupIdToAccounts::new)
                                        .setUsergroupId(account.getUsergroupId())
                                        .addAccount(account);
                            } else if (usergroupIdToAccounts != null) {
                                usergroupIdToAccounts.removeAccount(account);
                                if (usergroupIdToAccounts.getAccounts().isEmpty()) {
                                    return null; // delete
                                }
                                return usergroupIdToAccounts;
                            }
                            return null;
                        })
                .peek((key, value) -> log.info("usergroupIdToAccounts {}/{}", key, value == null ? "null" : value.getAccounts().size()))
                .to("usergroupIdToAccounts", Produced.with(Serdes.String(), JsonSerializer.serdeFrom(UsergroupIdToAccounts.class)));

        personStream
                .peek((key, value) -> log.info("person {}/{}", key, value))
                .join(usergroupIdToAccountsTable,
                        (person, usergroupIdToAccounts) ->
                                usergroupIdToAccounts.getAccounts().stream()
                                        .map(account -> buildPersonAccount(account, person))
                                        .collect(toList())
                )
                .flatMap((key, accountPersons) -> accountPersons.stream().map(personAccount -> new KeyValue<>(personAccount.getPersonId() + "/" + personAccount.getAccountId(), personAccount)).collect(toList()))
                .peek((key, value) -> log.info("personAccount by person {}/{}", key, value))
                .to("personAccount", Produced.with(Serdes.String(), JsonSerializer.serdeFrom(PersonAccount.class)));

        accountStream
                .peek((key, value) -> log.info("account {}/{}", key, value))
                .join(usergroupIdToPersonsTable,
                        (account, usergroupIdToPersons) ->
                                usergroupIdToPersons.getPersons().stream()
                                        .map(person -> buildPersonAccount(account, person))
                                        .collect(toList())
                )
                .flatMap((key, accountPersons) -> accountPersons.stream().map(personAccount -> new KeyValue<>(personAccount.getPersonId() + "/" + personAccount.getAccountId(), personAccount)).collect(toList()))
                .filter((key, value) -> value.getPersonId() != null && value.getAccountId() != null)
                .peek((key, value) -> log.info("personAccount by account {}/{}", key, value))
//                .processValues(() -> (FixedKeyProcessor<String, PersonAccount, PersonAccount>) record -> record.headers().add("header.key", PersonAccount.class.getName().getBytes()))
                .to("personAccount", Produced.with(Serdes.String(), JsonSerializer.serdeFrom(PersonAccount.class)));


        startStream(builder);
    }

    private static PersonAccount buildPersonAccount(Account account, Person person) {
        return new PersonAccount()
                .setUsergroupId(account.getUsergroupId())
                .setPersonId(person.getId())
                .setPersonName(person.getName())
                .setAge(person.getAge())
                .setAccountId(account.getId())
                .setAccountName(account.getName())
                .setIban(account.getIban())
                .setTime(Math.max(person.getTime(), account.getTime()))
                .setActive(person.isActive() && account.isActive());
    }

    public static void startStream(StreamsBuilder builder) {
        log.info("setup stream");
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "streams-pipe");

        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1);
        final CountDownLatch latch = new CountDownLatch(1);
        try (KafkaStreams kafkaStreams = new KafkaStreams(builder.build(), props)) {
            Runtime.getRuntime().addShutdownHook(new Thread("streams-shutdown-hook") {
                @Override
                public void run() {
                    kafkaStreams.close();
                    latch.countDown();
                }
            });

            try {
                log.info("starting stream");
                kafkaStreams.start();
                log.info("started");
                latch.await();
            } catch (Throwable e) {
                System.exit(1);
            }
            System.exit(0);
        }
    }
}
