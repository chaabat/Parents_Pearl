package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import com.parentsPearl.exception.ResourceNotFoundException;
import com.parentsPearl.model.Task;
import com.parentsPearl.repository.TaskRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.TaskService;
import com.parentsPearl.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.parentsPearl.util.SecurityUtils;

import java.util.List;
 
import java.util.stream.Collectors;

@Service
@Transactional
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
    public TaskResponse findById(Long id) {
        return taskRepository.findById(id)
                .map(taskMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }
    
    @Override
    public TaskResponse save(TaskRequest request) {
        Task task = taskMapper.toEntity(request);
        Long assignedToId = Long.parseLong(request.getAssignedToId());
        Long creatorId = SecurityUtils.getCurrentUserId();
        
        userRepository.findById(assignedToId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedToId));
        task.setAssignedToId(assignedToId);
        task.setCreatedById(creatorId);
        
        return taskMapper.toResponse(taskRepository.save(task));
    }
    
    @Override
    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse update(Long id, TaskRequest request) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(request.getTitle());
                    existingTask.setDescription(request.getDescription());
                    existingTask.setStatus(request.getStatus());
                    existingTask.setPoints(request.getPoints());
                    
                    if (request.getAssignedToId() != null) {
                        Long assignedToId = Long.parseLong(request.getAssignedToId());
                        if (!existingTask.getAssignedToId().equals(assignedToId)) {
                            userRepository.findById(assignedToId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedToId));
                            existingTask.setAssignedToId(assignedToId);
                        }
                    }
                    
                    return taskMapper.toResponse(taskRepository.save(existingTask));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    @Override
    public List<TaskResponse> getTasksByAssignedTo(Long assignedToId) {
        return taskRepository.findByAssignedToId(assignedToId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByCreatedBy(Long createdById) {
        return taskRepository.findByCreatedById(createdById).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
} 