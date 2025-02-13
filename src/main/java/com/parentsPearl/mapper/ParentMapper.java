package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import com.parentsPearl.model.Parent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ParentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "childrenIds", target = "childrenIds")
    Parent toEntity(ParentRequest request);
    
    @Mapping(source = "childrenIds", target = "childrenIds")
    ParentResponse toResponse(Parent parent);
} 