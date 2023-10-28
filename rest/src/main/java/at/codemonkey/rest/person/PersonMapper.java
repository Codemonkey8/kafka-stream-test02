package at.codemonkey.rest.person;

import at.codemonkey.common.Person;
import org.mapstruct.Mapper;

@Mapper
public interface PersonMapper {

    PersonEs map(Person person);

}
