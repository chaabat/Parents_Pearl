package com.parentsPearl.repository;

import com.parentsPearl.model.EducationalResource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<EducationalResource, String> {

}
