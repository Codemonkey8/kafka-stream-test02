package at.codemonkey.stream.model;

import at.codemonkey.common.Account;
import lombok.Data;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

@Data
public class UsergroupIdToAccounts {

    String usergroupId;
    Set<Account> accounts = new TreeSet<>(Comparator.comparing(Account::getId));

    public UsergroupIdToAccounts addAccount(Account account) {
        accounts.add(account);
        return this;
    }

    public void removeAccount(Account account) {
        accounts.removeIf(a -> a.getId().equals(account.getId()));
    }
}
