package at.codemonkey.rest.es;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PersonAccountRepository extends ElasticsearchRepository<PersonAccountEs, String> {

}
