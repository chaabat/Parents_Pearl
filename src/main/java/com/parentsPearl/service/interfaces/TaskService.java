package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<TaskResponse> findAll();
    Optional<TaskResponse> findById(String id);
    TaskResponse save(TaskRequest task);
    void deleteById(String id);
    TaskResponse update(String id, TaskRequest task);
    List<TaskResponse> getTasksByAssignedTo(String assignedToId);
    List<TaskResponse> getTasksByCreatedBy(String createdById);
}
