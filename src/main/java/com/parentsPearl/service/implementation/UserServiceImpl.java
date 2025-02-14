package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.UserService;
import com.parentsPearl.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.parentsPearl.model.enums.Role;
import com.parentsPearl.model.Parent;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(user -> userMapper.toResponse((Parent) user))
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<UserResponse> findById(String id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse);
    }
    
    @Override
    public UserResponse save(UserRequest request) {
        User entity = userMapper.toEntity(request);
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(entity);
        return userMapper.toResponse(saved);
    }
    
    @Override
    public UserResponse update(String id, UserRequest request) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setFirstName(request.getFirstName());
                    existingUser.setLastName(request.getLastName());
                    existingUser.setEmail(request.getEmail());
                    existingUser.setRole(request.getRole());
                    
                    User updated = userRepository.save(existingUser);
                    return userMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Override
    public void changePassword(String id, String newPassword) {
        userRepository.findById(id)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Override
    public void resetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        String temporaryPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);
        
        sendPasswordResetEmail(user.getEmail(), temporaryPassword);
    }
    
   
    
    @Override
    public UserResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    private String generateTemporaryPassword() {
        return java.util.UUID.randomUUID().toString().substring(0, 10);
    }
    
    private void sendPasswordResetEmail(String email, String temporaryPassword) {
        // TODO: Implement email sending logic
    }

    @Override
    public void softDelete(String id) {
        userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setDeletedAt(LocalDateTime.now());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public UserResponse updateStatus(String id, String status) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setStatus(status);
                    User updated = userRepository.save(existingUser);
                    return userMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public UserResponse updateRole(String id, String role) {
        Parent user = (Parent) userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role));
        Parent updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }
} 