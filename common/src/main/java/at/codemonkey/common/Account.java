package at.codemonkey.common;

import lombok.Data;

@Data
public class Account {
    String id;
    long time;
    String name;
    String iban;
    String usergroupId;
    boolean active = true;
}
