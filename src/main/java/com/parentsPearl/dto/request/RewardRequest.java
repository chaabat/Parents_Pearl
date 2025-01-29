package com.parentsPearl.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RewardRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Points required is required")
    @Min(value = 0, message = "Points required must be positive")
    private int pointsRequired;

    @NotNull(message = "Quantity available is required")
    @Min(value = 0, message = "Quantity available must be positive")
    private int quantityAvailable;
} 