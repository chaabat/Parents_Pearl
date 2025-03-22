package com.parentPearl.dto.response;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class RewardRedemptionResponse {
    private Long id;
    private Long childId;
    private Long rewardId;
    private int points_spent;
    private String message;
    private LocalDateTime redeemed_at;
    private LocalDateTime redemptionDate;
    private RewardResponse reward;
}