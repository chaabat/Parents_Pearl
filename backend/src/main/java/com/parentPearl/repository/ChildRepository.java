package com.parentPearl.repository;

import com.parentPearl.model.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChildRepository extends JpaRepository<Child, Long> {
    @Query("SELECT c FROM Child c WHERE c.parent.id = :parentId AND c.deleted = false")
    List<Child> findByParentId(@Param("parentId") Long parentId);
    
    @Query("SELECT c FROM Child c WHERE c.role = 'CHILD' AND c.deleted = false")
    List<Child> findAllActive();
    
    @Query("SELECT c FROM Child c WHERE c.role = 'CHILD' AND c.deleted = true") 
    List<Child> findAllBanned();
    
    @Query("SELECT COUNT(c) FROM Child c WHERE c.role = 'CHILD' AND c.deleted = true")
    int countBannedUsers();

    @Query("SELECT c FROM Child c WHERE c.id = :childId AND c.deleted = false")
    Optional<Child> findByIdAndNotBanned(@Param("childId") Long childId);

    @Query("SELECT c FROM Child c WHERE c.id = :childId AND c.parent.id = :parentId AND c.deleted = false")
    Optional<Child> findByIdAndParentId(@Param("childId") Long childId, @Param("parentId") Long parentId);
}
