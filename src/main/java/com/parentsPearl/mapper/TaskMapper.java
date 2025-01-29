package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.TaskRequest;
import com.parentsPearl.dto.response.TaskResponse;
import com.parentsPearl.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "assignedToName", expression = "java(task.getAssignedTo().getFirstName() + \" \" + task.getAssignedTo().getLastName())")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByName", expression = "java(task.getCreatedBy().getFirstName() + \" \" + task.getCreatedBy().getLastName())")
    TaskResponse toResponse(Task task);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task toEntity(TaskRequest request);
} 