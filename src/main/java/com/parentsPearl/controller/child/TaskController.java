package com.parentsPearl.controller.child;

import com.parentsPearl.service.interfaces.TaskService;
import com.parentsPearl.dto.response.TaskResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/child/tasks")
@PreAuthorize("hasRole('CHILD')")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAssignedTasks() {
        return ResponseEntity.ok(taskService.findAll());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markTaskComplete(@PathVariable String id) {
        return ResponseEntity.ok(taskService.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found")));
    }

    @GetMapping("/progress")
    public ResponseEntity<TaskResponse> getProgress() {
        return ResponseEntity.ok(taskService.findById("progress")
            .orElseThrow(() -> new RuntimeException("Progress not found")));
    }
} 