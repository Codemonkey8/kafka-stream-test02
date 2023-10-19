package at.codemonkey.common;

import lombok.Data;

@Data
public class PersonAccount {
    String accountId;
    String personId;
    long time;
    String accountName;
    String iban;
    String usergroupId;
    String personName;
    int age;
    boolean active = true;
}
