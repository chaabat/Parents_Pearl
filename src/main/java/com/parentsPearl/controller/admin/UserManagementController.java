package com.parentsPearl.controller.admin;

import com.parentsPearl.service.interfaces.UserService;
import com.parentsPearl.dto.response.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserManagementController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found")));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable String id, @RequestBody String status) {
        return ResponseEntity.ok(userService.updateStatus(id, status));
    }
    
    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable String id, @RequestBody String role) {
        return ResponseEntity.ok(userService.updateRole(id, role));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.softDelete(id);
        return ResponseEntity.ok().build();
    }
    

} 