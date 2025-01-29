package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<TaskResponse> findAll();
    Optional<TaskResponse> findById(Long id);
    TaskResponse save(TaskRequest task);
    void deleteById(Long id);
    TaskResponse update(Long id, TaskRequest task);
    List<TaskResponse> getTasksByAssignedTo(Long assignedToId);
    List<TaskResponse> getTasksByCreatedBy(Long createdById);
}
