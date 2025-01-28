package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.model.Child;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChildMapper {
    
    @Mapping(target = "parentId", source = "parent.id")
    @Mapping(target = "parentName", expression = "java(child.getParent().getFirstName() + \" \" + child.getParent().getLastName())")
    ChildResponse toResponse(Child child);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Child toEntity(ChildRequest request);
} 