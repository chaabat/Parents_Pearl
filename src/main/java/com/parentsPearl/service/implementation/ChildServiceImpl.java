package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.model.Child;
import com.parentsPearl.repository.ChildRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.ChildService;
import com.parentsPearl.mapper.ChildMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChildServiceImpl implements ChildService {
    
    private final ChildRepository childRepository;
    private final ChildMapper childMapper;
    private final UserRepository userRepository;
    
    @Override
    public List<ChildResponse> findAll() {
        return childRepository.findAll().stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ChildResponse> findById(String id) {
        return childRepository.findById(id)
                .map(childMapper::toResponse);
    }
    
    @Override
    public ChildResponse save(ChildRequest request) {
        Child entity = childMapper.toEntity(request);
        
        userRepository.findById(request.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        entity.setParentId(request.getParentId());
        
        Child saved = childRepository.save(entity);
        return childMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(String id) {
        childRepository.deleteById(id);
    }

    @Override
    public ChildResponse update(String id, ChildRequest request) {
        return childRepository.findById(id)
                .map(existingChild -> {
                    existingChild.setFirstName(request.getFirstName());
                    existingChild.setLastName(request.getLastName());
                    existingChild.setAge(request.getAge());
                    existingChild.setGradeLevel(request.getGradeLevel());
                    existingChild.setInterests(request.getInterests());
                    
                    if (!existingChild.getParentId().equals(request.getParentId())) {
                        userRepository.findById(request.getParentId())
                                .orElseThrow(() -> new RuntimeException("Parent not found"));
                        existingChild.setParentId(request.getParentId());
                    }
                    
                    Child updated = childRepository.save(existingChild);
                    return childMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("Child not found with id: " + id));
    }

    @Override
    public List<ChildResponse> findByParentId(String parentId) {
        return childRepository.findByParentId(parentId).stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
}
