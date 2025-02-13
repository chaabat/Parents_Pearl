package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.model.BehaviorRecord;
import com.parentsPearl.repository.BehaviorRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.BehaviorService;
import com.parentsPearl.mapper.BehaviorRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BehaviorServiceImpl implements BehaviorService {
    
    private final BehaviorRepository behaviorRepository;
    private final BehaviorRecordMapper behaviorMapper;
    private final UserRepository userRepository;
    
    @Override
    public List<BehaviorRecordResponse> findAll() {
        return behaviorRepository.findAll().stream()
                .map(behaviorMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<BehaviorRecordResponse> findById(String id) {
        return behaviorRepository.findById(id)
                .map(behaviorMapper::toResponse);
    }
    
        @Override
        public BehaviorRecordResponse save(BehaviorRecordRequest request) {
            BehaviorRecord entity = behaviorMapper.toEntity(request);
            
            // Set the child ID
                userRepository.findById(request.getChildId())
                    .orElseThrow(() -> new RuntimeException("Child not found"));
            entity.setChildId(request.getChildId());
            
            // Set the logged by ID (assuming it comes from security context)
            String loggedById = "1";  
            userRepository.findById(loggedById)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            entity.setLoggedById(loggedById);
            
            BehaviorRecord saved = behaviorRepository.save(entity);
            return behaviorMapper.toResponse(saved);
        }
    
    @Override
    public void deleteById(String id) {
        behaviorRepository.deleteById(id);
    }
} 