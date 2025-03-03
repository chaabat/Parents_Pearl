package com.parentPearl.service.interfaces;

import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.PointResponse;
import java.util.List;

public interface ChildService {
    // Read-only operations for child
    ChildResponse getChildById(Long childId);
    List<TaskResponse> getChildTasks(Long childId);
    List<PointResponse> getChildPoints(Long childId);
    int getTotalPoints(Long childId);
    List<ChildResponse> getChildrenByParentId(Long parentId);
    
    // Child can only view their own data, cannot modify it
    // All modifications come through ParentService
} 