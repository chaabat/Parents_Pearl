package com.parentsPearl.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BehaviorRecordResponse {
    private String id;
    private String description;
    private String childId;
    private String type;
    private Integer pointsImpact;
    private LocalDateTime occurredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 