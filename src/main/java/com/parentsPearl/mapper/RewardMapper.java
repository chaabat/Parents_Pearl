package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.model.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RewardMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "claimedById", target = "claimedById")
    Reward toEntity(RewardRequest request);
    
    @Mapping(source = "claimedById", target = "claimedById")
    RewardResponse toResponse(Reward reward);
} 