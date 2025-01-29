package com.parentsPearl.repository;

import com.parentsPearl.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    // No additional methods needed for now
}
