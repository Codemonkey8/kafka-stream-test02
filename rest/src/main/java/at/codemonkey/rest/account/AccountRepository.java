package at.codemonkey.rest.account;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface AccountRepository extends ElasticsearchRepository<AccountEs, String> {

}
