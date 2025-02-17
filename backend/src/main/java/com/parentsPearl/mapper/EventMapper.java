package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.EventRequest;
import com.parentsPearl.dto.response.EventResponse;
import com.parentsPearl.model.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Event toEntity(EventRequest request);
    
    EventResponse toResponse(Event event);
    
    @Mapping(target = "id", ignore = true)
    void updateEntity(EventRequest request, @MappingTarget Event event);
} 