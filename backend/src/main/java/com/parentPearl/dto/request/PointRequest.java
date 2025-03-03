package com.parentPearl.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointRequest {
    @Positive(message = "Points must be positive")
    private int points;
    
    private String reason;
    
    @NotNull(message = "Child ID is required")
    private Long childId;
}