package com.parentsPearl.controller.parent;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.dto.response.TaskResponse;
import com.parentsPearl.service.interfaces.ChildService;
import com.parentsPearl.service.interfaces.BehaviorService;
import com.parentsPearl.service.interfaces.TaskService;
import com.parentsPearl.service.interfaces.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/parent/children")
@PreAuthorize("hasRole('PARENT')")
@RequiredArgsConstructor
public class ChildManagementController {
    
    private final ChildService childService;
    private final BehaviorService behaviorService;
    private final TaskService taskService;
    private final RewardService rewardService;

    @PostMapping
    public ResponseEntity<ChildResponse> createChild(@RequestBody ChildRequest request) {
        return ResponseEntity.ok(childService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getChild(@PathVariable Long id) {
        return ResponseEntity.ok(childService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildResponse> updateChild(
            @PathVariable Long id, 
            @RequestBody ChildRequest request) {
        return ResponseEntity.ok(childService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable Long id) {
        childService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/behavior")
    public ResponseEntity<List<BehaviorRecordResponse>> getChildBehavior(@PathVariable Long id) {
        return ResponseEntity.ok(behaviorService.findByChildId(id));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskResponse>> getChildTasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTasksByAssignedTo(id));
    }

    @GetMapping("/{id}/rewards")
    public ResponseEntity<List<RewardResponse>> getChildRewards(@PathVariable Long id) {
        return ResponseEntity.ok(rewardService.findByChildId(id));
    }

  
} 