package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.AdminRequest;
import com.parentPearl.dto.response.AdminResponse;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.dto.response.ChildResponse;
import java.util.List;

public interface AdminService {
    // User management
    List<ParentResponse> getAllParents();
    List<ParentResponse> getBannedParents();
    List<ChildResponse> getAllChildren();
    List<ChildResponse> getBannedChildren();
    
    // Ban operations
    void banUser(Long userId, String reason);
    void unbanUser(Long userId);
    boolean isUserBanned(Long userId);
    
    // Admin operations
    AdminResponse getAdminById(Long id);
    AdminResponse updateAdmin(Long id, AdminRequest request);
    
    // System statistics
    int getTotalActiveUsers();
    int getTotalBannedUsers();
    int getTotalCompletedTasks();
}