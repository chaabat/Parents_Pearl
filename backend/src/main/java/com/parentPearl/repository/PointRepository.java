package com.parentPearl.repository;

import com.parentPearl.model.Point;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    List<Point> findByChildId(Long childId);

    @Query("SELECT p FROM Point p WHERE p.child.id = :childId ORDER BY p.createdAt DESC")
    List<Point> findAllByChildId(@Param("childId") Long childId);
    
    @Query("SELECT COALESCE(SUM(p.points), 0) FROM Point p WHERE p.child.id = :childId AND p.child.deleted = false")
    int sumPointsByChildId(@Param("childId") Long childId);

    Optional<Point> findByChildIdAndReasonAndCreatedAtBetween(
        Long childId, 
        String reason, 
        LocalDateTime startDate,
        LocalDateTime endDate
    );
}
