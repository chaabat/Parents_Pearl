package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.ChildRequest;
import com.parentPearl.dto.request.ParentRequest;
import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.mapper.ChildMapper;
import com.parentPearl.mapper.ParentMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Parent;
import com.parentPearl.model.Point;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.ParentRepository;
import com.parentPearl.repository.PointRepository;
import com.parentPearl.service.interfaces.ParentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.parentPearl.exception.NotFoundException;
 
@Service
@RequiredArgsConstructor
@Transactional
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final PointRepository pointRepository;
    private final ParentMapper parentMapper;
    private final ChildMapper childMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ParentResponse getParentById(Long id) {
        return parentRepository.findById(id)
                .map(parentMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Parent not found with id: " + id));
    }

    @Override
    @Transactional
    public ParentResponse updateParent(Long id, ParentRequest request) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        // If password is being updated, encode it
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            // Keep the old password if not updating
            request.setPassword(parent.getPassword());
        }
        
        parentMapper.updateEntity(parent, request);
        return parentMapper.toResponse(parent);
    }

    @Override
    public void softDeleteParent(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Parent not found with id: " + id));
        parent.setDeleted(true);
        childRepository.findByParentId(id)
                .forEach(child -> child.setDeleted(true));
    }

    @Override
    @Transactional
    public ChildResponse addChild(Long parentId, ChildRequest childRequest) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Parent not found"));
        
        Child child = childMapper.toEntity(childRequest);
        
        // Set parent
        child.setParent(parent);
        
        // Set password
        child.setPassword(passwordEncoder.encode(childRequest.getPassword()));
        
        // Set picture (with default if none provided)
        String picture = childRequest.getPicture();
        if (picture == null || picture.trim().isEmpty()) {
            picture = "https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png";
        }
        child.setPicture(picture);
        
        Child savedChild = childRepository.save(child);
        return childMapper.toResponse(savedChild);
    }

    @Override
    public ChildResponse updateChild(Long parentId, Long childId, ChildRequest request) {
        Child child = childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found"));
        
        // Update basic fields using mapper
        childMapper.updateEntity(child, request);
        
        // Handle password separately if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            child.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Handle picture separately
        if (request.getPicture() != null && !request.getPicture().trim().isEmpty()) {
            child.setPicture(request.getPicture());
        }
        
        Child updatedChild = childRepository.save(child);
        return childMapper.toResponse(updatedChild);
    }

    @Override
    public void softDeleteChild(Long parentId, Long childId) {
        Child child = childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId + " for parent: " + parentId));
        child.setDeleted(true);
    }

    @Override
    public List<ChildResponse> getChildren(Long parentId) {
        return childRepository.findByParentId(parentId).stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateChildPoints(Long parentId, Long childId, int points, String reason) {
        Child child = childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId + " for parent: " + parentId));

        Point pointTransaction = Point.builder()
                .child(child)
                .points(points)
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .build();
        pointRepository.save(pointTransaction);

        int totalPoints = pointRepository.sumPointsByChildId(childId);
        child.setTotalPoints(totalPoints);
        childRepository.save(child);
    }

    // @Override
    // public void reactivateParentAndChildren(Long id) {
    //     Parent parent = parentRepository.findById(id)
    //             .orElseThrow(() -> new NotFoundException("Parent not found with id: " + id));
    //     parent.setDeleted(false);
    //     // Reactivate all children
    //     childRepository.findByParentIdIncludingDeleted(id)  // Need to create this method
    //             .forEach(child -> child.setDeleted(false));
    // }
} 
