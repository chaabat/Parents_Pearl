package com.parentPearl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.parentPearl.model.User;
import com.parentPearl.dto.request.UserRequest;
import com.parentPearl.dto.response.UserResponse;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    User toEntity(UserRequest request);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "picture", source = "picture")
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    UserResponse toResponse(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    void updateEntity(@MappingTarget User user, UserRequest request);
}