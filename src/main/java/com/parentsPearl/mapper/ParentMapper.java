package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import com.parentsPearl.model.Parent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ChildMapper.class})
public interface ParentMapper {
    
    @Mapping(target = "children", source = "children")
    ParentResponse toResponse(Parent parent);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Parent toEntity(ParentRequest request);
} 