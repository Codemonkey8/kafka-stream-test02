package at.codemonkey.rest.personaccount;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/personAccount")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class PersonAccountController {

    PersonAccountRepository personAccountRepository;

    @GetMapping
    public Iterable<PersonAccountEs> getPersonAccount() {
        return personAccountRepository.findAll();
    }

}
