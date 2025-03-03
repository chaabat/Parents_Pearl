package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.Reward;
import com.parentPearl.dto.request.RewardRequest;
import com.parentPearl.dto.response.RewardResponse;

@Mapper(componentModel = "spring")
public interface RewardMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    Reward toEntity(RewardRequest request);
    
    @Mapping(target = "parentId", source = "parent.id")
    RewardResponse toResponse(Reward reward);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    void updateEntity(@MappingTarget Reward reward, RewardRequest request);
} 