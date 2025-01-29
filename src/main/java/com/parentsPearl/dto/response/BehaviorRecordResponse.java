package com.parentsPearl.dto.response;

import com.parentsPearl.model.enums.BehaviorType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BehaviorRecordResponse {
    private Long id;
    private Long childId;
    private String childName;
    private BehaviorType behaviorType;
    private String description;
    private Long loggedById;
    private String loggedByName;
    private LocalDateTime createdAt;
} 