package com.parentPearl.dto.response;

import lombok.Data;

import java.util.List;




import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ChildResponse extends UserResponse {
    private int totalPoints;
    private Long parentId;
    private List<Long> taskIds;
    private List<Long> pointIds;
    private List<Long> rewardRedemptionIds;
}