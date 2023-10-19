package at.codemonkey.rest;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
import at.codemonkey.common.PersonAccount;
import at.codemonkey.rest.es.AccountEs;
import at.codemonkey.rest.es.PersonAccountEs;
import at.codemonkey.rest.es.PersonEs;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface MyMapper {

    PersonEs map(Person person);

    AccountEs map(Account account);

    @Mapping(target = "id", source = "id")
    PersonAccountEs map(String id, PersonAccount personAccount);

}
