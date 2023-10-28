package at.codemonkey.stream.model;

import lombok.Data;

import java.util.Set;

@Data
public class PersonToAccounts {

    String personId;
    Set<String> accountIds;

}
