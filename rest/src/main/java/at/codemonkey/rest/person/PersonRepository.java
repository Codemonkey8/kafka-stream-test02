package at.codemonkey.rest.person;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PersonRepository extends ElasticsearchRepository<PersonEs, String> {

}
