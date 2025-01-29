package com.parentsPearl.repository;

 import com.parentsPearl.model.BehaviorRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BehaviorRepository extends JpaRepository<BehaviorRecord, Long> {

}
