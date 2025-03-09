package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.request.TaskRequest;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.TaskAnswerResponse;
import com.parentPearl.exception.BadRequestException;
import com.parentPearl.exception.NotFoundException;
import com.parentPearl.mapper.TaskMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Task;
import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.TaskRepository;
import com.parentPearl.service.interfaces.PointService;
import com.parentPearl.service.interfaces.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ChildRepository childRepository;
    private final PointService pointService;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask(Long parentId, Long childId, TaskRequest request) {
        Child child = childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));

        Task task = taskMapper.toEntity(request);
        task.setChild(child);
        task = taskRepository.save(task);
        
        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse updateTask(Long parentId, Long childId, Long taskId, TaskRequest request) {
        Task task = taskRepository.findByIdAndChildId(taskId, childId)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));

        // Verify parent owns this child
        if (!task.getChild().getParent().getId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to parent with id: " + parentId);
        }

        taskMapper.updateEntity(task, request);
        return taskMapper.toResponse(task);
    }

    @Override
    public void deleteTask(Long parentId, Long childId, Long taskId) {
        Task task = taskRepository.findByIdAndChildId(taskId, childId)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));

        if (!task.getChild().getParent().getId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to parent with id: " + parentId);
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getChildTasks(Long parentId, Long childId) {
        // Verify child belongs to parent
        childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));

        return taskRepository.findAllByChildId(childId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getMyTasks(Long childId) {
        return taskRepository.findAllByChildId(childId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse completeTask(Long childId, Long taskId) {
        Task task = taskRepository.findByIdAndChildId(taskId, childId)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));

        task.setStatus(TaskStatus.COMPLETED);
        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse viewMyTask(Long childId, Long taskId) {
        return taskRepository.findByIdAndChildId(taskId, childId)
                .map(taskMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));
    }

    @Override
    public List<TaskResponse> searchMyTasks(Long childId, String keyword) {
        return taskRepository.findByChildIdAndTitle(childId, keyword).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskAnswerResponse submitTaskAnswer(Long childId, Long taskId, String answer) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Child child = task.getChild();
        if (!child.getId().equals(childId)) {
            throw new RuntimeException("Task does not belong to this child");
        }

        // Vérifier si la tâche a déjà été répondue
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new RuntimeException("This task has already been answered");
        }

        String studentAnswer = answer.replaceAll("[{}\"]", "")
                                   .replaceAll(".*:", "")
                                   .trim();
        
        boolean isCorrect = studentAnswer.equals(task.getCorrectAnswer());
        
        // Mettre à jour le statut en fonction de la réponse
        task.setStatus(isCorrect ? TaskStatus.COMPLETED : TaskStatus.FAILED);
        
        if (isCorrect) {
            child.addPoints(task.getPointValue());
            childRepository.save(child);
            pointService.awardPoints(child.getParent().getId(), childId, 
                new PointRequest(task.getPointValue(), "Correct answer for task: " + task.getTitle(), childId));
        }
        
        taskRepository.save(task);
        
        return TaskAnswerResponse.builder()
                .correct(isCorrect)
                .message(isCorrect ? 
                    "Bravo ! C'est la bonne réponse !" : 
                    "Ce n'est pas la bonne réponse. La tâche est marquée comme échouée.")
                .pointsEarned(isCorrect ? task.getPointValue() : 0)
                .task(taskMapper.toResponse(task))
                .build();
    }

    @Override
    public List<TaskResponse> getChildTasksByStatus(Long parentId, Long childId, TaskStatus status) {
        childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));
                
        return taskRepository.findAllByChildIdAndStatus(childId, status).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> searchChildTasks(Long parentId, Long childId, String keyword) {
        childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));
                
        return taskRepository.findByChildIdAndTitle(childId, keyword).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskDetails(Long parentId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));
                
        if (!task.getChild().getParent().getId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to parent with id: " + parentId);
        }
        
        return taskMapper.toResponse(task);
    }

    @Override
    public List<TaskResponse> getAllTasks(Long parentId) {
        return taskRepository.findAllByParentId(parentId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
} 