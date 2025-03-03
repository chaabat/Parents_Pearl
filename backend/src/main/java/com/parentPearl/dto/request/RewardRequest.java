package com.parentPearl.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RewardRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @Positive(message = "Point cost must be positive")
    private int pointCost;
}