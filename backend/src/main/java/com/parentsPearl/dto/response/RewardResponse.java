package com.parentsPearl.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RewardResponse {
    private Long id;
    private String name;
    private String description;
    private int pointsRequired;
    private Long claimedById;
    private String claimedByName;
    private LocalDateTime createdAt;
} 