package com.parentPearl.service;

import com.parentPearl.dto.request.TaskRequest;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.mapper.TaskMapper;
import com.parentPearl.dto.response.TaskAnswerResponse;
import com.parentPearl.model.Child;
import com.parentPearl.model.Parent;
import com.parentPearl.model.Task;
import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.TaskRepository;
import com.parentPearl.service.implementation.TaskServiceImpl;
import com.parentPearl.service.interfaces.PointService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ChildRepository childRepository;

    @Mock
    private PointService pointService;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Child child;
    private Task task;
    private TaskRequest taskRequest;

    @BeforeEach
    void setUp() {
        child = Child.builder()
                .id(1L)
                .name("Test Child")
                .totalPoints(0)
                .build();

        task = Task.builder()
                .id(1L)
                .title("Math Test")
                .description("Solve 2+2")
                .correctAnswer("4")
                .pointValue(10)
                .status(TaskStatus.PENDING)
                .child(child)
                .build();

        taskRequest = new TaskRequest();
        taskRequest.setTitle("Math Test");
        taskRequest.setDescription("Solve 2+2");
        taskRequest.setCorrectAnswer("4");
        taskRequest.setPointValue(10);
        taskRequest.setChildId(1L);

        Parent parent = Parent.builder()
                .id(1L)
                .build();
        child.setParent(parent);
    }

    @Test
    void createTask_Success() {
        when(childRepository.findByIdAndParentId(anyLong(), anyLong()))
                .thenReturn(Optional.of(child));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toEntity(any(TaskRequest.class))).thenReturn(task);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(
            TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .status(task.getStatus())
                .pointValue(task.getPointValue())
                .build()
        );

        TaskResponse response = taskService.createTask(1L, 1L, taskRequest);

        assertNotNull(response);
        assertEquals(task.getTitle(), response.getTitle());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void submitTaskAnswer_CorrectAnswer_Success() {
        task.setStatus(TaskStatus.PENDING);
        Task completedTask = Task.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .correctAnswer(task.getCorrectAnswer())
                .pointValue(task.getPointValue())
                .status(TaskStatus.COMPLETED)
                .child(task.getChild())
                .build();

        when(taskRepository.findById(anyLong())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(completedTask);
        when(pointService.awardPoints(anyLong(), anyLong(), any())).thenReturn(null);

        TaskAnswerResponse response = taskService.submitTaskAnswer(1L, 1L, "4");

        assertTrue(response.isCorrect());
        assertEquals(10, response.getPointsEarned());
        verify(taskRepository).save(any(Task.class));
        verify(pointService).awardPoints(anyLong(), anyLong(), any());
    }

    @Test
    void getChildTasks_Success() {
        when(childRepository.findByIdAndParentId(anyLong(), anyLong()))
                .thenReturn(Optional.of(child));
        when(taskRepository.findAllByChildId(anyLong()))
                .thenReturn(Arrays.asList(task));
        when(taskMapper.toResponse(any(Task.class))).thenReturn(
            TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .status(task.getStatus())
                .pointValue(task.getPointValue())
                .build()
        );

        List<TaskResponse> responses = taskService.getChildTasks(1L, 1L);

        assertNotNull(responses);
        assertFalse(responses.isEmpty());
        assertEquals(task.getTitle(), responses.get(0).getTitle());
    }

    @Test
    void completeTask_Success() {
        // Given
        task.setStatus(TaskStatus.PENDING);
        
        when(taskRepository.findByIdAndChildId(anyLong(), anyLong()))
                .thenReturn(Optional.of(task));
        when(taskRepository.save(argThat(savedTask -> 
            savedTask.getStatus() == TaskStatus.COMPLETED
        ))).thenReturn(task);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(
            TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .status(TaskStatus.COMPLETED)
                .pointValue(task.getPointValue())
                .build()
        );

        // When
        TaskResponse response = taskService.completeTask(1L, 1L);

        // Then
        assertEquals(TaskStatus.COMPLETED, response.getStatus());
        verify(taskRepository).findByIdAndChildId(anyLong(), anyLong());
        verify(taskRepository).save(argThat(savedTask -> 
            savedTask.getStatus() == TaskStatus.COMPLETED
        ));
        verify(taskMapper).toResponse(any(Task.class));
    }
} 