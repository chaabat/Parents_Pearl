package com.parentsPearl.controller.auth;

import com.parentsPearl.dto.request.LoginRequest;
import com.parentsPearl.dto.request.ParentRegistrationRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.service.interfaces.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/register/parent")
    public ResponseEntity<UserResponse> registerParent(@RequestBody ParentRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerParent(request));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<UserResponse> refreshToken() {
        return ResponseEntity.ok(authService.refreshToken());
    }
}