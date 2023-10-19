package at.codemonkey.rest.es;

import at.codemonkey.common.Person;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "person")
public class PersonEs extends Person {
    @Id
    public String getId() {
        return super.getId();
    }

}
