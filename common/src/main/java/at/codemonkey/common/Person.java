package at.codemonkey.common;

import lombok.Data;

@Data
public class Person {
    String id;
    long time;
    String name;
    int age;
    String usergroupId;
    boolean active = true;
}