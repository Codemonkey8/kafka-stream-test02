package at.codemonkey.rest;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.rest.es.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Slf4j
public class MyController {

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    PersonAccountRepository personAccountRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    AccountRepository accountRepository;

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

    @DeleteMapping("/person/{id}")
    public void putPerson(@PathVariable String id) throws JsonProcessingException {
        Person person = new Person().setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId)
                .setId(id)
                .setActive(false);
        kafkaTemplate.send("person", person.getUsergroupId(), new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(person));
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

    @DeleteMapping("/account/{id}")
    public void putAccount(@PathVariable String id) throws JsonProcessingException {
        Account account = new Account().setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId)
                .setId(id)
                .setActive(false);
        kafkaTemplate.send("account", account.getUsergroupId(), new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(account));
    }

    @GetMapping("/personAccount")
    public Iterable<PersonAccountEs> getPersonAccount() {
        return personAccountRepository.findAll();
    }

    @GetMapping("/person")
    public Iterable<PersonEs> getPerson() {
        return personRepository.findAll();
    }

    @GetMapping("/account")
    public Iterable<AccountEs> getAccount() {
        return accountRepository.findAll();
    }
}
