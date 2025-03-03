package com.parentPearl.repository;

import com.parentPearl.model.RewardRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    @Query("SELECT rd FROM RewardRedemption rd WHERE rd.child.id = :childId")
    List<RewardRedemption> findAllByChildId(@Param("childId") Long childId);
    
    @Query("SELECT rd FROM RewardRedemption rd WHERE rd.reward.id = :rewardId")
    List<RewardRedemption> findAllByRewardId(@Param("rewardId") Long rewardId);
}