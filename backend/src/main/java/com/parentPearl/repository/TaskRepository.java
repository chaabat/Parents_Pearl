package com.parentPearl.repository;

import com.parentPearl.model.Task;
import com.parentPearl.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.child.id = :childId")
    List<Task> findAllByChildId(@Param("childId") Long childId);
    
    @Query("SELECT t FROM Task t WHERE t.child.id = :childId AND t.status = :status")
    List<Task> findAllByChildIdAndStatus(@Param("childId") Long childId, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.id = :taskId AND t.child.id = :childId")
    Optional<Task> findByIdAndChildId(@Param("taskId") Long taskId, @Param("childId") Long childId);
    
    @Query("SELECT t FROM Task t WHERE t.id = :taskId AND t.child.parent.id = :parentId")
    Optional<Task> findByIdAndParentId(@Param("taskId") Long taskId, @Param("parentId") Long parentId);

    @Query("SELECT t FROM Task t WHERE t.child.id = :childId AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Task> findByChildIdAndTitle(@Param("childId") Long childId, @Param("title") String title);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'COMPLETED'")
    int countCompletedTasks();
}
