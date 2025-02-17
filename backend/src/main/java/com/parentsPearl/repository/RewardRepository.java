package com.parentsPearl.repository;

import com.parentsPearl.model.Reward;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByClaimedById(Long claimedById);
}
