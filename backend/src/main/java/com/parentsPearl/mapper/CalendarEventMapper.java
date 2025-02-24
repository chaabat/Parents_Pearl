package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.CalendarEventRequest;
import com.parentsPearl.dto.response.CalendarEventResponse;
import com.parentsPearl.model.CalendarEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CalendarEventMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdById", ignore = true)
    CalendarEvent toEntity(CalendarEventRequest request);
    
    CalendarEventResponse toResponse(CalendarEvent event);
} 