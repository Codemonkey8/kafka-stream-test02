package at.codemonkey.rest.account;

import at.codemonkey.common.Account;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "account")
public class AccountEs extends Account {
    @Id
    public String getId() {
        return super.getId();
    }

}
