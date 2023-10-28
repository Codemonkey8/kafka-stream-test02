package at.codemonkey.rest.person;

import at.codemonkey.common.Person;
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
public class PersonListener {

    PersonRepository personRepository;

    SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(topics = "person", properties = "spring.json.value.default.type: at.codemonkey.common.Person")
    public void personListener(ConsumerRecord<String, Person> record) {
        Person person = record.value();
        log.info("got person record {}", person);
        if (person.isActive()) {
            log.info("saving person {}", person);
            personRepository.save(getMapper(PersonMapper.class).map(person));
        } else {
            log.info("deleting person {}", person);
            personRepository.deleteById(person.getId());
        }
        simpMessagingTemplate.convertAndSend("/topic/person", person.getId());
        log.info("sent ws update for person id {} to /topic/person", person.getId());
    }

}
