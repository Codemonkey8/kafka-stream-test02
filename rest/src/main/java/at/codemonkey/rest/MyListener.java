package at.codemonkey.rest;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.common.PersonAccount;
import at.codemonkey.rest.es.AccountRepository;
import at.codemonkey.rest.es.PersonAccountRepository;
import at.codemonkey.rest.es.PersonRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static org.mapstruct.factory.Mappers.getMapper;

@Slf4j
@Component
public class MyListener {

    @Autowired
    PersonAccountRepository personAccountRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    AccountRepository accountRepository;

    @KafkaListener(topics = "personAccount", properties = "spring.json.value.default.type: at.codemonkey.common.PersonAccount")
    public void personAccountListener(ConsumerRecord<String, PersonAccount> record) {
        PersonAccount personAccount = record.value();
        log.info("got personAccount record {}", personAccount);
        if (personAccount.isActive()) {
            log.info("saving personAccount {}", personAccount);
            personAccountRepository.save(getMapper(MyMapper.class).map(personAccount.getAccountId() + "/" + personAccount.getPersonId(), personAccount));
        } else {
            log.info("deleting personAccount {}", personAccount);
            personAccountRepository.deleteById(personAccount.getAccountId() + "/" + personAccount.getPersonId());
        }
    }

    @KafkaListener(topics = "person", properties = "spring.json.value.default.type: at.codemonkey.common.Person")
    public void personListener(ConsumerRecord<String, Person> record) {
        Person person = record.value();
        log.info("got person record {}", person);
        if(person.isActive()) {
            log.info("saving person {}", person);
            personRepository.save(getMapper(MyMapper.class).map(person));
        } else {
            log.info("deleting person {}", person);
            personRepository.deleteById(person.getId());
        }

    }

    @KafkaListener(topics = "account", properties = "spring.json.value.default.type: at.codemonkey.common.Account")
    public void accountListener(ConsumerRecord<String, Account> record) {
        Account account = record.value();
        log.info("got account record {}", account);
        if(account.isActive()) {
            log.info("saving account {}", account);
            accountRepository.save(getMapper(MyMapper.class).map(account));
        } else {
            log.info("deleting account {}", account);
            accountRepository.deleteById(account.getId());
        }
    }
}
