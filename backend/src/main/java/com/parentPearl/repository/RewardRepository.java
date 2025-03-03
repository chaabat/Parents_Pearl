package com.parentPearl.repository;

import com.parentPearl.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    
    @Query("SELECT r FROM Reward r WHERE r.id = :rewardId AND r.parentId = :parentId")
    Optional<Reward> findByIdAndParentId(@Param("rewardId") Long rewardId, @Param("parentId") Long parentId);
    
    @Query("SELECT r FROM Reward r WHERE r.parentId = :parentId")
    List<Reward> findAllByParentId(@Param("parentId") Long parentId);
}
