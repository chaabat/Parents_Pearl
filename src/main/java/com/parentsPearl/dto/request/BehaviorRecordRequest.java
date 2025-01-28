package com.parentsPearl.dto.request;

import com.parentsPearl.model.enums.BehaviorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BehaviorRecordRequest {
    @NotNull(message = "Child ID is required")
    private Long childId;
    
    @NotNull(message = "Behavior type is required")
    private BehaviorType behaviorType;
    
    @NotBlank(message = "Description is required")
    private String description;
} 