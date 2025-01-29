package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.UserService;
import com.parentsPearl.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                         UserMapper userMapper,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<UserResponse> findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse);
    }
    
    @Override
    public UserResponse save(UserRequest request) {
        User entity = userMapper.toEntity(request);
        // Encode password before saving
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(entity);
        return userMapper.toResponse(saved);
    }
    
    @Override
    public UserResponse update(Long id, UserRequest request) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    // Update fields except password
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
    public void changePassword(Long id, String newPassword) {
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
        
        // Generate random password or token
        String temporaryPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);
        
        // TODO: Send email with temporary password
        sendPasswordResetEmail(user.getEmail(), temporaryPassword);
    }
    
    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
    
    @Override
    public UserResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    private String generateTemporaryPassword() {
        // Generate a random 10-character password
        return java.util.UUID.randomUUID().toString().substring(0, 10);
    }
    
    private void sendPasswordResetEmail(String email, String temporaryPassword) {
        // TODO: Implement email sending logic
        // This could use JavaMailSender or an email service
    }
} 