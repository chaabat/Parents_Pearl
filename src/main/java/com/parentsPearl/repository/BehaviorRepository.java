package com.parentsPearl.repository;

import com.parentsPearl.model.BehaviorRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BehaviorRepository extends MongoRepository<BehaviorRecord, String> {
}
