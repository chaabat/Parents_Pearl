package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.response.PointResponse;
import java.util.List;

public interface PointService {
    // Parent operations
    PointResponse awardPoints(Long parentId, Long childId, PointRequest request);
    List<PointResponse> getChildPointHistory(Long parentId, Long childId);
    
    // Child operations
    List<PointResponse> getMyPointHistory(Long childId);
    int getMyTotalPoints(Long childId);
} 