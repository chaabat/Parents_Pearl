package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.Point;
import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.response.PointResponse;

@Mapper(componentModel = "spring")
public interface PointMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "child.id", source = "childId")
    Point toEntity(PointRequest request);
    
    @Mapping(target = "childId", source = "child.id")
    @Mapping(target = "date", source = "createdAt")
    PointResponse toResponse(Point point);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "child.id", source = "childId")
    void updateEntity(@MappingTarget Point point, PointRequest request);
} 