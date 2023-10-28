package at.codemonkey.rest.personaccount;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PersonAccountRepository extends ElasticsearchRepository<PersonAccountEs, String> {

}
