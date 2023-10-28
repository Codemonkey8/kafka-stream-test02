package at.codemonkey.rest.personaccount;

import at.codemonkey.common.PersonAccount;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import static org.mapstruct.factory.Mappers.getMapper;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class PersonAccountListener {

    PersonAccountRepository personAccountRepository;

    SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(topics = "personAccount", properties = "spring.json.value.default.type: at.codemonkey.common.PersonAccount")
    public void personAccountListener(ConsumerRecord<String, PersonAccount> record) {
        PersonAccount personAccount = record.value();
        log.info("got personAccount record {}", personAccount);
        String id = personAccount.getAccountId() + "/" + personAccount.getPersonId();
        if (personAccount.isActive()) {
            log.info("saving personAccount {}", personAccount);
            personAccountRepository.save(getMapper(PersonAccountMapper.class).map(personAccount).setId(id));
        } else {
            log.info("deleting personAccount {}", personAccount);
            personAccountRepository.deleteById(id);
        }
        simpMessagingTemplate.convertAndSend("/topic/person-accounts", id);
    }

}
