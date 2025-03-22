package com.parentPearl.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardRedemptionRequest {
    @NotNull(message = "Child ID is required")
    private Long childId;
    
    @NotNull(message = "Reward ID is required")
    private Long rewardId;

    private String message;
}