package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.exception.ResourceNotFoundException;
import com.parentsPearl.model.BehaviorRecord;
import com.parentsPearl.repository.BehaviorRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.BehaviorService;
import com.parentsPearl.mapper.BehaviorRecordMapper;
import com.parentsPearl.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BehaviorServiceImpl implements BehaviorService {
    
    private final BehaviorRepository behaviorRepository;
    private final BehaviorRecordMapper behaviorMapper;
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<BehaviorRecordResponse> findAll() {
        return behaviorRepository.findAll().stream()
                .map(behaviorMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<BehaviorRecordResponse> findById(Long id) {
        return behaviorRepository.findById(id)
                .map(behaviorMapper::toResponse);
    }
    
    @Override
    public BehaviorRecordResponse create(BehaviorRecordRequest request) {
        BehaviorRecord entity = behaviorMapper.toEntity(request);
        
        Long childId = Long.parseLong(request.getChildId());
        Long loggedById = SecurityUtils.getCurrentUserId();
        
        userRepository.findById(childId)
            .orElseThrow(() -> new ResourceNotFoundException("Child", "id", childId));
        entity.setChildId(childId);
        
        userRepository.findById(loggedById)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", loggedById));
        entity.setLoggedById(loggedById);
        
        return behaviorMapper.toResponse(behaviorRepository.save(entity));
    }
    
    @Override
    public void deleteById(Long id) {
        behaviorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("BehaviorRecord", "id", id));
        behaviorRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BehaviorRecordResponse> findByChildId(Long childId) {
        return behaviorRepository.findByChildId(childId).stream()
                .map(behaviorMapper::toResponse)
                .collect(Collectors.toList());
    }
} 