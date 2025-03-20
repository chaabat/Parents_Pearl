package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.RewardRedemption;
import com.parentPearl.dto.request.RewardRedemptionRequest;
import com.parentPearl.dto.response.RewardRedemptionResponse;

@Mapper(componentModel = "spring")
public interface RewardRedemptionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "child.id", source = "childId")
    @Mapping(target = "reward.id", source = "rewardId")
    @Mapping(target = "redeemedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "redemptionDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "pointsSpent", source = "pointsSpent")
    RewardRedemption toEntity(RewardRedemptionRequest request);
    
    @Mapping(target = "childId", source = "child.id")
    @Mapping(target = "rewardId", source = "reward.id")
    @Mapping(target = "points_spent", source = "pointsSpent")
    @Mapping(target = "redeemed_at", source = "redeemedAt")
    @Mapping(target = "redemptionDate", source = "redemptionDate")
    @Mapping(target = "reward", source = "reward")
    RewardRedemptionResponse toResponse(RewardRedemption redemption);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "redeemedAt", source = "redeemedAt")
    @Mapping(target = "child.id", source = "childId")
    @Mapping(target = "reward.id", source = "rewardId")
    @Mapping(target = "pointsSpent", ignore = true)
    void updateEntity(@MappingTarget RewardRedemption redemption, RewardRedemptionRequest request);
} 