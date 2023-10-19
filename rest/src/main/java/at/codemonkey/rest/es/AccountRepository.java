package at.codemonkey.rest.es;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface AccountRepository extends ElasticsearchRepository<AccountEs, String> {

}
