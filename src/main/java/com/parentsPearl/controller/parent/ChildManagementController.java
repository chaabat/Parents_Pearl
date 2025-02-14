package com.parentsPearl.controller.parent;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent/children")
@PreAuthorize("hasRole('PARENT')")
public class ChildManagementController {

    // CRUD children
    @PostMapping
    public void createChild() {
        // Implementation needed
    }

    @GetMapping("/{id}")
    public void getChild() {
        // Implementation needed
    }

    @PutMapping("/{id}")
    public void updateChild() {
        // Implementation needed
    }

    @DeleteMapping("/{id}")
    public void deleteChild() {
        // Implementation needed
    }

    // Get child behavior
    @GetMapping("/behavior")
    public void getChildBehavior() {
        // Implementation needed
    }

    // Get child progress
    @GetMapping("/progress")
    public void getChildProgress() {
        // Implementation needed
    }

    // Get child tasks
    @GetMapping("/tasks")
    public void getChildTasks() {
        // Implementation needed
    }

    // Get child rewards
    @GetMapping("/rewards")
    public void getChildRewards() {
        // Implementation needed
    }

    // Update child avatar
    @PutMapping("/{id}/avatar")
    public void updateChildAvatar() {
        // Implementation needed
    }
} 