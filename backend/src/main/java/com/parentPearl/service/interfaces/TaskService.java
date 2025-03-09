package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.TaskRequest;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.TaskAnswerResponse;
import com.parentPearl.model.enums.TaskStatus;
import java.util.List;

public interface TaskService {
    // Parent operations (require parentId for verification)
    TaskResponse createTask(Long parentId, Long childId, TaskRequest request);
    TaskResponse updateTask(Long parentId, Long childId, Long taskId, TaskRequest request);
    void deleteTask(Long parentId, Long childId, Long taskId);
    
    // Parent view operations
    List<TaskResponse> getAllTasks(Long parentId);
    List<TaskResponse> getChildTasks(Long parentId, Long childId);
    List<TaskResponse> getChildTasksByStatus(Long parentId, Long childId, TaskStatus status);
    List<TaskResponse> searchChildTasks(Long parentId, Long childId, String keyword);
    TaskResponse getTaskDetails(Long parentId, Long taskId);
    
    // Child operations (only need childId)
    TaskAnswerResponse submitTaskAnswer(Long childId, Long taskId, String answer);
    List<TaskResponse> getMyTasks(Long childId);

    List<TaskResponse> searchMyTasks(Long childId, String keyword);
    TaskResponse viewMyTask(Long childId, Long taskId);
    TaskResponse completeTask(Long childId, Long taskId);
} 