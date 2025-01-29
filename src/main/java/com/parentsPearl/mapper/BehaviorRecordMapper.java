package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.model.BehaviorRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BehaviorRecordMapper {
    
    @Mapping(target = "childId", source = "child.id")
    @Mapping(target = "childName", expression = "java(record.getChild().getFirstName() + \" \" + record.getChild().getLastName())")
    @Mapping(target = "loggedById", source = "loggedBy.id")
    @Mapping(target = "loggedByName", expression = "java(record.getLoggedBy().getFirstName() + \" \" + record.getLoggedBy().getLastName())")
    BehaviorRecordResponse toResponse(BehaviorRecord record);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "child", ignore = true)
    @Mapping(target = "loggedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    BehaviorRecord toEntity(BehaviorRecordRequest request);
} 