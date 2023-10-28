package at.codemonkey.rest.personaccount;

import at.codemonkey.common.PersonAccount;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "person-account")
public class PersonAccountEs extends PersonAccount {

    @Id
    String id;

}
