package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import com.parentsPearl.model.Task;
 import com.parentsPearl.repository.TaskRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.TaskService;
import com.parentsPearl.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;
    
    @Override
    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<TaskResponse> findById(String id) {
        return taskRepository.findById(id)
                .map(taskMapper::toResponse);
    }
    
    @Override
    public TaskResponse save(TaskRequest request) {
        Task entity = taskMapper.toEntity(request);
        
        // Verify assigned user exists
        userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        entity.setAssignedToId(request.getAssignedToId());
        
        // Set creator ID (from security context)
        String creatorId = "1";  
        userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setCreatedById(creatorId);
        
        Task saved = taskRepository.save(entity);
        return taskMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(String id) {
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse update(String id, TaskRequest request) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(request.getTitle());
                    existingTask.setDescription(request.getDescription());
                    existingTask.setDueDate(request.getDueDate());
                    existingTask.setStatus(request.getStatus());
                    existingTask.setPoints(request.getPoints());
                    
                    if (!existingTask.getAssignedToId().equals(request.getAssignedToId())) {
                        userRepository.findById(request.getAssignedToId())
                                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
                        existingTask.setAssignedToId(request.getAssignedToId());
                    }
                    
                    Task updated = taskRepository.save(existingTask);
                    return taskMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public List<TaskResponse> getTasksByAssignedTo(String assignedToId) {
        return taskRepository.findByAssignedToId(assignedToId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByCreatedBy(String createdById) {
        return taskRepository.findByCreatedById(createdById).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
} 