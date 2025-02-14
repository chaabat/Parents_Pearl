package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserResponse> findAll();
    Optional<UserResponse> findById(String id);
    UserResponse save(UserRequest user);
    UserResponse update(String id, UserRequest user);
    void changePassword(String id, String newPassword);
    void resetPassword(String email);
    UserResponse findByEmail(String email);
    void softDelete(String id);
    UserResponse updateStatus(String id, String status);
    UserResponse updateRole(String id, String role);
 
    

}
