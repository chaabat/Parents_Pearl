package com.parentPearl.controller.auth;

import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.PointResponse;
import com.parentPearl.service.interfaces.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD')")  // Seuls les enfants peuvent accéder à ces endpoints
public class ChildController {

    private final ChildService childService;

    @GetMapping("/{childId}/profile")
    public ResponseEntity<ChildResponse> getChildProfile(@PathVariable Long childId) {
        return ResponseEntity.ok(childService.getChildById(childId));
    }

    @GetMapping("/{childId}/tasks")
    public ResponseEntity<List<TaskResponse>> getChildTasks(@PathVariable Long childId) {
        return ResponseEntity.ok(childService.getChildTasks(childId));
    }

    @GetMapping("/{childId}/points/history")
    public ResponseEntity<List<PointResponse>> getPointHistory(@PathVariable Long childId) {
        return ResponseEntity.ok(childService.getChildPoints(childId));
    }

    @GetMapping("/{childId}/points/total")
    public ResponseEntity<Integer> getTotalPoints(@PathVariable Long childId) {
        return ResponseEntity.ok(childService.getTotalPoints(childId));
    }
}
