package com.parentsPearl.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BehaviorRecordRequest {
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Child ID is required")
    private String childId;
    
    @NotNull(message = "Type is required")
    private String type; // "POSITIVE" or "NEGATIVE"
    
    private Integer pointsImpact;
    
    private LocalDateTime occurredAt;
} 