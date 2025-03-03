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
    
    @Mapping(target = "pointsSpent", ignore = true)
    RewardRedemption toEntity(RewardRedemptionRequest request);
    
    @Mapping(target = "childId", source = "child.id")
    @Mapping(target = "rewardId", source = "reward.id")
    RewardRedemptionResponse toResponse(RewardRedemption redemption);
    
    @Mapping(target = "id", ignore = true)
   
    @Mapping(target = "child.id", source = "childId")
    @Mapping(target = "reward.id", source = "rewardId")
    @Mapping(target = "pointsSpent", ignore = true)
    void updateEntity(@MappingTarget RewardRedemption redemption, RewardRedemptionRequest request);
} 