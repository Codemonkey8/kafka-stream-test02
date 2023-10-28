package at.codemonkey.rest.account;

import at.codemonkey.common.Account;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/account")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class AccountController {

    AccountRepository accountRepository;

    KafkaTemplate<String, Object> kafkaTemplate;

    @PostMapping
    public Account postAccount(@RequestBody Account account) {
        log.info("create account: {}", account);
        account.setId(UUID.randomUUID().toString())
                .setTime(System.currentTimeMillis());
        kafkaTemplate.send("account", account.getUsergroupId(), account);
        return account;
    }

    @DeleteMapping
    public void deleteAccount(@RequestBody Account account) {
        log.info("delete account: {}", account);
        account.setTime(System.currentTimeMillis())
                .setActive(false);
        kafkaTemplate.send("account", account.getUsergroupId(), account);
    }

    @GetMapping
    public Iterable<AccountEs> getAccount() {
        return accountRepository.findAll();
    }

}
