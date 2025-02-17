package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.exception.ResourceNotFoundException;
import com.parentsPearl.model.Child;
import com.parentsPearl.model.Parent;
import com.parentsPearl.repository.ChildRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.ChildService;
import com.parentsPearl.mapper.ChildMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ChildServiceImpl implements ChildService {
    
    private final ChildRepository childRepository;
    private final ChildMapper childMapper;
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<ChildResponse> findAll() {
        return childRepository.findAll().stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ChildResponse findById(Long id) {
        return childRepository.findById(id)
                .map(childMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Child", "id", id));
    }
    
    @Override
    public ChildResponse create(ChildRequest request) {
        Child child = childMapper.toEntity(request);
        Long parentId = Long.parseLong(request.getParentId());
        
        Parent parent = (Parent) userRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", parentId));
        child.setParent(parent);
        
        return childMapper.toResponse(childRepository.save(child));
    }
    
    @Override
    public ChildResponse update(Long id, ChildRequest request) {
        Child child = childRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Child", "id", id));
            
        // Direct entity update
        child.setFirstName(request.getFirstName());
        child.setLastName(request.getLastName());
        child.setAge(request.getAge());
        child.setGradeLevel(request.getGradeLevel());
        child.setInterests(request.getInterests());
        
        if (request.getParentId() != null) {
            Long parentId = Long.parseLong(request.getParentId());
            Parent parent = (Parent) userRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "id", parentId));
            child.setParent(parent);
        }
        
        return childMapper.toResponse(childRepository.save(child));
    }

    @Override
    public void delete(Long id) {
        if (!childRepository.existsById(id)) {
            throw new ResourceNotFoundException("Child", "id", id);
        }
        childRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChildResponse> findByParentId(Long parentId) {
        return childRepository.findByParentId(parentId).stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
}