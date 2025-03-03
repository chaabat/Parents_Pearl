package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.Parent;
import com.parentPearl.dto.request.ParentRequest;
import com.parentPearl.dto.response.ParentResponse;


@Mapper(componentModel = "spring")
public interface ParentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "PARENT")
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    Parent toEntity(ParentRequest request);
    
    @Mapping(target = "childrenIds", expression = "java(parent.getChildren().stream().map(child -> child.getId()).collect(java.util.stream.Collectors.toList()))")
    ParentResponse toResponse(Parent parent);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    void updateEntity(@MappingTarget Parent parent, ParentRequest request);
} 