package com.parentPearl.repository;

import com.parentPearl.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
 

import java.util.List;
 

public interface ParentRepository extends JpaRepository<Parent, Long> {
    
    @Query("SELECT p FROM Parent p WHERE p.role = 'PARENT' AND p.deleted = false")
    List<Parent> findAllActive();
    
    @Query("SELECT p FROM Parent p WHERE p.role = 'PARENT' AND p.deleted = true")
    List<Parent> findAllBanned();
    
    @Query("SELECT COUNT(p) FROM Parent p WHERE p.role = 'PARENT' AND p.deleted = true")
    int countBannedUsers();
    
   
    
   
}
