package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import com.parentsPearl.exception.ResourceNotFoundException;
import com.parentsPearl.model.Parent;
import com.parentsPearl.model.enums.Role;
import com.parentsPearl.repository.ParentRepository;
import com.parentsPearl.service.interfaces.ParentService;
import com.parentsPearl.mapper.ParentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
 
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {
    
    private final ParentRepository parentRepository;
    private final ParentMapper parentMapper;
    
    @Override
    public List<ParentResponse> findAll() {
        return parentRepository.findAll().stream()
                .map(parentMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
        public ParentResponse findById(Long id) {
        return parentRepository.findById(id)
                .map(parentMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", id));
    }
    @Override
    public ParentResponse save(ParentRequest request) {
        Parent entity = parentMapper.toEntity(request);
        entity.setRole(Role.PARENT);
        Parent saved = parentRepository.save(entity);
        return parentMapper.toResponse(saved);
    }
    @Override
    public void deleteById(Long id) {
        parentRepository.deleteById(id);
    }
} 