package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.AdminRequest;
import com.parentPearl.dto.response.AdminResponse;
import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<ParentResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllParents());
    }

    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<Void> banUser(
            @PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> request) {
        String reason = request != null ? request.get("reason") : "No reason provided";
        adminService.banUser(userId, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok().build();
    }

    // Parent Management
    @GetMapping("/parents")
    public ResponseEntity<List<ParentResponse>> getAllParents() {
        return ResponseEntity.ok(adminService.getAllParents());
    }

    @GetMapping("/parents/banned")
    public ResponseEntity<List<ParentResponse>> getBannedParents() {
        return ResponseEntity.ok(adminService.getBannedParents());
    }

    // Child Management
    @GetMapping("/children")
    public ResponseEntity<List<ChildResponse>> getAllChildren() {
        return ResponseEntity.ok(adminService.getAllChildren());
    }

    @GetMapping("/children/banned")
    public ResponseEntity<List<ChildResponse>> getBannedChildren() {
        return ResponseEntity.ok(adminService.getBannedChildren());
    }

    // Admin Profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<AdminResponse> getAdminProfile(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<AdminResponse> updateAdminProfile(
            @PathVariable Long id,
            @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(id, request));
    }

    // Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getSystemStats() {
        return ResponseEntity.ok(Map.of(
            "activeUsers", adminService.getTotalActiveUsers(),
            "bannedUsers", adminService.getTotalBannedUsers(),
            "completedTasks", adminService.getTotalCompletedTasks()
        ));
    }
}


