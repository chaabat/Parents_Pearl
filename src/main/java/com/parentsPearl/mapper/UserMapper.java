package com.parentsPearl.mapper;

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
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    default User toEntity(UserRequest request) {
        switch (request.getRole()) {
            case ADMIN:
                return toAdmin(request);
            case PARENT:
                return toParent(request);
            case CHILD:
                return toChild(request);
            default:
                throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }
    }
    
    Admin toAdmin(UserRequest request);
    Parent toParent(UserRequest request);
    Child toChild(UserRequest request);
    
    UserResponse toResponse(User user);
}
    
