package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.model.Child;
import com.parentsPearl.model.Parent;
import com.parentsPearl.repository.ChildRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.ChildService;
import com.parentsPearl.mapper.ChildMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChildServiceImpl implements ChildService {
    
    private final ChildRepository childRepository;
    private final ChildMapper childMapper;
    private final UserRepository userRepository;
    
    @Autowired
    public ChildServiceImpl(ChildRepository childRepository,
                          ChildMapper childMapper,
                          UserRepository userRepository) {
        this.childRepository = childRepository;
        this.childMapper = childMapper;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<ChildResponse> findAll() {
        return childRepository.findAll().stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ChildResponse> findById(Long id) {
        return childRepository.findById(id)
                .map(childMapper::toResponse);
    }
    
    @Override
    public ChildResponse save(ChildRequest request) {
        Child entity = childMapper.toEntity(request);
        
        Parent parent = (Parent) userRepository.findById(request.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        entity.setParent(parent);
        
        Child saved = childRepository.save(entity);
        return childMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        childRepository.deleteById(id);
    }
}
