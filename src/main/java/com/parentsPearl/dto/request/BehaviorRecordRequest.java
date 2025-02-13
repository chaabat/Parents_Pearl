package com.parentsPearl.dto.request;

import com.parentsPearl.model.enums.BehaviorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BehaviorRecordRequest {
    @NotBlank(message = "Child ID is required")
    private String childId;
    
    @NotNull(message = "Behavior type is required")
    private BehaviorType behaviorType;
    
    private String description;
} 