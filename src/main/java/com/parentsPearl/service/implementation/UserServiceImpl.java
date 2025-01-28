package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.UserService;
import com.parentsPearl.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                         UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
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
        User saved = userRepository.save(entity);
        return userMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
} 