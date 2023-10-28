package at.codemonkey.rest.personaccount;

import at.codemonkey.common.PersonAccount;
import org.mapstruct.Mapper;

@Mapper
public interface PersonAccountMapper {

    PersonAccountEs map(PersonAccount personAccount);

}
