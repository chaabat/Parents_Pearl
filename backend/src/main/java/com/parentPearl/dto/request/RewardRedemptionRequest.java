package com.parentPearl.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardRedemptionRequest {
    @NotNull(message = "Child ID is required")
    private Long childId;
    
    @NotNull(message = "Reward ID is required")
    private Long rewardId;

    private int pointsSpent;

    private String message;

    private LocalDateTime redeemedAt;
}