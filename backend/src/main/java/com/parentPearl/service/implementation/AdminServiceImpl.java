package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.AdminRequest;
import com.parentPearl.dto.response.AdminResponse;
import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.mapper.AdminMapper;
import com.parentPearl.mapper.ChildMapper;
import com.parentPearl.mapper.ParentMapper;
import com.parentPearl.model.Admin;
import com.parentPearl.model.Child;
import com.parentPearl.repository.AdminRepository;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.ParentRepository;
import com.parentPearl.repository.TaskRepository;
import com.parentPearl.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {
    
    private final AdminRepository adminRepository;
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final TaskRepository taskRepository;
    private final AdminMapper adminMapper;
    private final ParentMapper parentMapper;
    private final ChildMapper childMapper;
    private final PasswordEncoder passwordEncoder;
    private final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Override
    public List<ParentResponse> getAllParents() {
        return parentRepository.findAllActive().stream()
                .map(parentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ParentResponse> getBannedParents() {
        return parentRepository.findAllBanned().stream()
                .map(parentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChildResponse> getAllChildren() {
        return childRepository.findAllActive().stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChildResponse> getBannedChildren() {
        return childRepository.findAllBanned().stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void banUser(Long userId, String reason) {
        // First try to find and ban a parent
        parentRepository.findById(userId).ifPresent(parent -> {
            parent.setDeleted(true);
            // Ban all children of this parent
            List<Child> children = childRepository.findByParentId(parent.getId());
            children.forEach(child -> child.setDeleted(true));
        });
        
        // If not a parent, try to find and ban a child
        childRepository.findById(userId).ifPresent(child -> {
            child.setDeleted(true);
        });
    }

    @Override
    @Transactional
    public void unbanUser(Long userId) {
        // First try to find and unban a parent
        parentRepository.findById(userId).ifPresent(parent -> {
            parent.setDeleted(false);
            // Unban all children of this parent
            List<Child> children = childRepository.findByParentId(parent.getId());
            children.forEach(child -> child.setDeleted(false));
        });
        
        // If not a parent, try to find and unban a child
        childRepository.findById(userId).ifPresent(child -> {
            child.setDeleted(false);
        });
    }

    @Override
    public boolean isUserBanned(Long userId) {
        // Check parent first
        if (parentRepository.findById(userId).isPresent()) {
            return parentRepository.findById(userId).get().isDeleted();
        }
        // Then check child
        if (childRepository.findById(userId).isPresent()) {
            return childRepository.findById(userId).get().isDeleted();
        }
        throw new RuntimeException("User not found");
    }

    @Override
    public AdminResponse getAdminById(Long id) {
        return adminRepository.findById(id)
                .map(adminMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    @Transactional
    public AdminResponse updateAdmin(Long id, AdminRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Handle password update separately
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword().trim());
            log.info("Updating admin password with BCrypt encoded value");
            admin.setPassword(encodedPassword);
        }
        
        // Update other fields
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        if (request.getDateOfBirth() != null) {
            admin.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getPicture() != null) {
            admin.setPicture(request.getPicture());
        }

        Admin updatedAdmin = adminRepository.save(admin);
        
        // Verify password encoding if password was updated
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            boolean matches = passwordEncoder.matches(request.getPassword(), updatedAdmin.getPassword());
            log.info("Password encoding verification: {}", matches);
        }

        return adminMapper.toResponse(updatedAdmin);
    }

    @Override
    public int getTotalActiveUsers() {
        return (int) (parentRepository.count() + childRepository.count() 
                - parentRepository.countBannedUsers() - childRepository.countBannedUsers());
    }

    @Override
    public int getTotalBannedUsers() {
        return parentRepository.countBannedUsers() + childRepository.countBannedUsers();
    }

    @Override
    public int getTotalCompletedTasks() {
        return taskRepository.countCompletedTasks();
    }
} 