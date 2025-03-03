package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


import com.parentPearl.model.Admin;
import com.parentPearl.dto.request.AdminRequest;
import com.parentPearl.dto.response.AdminResponse;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "ADMIN")
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    Admin toEntity(AdminRequest request);
    
    @Mapping(target = "role", source = "role")
    AdminResponse toResponse(Admin admin);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateEntity(@MappingTarget Admin admin, AdminRequest request);
} 