package at.codemonkey.stream;

import at.codemonkey.common.Account;
import lombok.Data;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

@Data
public class UsergroupIdToAccounts {
    String usergroupId;
    Set<Account> accounts = new TreeSet<>(Comparator.comparing(Account::getId));

    UsergroupIdToAccounts addAccount(Account account) {
        accounts.add(account);
        return this;
    }

    UsergroupIdToAccounts removeAccount(Account account) {
        accounts.removeIf(a -> a.getId().equals(account.getId()));
        return this;
    }
}
