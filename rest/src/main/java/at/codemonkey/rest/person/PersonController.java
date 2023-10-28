package at.codemonkey.rest.person;

import at.codemonkey.common.Person;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/person")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class PersonController {

    PersonRepository personRepository;

    KafkaTemplate<String, Object> kafkaTemplate;

    @PostMapping
    public Person postPerson(@RequestBody Person person) {
        log.info("Received person: {}", person);
        person.setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis());
        kafkaTemplate.send("person", person.getUsergroupId(), person);
        return person;
    }

    @DeleteMapping
    public void deletePerson(@RequestBody Person person) {
        person.setTime(System.currentTimeMillis())
                .setActive(false);
        kafkaTemplate.send("person", person.getUsergroupId(), person);
    }

    @GetMapping
    public Iterable<PersonEs> getPerson() {
        return personRepository.findAll();
    }

}
