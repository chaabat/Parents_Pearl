package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import com.parentsPearl.model.BehaviorRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface BehaviorRecordMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "loggedById", ignore = true)
    BehaviorRecord toEntity(BehaviorRecordRequest request);
    
    BehaviorRecordResponse toResponse(BehaviorRecord entity);
} 