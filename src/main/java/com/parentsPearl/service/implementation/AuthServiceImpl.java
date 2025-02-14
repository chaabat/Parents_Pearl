package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.LoginRequest;
import com.parentsPearl.dto.request.ParentRegistrationRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.model.User;
import com.parentsPearl.model.enums.Role;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.AuthService;
import com.parentsPearl.mapper.UserMapper;
import com.parentsPearl.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil tokenProvider;
    
    @Override
    public UserResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse response = userMapper.toResponse(user);
        response.setToken(jwt);
        
        return response;
    }

    @Override
    public UserResponse registerParent(ParentRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User parent = userMapper.toEntity(request);
        parent.setPassword(passwordEncoder.encode(request.getPassword()));
        parent.setRole(Role.PARENT);
        parent.setStatus("ACTIVE");

        User saved = userRepository.save(parent);
        return userMapper.toResponse(saved);
    }

    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    @Override
    public UserResponse refreshToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }
        
        String newToken = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserResponse response = userMapper.toResponse(user);
        response.setToken(newToken);
        
        return response;
    }
}