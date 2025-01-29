package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import com.parentsPearl.model.Task;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.TaskRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.TaskService;
import com.parentsPearl.mapper.TaskMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;
    
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository,
                         TaskMapper taskMapper,
                         UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<TaskResponse> findById(Long id) {
        return taskRepository.findById(id)
                .map(taskMapper::toResponse);
    }
    
    @Override
    public TaskResponse save(TaskRequest request) {
        Task entity = taskMapper.toEntity(request);
        
        // Set assigned user
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        entity.setAssignedTo(assignedTo);
        
        // Set creator (from security context)
        User creator = userRepository.findById(1L) // TODO: Replace with actual logged-in user
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setCreatedBy(creator);
        
        Task saved = taskRepository.save(entity);
        return taskMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse update(Long id, TaskRequest request) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    // Update basic fields
                    existingTask.setTitle(request.getTitle());
                    existingTask.setDescription(request.getDescription());
                    existingTask.setDueDate(request.getDueDate());
                    existingTask.setStatus(request.getStatus());
                    existingTask.setPoints(request.getPoints());
                    
                    // Update assigned user if changed
                    if (!existingTask.getAssignedTo().getId().equals(request.getAssignedToId())) {
                        User assignedTo = userRepository.findById(request.getAssignedToId())
                                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
                        existingTask.setAssignedTo(assignedTo);
                    }
                    
                    Task updated = taskRepository.save(existingTask);
                    return taskMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
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