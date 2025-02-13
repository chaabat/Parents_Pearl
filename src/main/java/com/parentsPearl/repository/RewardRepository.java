package com.parentsPearl.repository;

import com.parentsPearl.model.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends MongoRepository<Reward, String> {
    // No additional methods needed for now
}
