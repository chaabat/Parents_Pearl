package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.TaskRequest;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.TaskAnswerResponse;
import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.service.interfaces.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // Parent endpoints
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/api/parents/{parentId}/children/{childId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(parentId, childId, request));
    }

    @PreAuthorize("hasRole('PARENT')")
    @PutMapping("/api/parents/{parentId}/children/{childId}/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @PathVariable Long taskId,
            @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(parentId, childId, taskId, request));
    }

    @PreAuthorize("hasRole('PARENT')")
    @DeleteMapping("/api/parents/{parentId}/children/{childId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @PathVariable Long taskId) {
        taskService.deleteTask(parentId, childId, taskId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/children/{childId}/tasks")
    public ResponseEntity<List<TaskResponse>> getChildTasks(
            @PathVariable Long parentId,
            @PathVariable Long childId) {
        return ResponseEntity.ok(taskService.getChildTasks(parentId, childId));
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/children/{childId}/tasks/status/{status}")
    public ResponseEntity<List<TaskResponse>> getChildTasksByStatus(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.getChildTasksByStatus(parentId, childId, status));
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/children/{childId}/tasks/search")
    public ResponseEntity<List<TaskResponse>> searchChildTasks(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @RequestParam String keyword) {
        return ResponseEntity.ok(taskService.searchChildTasks(parentId, childId, keyword));
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTaskDetails(
            @PathVariable Long parentId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskDetails(parentId, taskId));
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @PathVariable Long parentId) {
        return ResponseEntity.ok(taskService.getAllTasks(parentId));
    }

    // Child endpoints
    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/api/children/{childId}/my-tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks(
            @PathVariable Long childId) {
        return ResponseEntity.ok(taskService.getMyTasks(childId));
    }

    @PreAuthorize("hasRole('CHILD')")
    @PostMapping("/api/children/{childId}/tasks/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable Long childId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.completeTask(childId, taskId));
    }

    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/api/children/{childId}/tasks/{taskId}")
    public ResponseEntity<TaskResponse> viewMyTask(
            @PathVariable Long childId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.viewMyTask(childId, taskId));
    }

    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/api/children/{childId}/tasks/search")
    public ResponseEntity<List<TaskResponse>> searchMyTasks(
            @PathVariable Long childId,
            @RequestParam String keyword) {
        return ResponseEntity.ok(taskService.searchMyTasks(childId, keyword));
    }

    @PreAuthorize("hasRole('CHILD')")
    @PostMapping("/api/children/{childId}/tasks/{taskId}/submit")
    public ResponseEntity<TaskAnswerResponse> submitTaskAnswer(
            @PathVariable Long childId,
            @PathVariable Long taskId,
            @RequestBody String answer) {
        return ResponseEntity.ok(taskService.submitTaskAnswer(childId, taskId, answer));
    }
}
