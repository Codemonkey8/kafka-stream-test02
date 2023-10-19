package at.codemonkey.rest;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.rest.es.PersonAccountEs;
import at.codemonkey.rest.es.PersonAccountRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@Slf4j
public class MyController {

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    PersonAccountRepository personAccountRepository;

    String usergroupId = "some-user-group-id";

    @GetMapping("/hello")
    public Person hello() {
        return new Person()
                .setAge(42)
                .setName("John Doe");
    }

    @PostMapping("/person")
    public Person postPerson(@RequestBody Person payload) throws JsonProcessingException {
        log.info("Received person: {}", payload);
//        if(payload.getName().contains("e")) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must not contain 'e'");
//        }
        payload
                .setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("person", payload.getUsergroupId(), new ObjectMapper().writeValueAsString(payload));
        return payload;
    }

    @PutMapping("/person")
    public Person putPerson(@RequestBody Person payload) throws JsonProcessingException {
        payload.setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("person", payload.getUsergroupId(), new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(payload));
        return payload;
    }

    @PostMapping("/account")
    public Account postAccount(@RequestBody Account payload) throws JsonProcessingException {
        log.info("Received account: {}", payload);
        payload
                .setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("account", payload.getUsergroupId(), new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(payload));
        return payload;
    }

    @PutMapping("/account")
    public Account putAccount(@RequestBody Account payload) throws JsonProcessingException {
        payload.setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("account", payload.getUsergroupId(), new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(payload));
        return payload;
    }

    @GetMapping("/personAccount")
    public Iterable<PersonAccountEs> getPersonAccount() {
        return personAccountRepository.findAll();
    }
}
