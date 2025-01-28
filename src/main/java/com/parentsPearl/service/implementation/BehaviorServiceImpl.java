package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.model.BehaviorRecord;
import com.parentsPearl.model.Child;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.BehaviorRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.BehaviorService;
import com.parentsPearl.mapper.BehaviorRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BehaviorServiceImpl implements BehaviorService {
    
    private final BehaviorRepository behaviorRepository;
    private final BehaviorRecordMapper behaviorMapper;
    private final UserRepository userRepository;
    
    @Autowired
    public BehaviorServiceImpl(BehaviorRepository behaviorRepository, 
                             BehaviorRecordMapper behaviorMapper,
                             UserRepository userRepository) {
        this.behaviorRepository = behaviorRepository;
        this.behaviorMapper = behaviorMapper;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<BehaviorRecordResponse> findAll() {
        return behaviorRepository.findAll().stream()
                .map(behaviorMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<BehaviorRecordResponse> findById(Long id) {
        return behaviorRepository.findById(id)
                .map(behaviorMapper::toResponse);
    }
    
    @Override
    public BehaviorRecordResponse save(BehaviorRecordRequest request) {
        BehaviorRecord entity = behaviorMapper.toEntity(request);
        
        // Set the child
        Child child = (Child) userRepository.findById(request.getChildId())
                .orElseThrow(() -> new RuntimeException("Child not found"));
        entity.setChild(child);
        
        // Set the logged by user (assuming it comes from security context)
        User loggedBy = userRepository.findById(1L) // TODO: Replace with actual logged-in user
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setLoggedBy(loggedBy);
        
        BehaviorRecord saved = behaviorRepository.save(entity);
        return behaviorMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        behaviorRepository.deleteById(id);
    }
} 