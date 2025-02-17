package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import java.util.List;
 

public interface UserService {
    List<UserResponse> findAll();
    UserResponse findById(Long id);
    UserResponse save(UserRequest user);
    UserResponse update(Long id, UserRequest user);
    void changePassword(Long id, String newPassword);
    void resetPassword(String email);
    UserResponse findByEmail(String email);
    void softDelete(Long id);
    UserResponse updateStatus(Long id, String status);
    UserResponse updateRole(Long id, String role);
 
    

}
