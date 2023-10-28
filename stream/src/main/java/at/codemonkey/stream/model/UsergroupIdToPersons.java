package at.codemonkey.stream.model;

import at.codemonkey.common.Person;
import lombok.Data;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

@Data
public class UsergroupIdToPersons {

    String usergroupId;
    Set<Person> persons = new TreeSet<>(Comparator.comparing(Person::getId));

    public UsergroupIdToPersons addPerson(Person person) {
        persons.add(person);
        return this;
    }

    public void removePerson(Person person) {
        persons.removeIf(p -> p.getId().equals(person.getId()));
    }

}
