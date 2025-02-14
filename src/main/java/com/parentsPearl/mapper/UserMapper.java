package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.ParentRegistrationRequest;
import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import com.parentsPearl.model.Admin;
import com.parentsPearl.model.Child;
import com.parentsPearl.model.Parent;
import com.parentsPearl.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    UserResponse toResponse(Parent parent);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    Parent toEntity(ParentRegistrationRequest request);
    
    @Mapping(target = "id", ignore = true)
    default User toEntity(UserRequest request) {
        switch (request.getRole()) {
            case PARENT:
                return new Parent();
            case CHILD:
                return new Child();
            case ADMIN:
                return new Admin();
            default:
                throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }
    }
}