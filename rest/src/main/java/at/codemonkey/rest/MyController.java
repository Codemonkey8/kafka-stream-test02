package at.codemonkey.rest;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.rest.es.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Slf4j
public class MyController {

    @Autowired
    KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    PersonAccountRepository personAccountRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    AccountRepository accountRepository;

    final String usergroupId = "some-user-group-id";

    @PostMapping("/person")
    public Person postPerson(@RequestBody Person person) {
        log.info("Received person: {}", person);
        person
                .setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("person", person.getUsergroupId(), person);
        return person;
    }

    @PutMapping("/person")
    public Person putPerson(@RequestBody Person person) {
        person.setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("person", person.getUsergroupId(), person);
        return person;
    }

    @DeleteMapping("/person/{id}")
    public void putPerson(@PathVariable String id) {
        Person person = new Person().setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId)
                .setId(id)
                .setActive(false);
        kafkaTemplate.send("person", person.getUsergroupId(), person);
    }

    @GetMapping("/person")
    public Iterable<PersonEs> getPerson() {
        return personRepository.findAll();
    }

    @PostMapping("/account")
    public Account postAccount(@RequestBody Account account) {
        log.info("Received account: {}", account);
        account
                .setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("account", account.getUsergroupId(), account);
        return account;
    }

    @PutMapping("/account")
    public Account putAccount(@RequestBody Account account) {
        account.setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId);
        kafkaTemplate.send("account", account.getUsergroupId(), account);
        return account;
    }

    @DeleteMapping("/account/{id}")
    public void putAccount(@PathVariable String id) {
        Account account = new Account().setTime(System.currentTimeMillis())
                .setUsergroupId(usergroupId)
                .setId(id)
                .setActive(false);
        kafkaTemplate.send("account", account.getUsergroupId(), account);
    }

    @GetMapping("/account")
    public Iterable<AccountEs> getAccount() {
        return accountRepository.findAll();
    }

    @GetMapping("/personAccount")
    public Iterable<PersonAccountEs> getPersonAccount() {
        return personAccountRepository.findAll();
    }

}
