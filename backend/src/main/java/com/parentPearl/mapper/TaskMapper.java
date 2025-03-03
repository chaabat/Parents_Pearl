package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.parentPearl.model.Task;
import com.parentPearl.dto.request.TaskRequest;
import com.parentPearl.dto.response.TaskResponse;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "child.id", source = "childId")
    Task toEntity(TaskRequest request);
    
    @Mapping(target = "childId", source = "child.id")
    TaskResponse toResponse(Task task);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "child.id", source = "childId")
    void updateEntity(@MappingTarget Task task, TaskRequest request);
} 