package com.parentPearl.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class RewardResponse {
    private Long id;
    private String name;
    private String description;
    private int pointCost;
    private Long parentId;
}