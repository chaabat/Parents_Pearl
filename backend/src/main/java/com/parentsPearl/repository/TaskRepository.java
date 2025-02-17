package com.parentsPearl.repository;

import com.parentsPearl.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long assignedToId);
    List<Task> findByCreatedById(Long createdById);
}
