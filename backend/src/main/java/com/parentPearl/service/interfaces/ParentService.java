package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.ParentRequest;
import com.parentPearl.dto.request.ChildRequest;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.dto.response.ChildResponse;
import java.util.List;

public interface ParentService {
    // Parent operations
    ParentResponse getParentById(Long id);
    ParentResponse updateParent(Long id, ParentRequest request);
    void softDeleteParent(Long id); // This will also soft delete all children
    
    // Child management operations
    ChildResponse addChild(Long parentId, ChildRequest childRequest);
    ChildResponse updateChild(Long parentId, Long childId, ChildRequest childRequest);
    void softDeleteChild(Long parentId, Long childId);
    List<ChildResponse> getChildren(Long parentId);
    
    // Child points management
    void updateChildPoints(Long parentId, Long childId, int points, String reason);
}

