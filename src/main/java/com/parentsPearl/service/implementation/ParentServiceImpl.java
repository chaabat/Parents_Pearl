package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import com.parentsPearl.model.Parent;
import com.parentsPearl.repository.ParentRepository;
import com.parentsPearl.service.interfaces.ParentService;
import com.parentsPearl.mapper.ParentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParentServiceImpl implements ParentService {
    
    private final ParentRepository parentRepository;
    private final ParentMapper parentMapper;
    
    @Autowired
    public ParentServiceImpl(ParentRepository parentRepository,
                           ParentMapper parentMapper) {
        this.parentRepository = parentRepository;
        this.parentMapper = parentMapper;
    }
    
    @Override
    public List<ParentResponse> findAll() {
        return parentRepository.findAll().stream()
                .map(parentMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ParentResponse> findById(Long id) {
        return parentRepository.findById(id)
                .map(parentMapper::toResponse);
    }
    
    @Override
    public ParentResponse save(ParentRequest request) {
        Parent entity = parentMapper.toEntity(request);
        Parent saved = parentRepository.save(entity);
        return parentMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        parentRepository.deleteById(id);
    }
} 