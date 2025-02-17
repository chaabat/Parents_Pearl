package com.parentsPearl.repository;

import com.parentsPearl.model.BehaviorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BehaviorRepository extends JpaRepository<BehaviorRecord, Long> {
    List<BehaviorRecord> findByChildId(Long childId);
    List<BehaviorRecord> findByLoggedById(Long loggedById);
}
