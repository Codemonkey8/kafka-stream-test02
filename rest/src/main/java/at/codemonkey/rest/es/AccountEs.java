package at.codemonkey.rest.es;

import at.codemonkey.common.Account;
import at.codemonkey.common.Person;
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
