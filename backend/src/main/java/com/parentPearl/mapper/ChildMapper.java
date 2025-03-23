package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.Child;

import com.parentPearl.dto.request.ChildRequest;
import com.parentPearl.dto.response.ChildResponse;

@Mapper(componentModel = "spring")
public interface ChildMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "CHILD")
    @Mapping(target = "parent.id", source = "password")
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "points", ignore = true)
    @Mapping(target = "rewardRedemptions", ignore = true)
    @Mapping(target = "totalPoints", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    Child toEntity(ChildRequest request);
    
    @Mapping(target = "parentId", source = "parent.id")
    @Mapping(target = "taskIds", expression = "java(child.getTasks().stream().map(task -> task.getId()).collect(java.util.stream.Collectors.toList()))")
    @Mapping(target = "pointIds", expression = "java(child.getPoints().stream().map(point -> point.getId()).collect(java.util.stream.Collectors.toList()))")
    @Mapping(target = "rewardRedemptionIds", expression = "java(child.getRewardRedemptions().stream().map(redemption -> redemption.getId()).collect(java.util.stream.Collectors.toList()))")
    ChildResponse toResponse(Child child);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "points", ignore = true)
    @Mapping(target = "rewardRedemptions", ignore = true)
    @Mapping(target = "totalPoints", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateEntity(@MappingTarget Child child, ChildRequest request);
} 