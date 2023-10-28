package at.codemonkey.rest.account;

import at.codemonkey.common.Account;
import org.mapstruct.Mapper;

@Mapper
public interface AccountMapper {

    AccountEs map(Account account);

}
