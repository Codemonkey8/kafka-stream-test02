package at.codemonkey.stream;

import at.codemonkey.common.Person;
import lombok.Data;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

@Data
public class UsergroupIdToPersons {
    String usergroupId;
    Set<Person> persons = new TreeSet<>(Comparator.comparing(Person::getId));

    UsergroupIdToPersons addPerson(Person person) {
        persons.add(person);
        return this;
    }

    UsergroupIdToPersons removePerson(Person person) {
        persons.removeIf(p -> p.getId().equals(person.getId()));
        return this;
    }

}
