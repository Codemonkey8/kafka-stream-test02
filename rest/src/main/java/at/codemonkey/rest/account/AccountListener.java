package at.codemonkey.rest.account;

import at.codemonkey.common.Account;
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
public class AccountListener {

    AccountRepository accountRepository;

    SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(topics = "account", properties = "spring.json.value.default.type: at.codemonkey.common.Account")
    public void accountListener(ConsumerRecord<String, Account> record) {
        Account account = record.value();
        log.info("got account record {}", account);
        if (account.isActive()) {
            log.info("saving account {}", account);
            accountRepository.save(getMapper(AccountMapper.class).map(account));
        } else {
            log.info("deleting account {}", account);
            accountRepository.deleteById(account.getId());
        }
        simpMessagingTemplate.convertAndSend("/topic/account", account.getId());
    }

}
