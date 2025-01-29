package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.UserRequest;
import com.parentsPearl.dto.response.UserResponse;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserResponse> findAll();
    Optional<UserResponse> findById(Long id);
    UserResponse save(UserRequest user);
    void deleteById(Long id);
    UserResponse update(Long id, UserRequest user);
    void changePassword(Long id, String newPassword);
    void resetPassword(String email);
    UserResponse findByEmail(String email);
 
    

}
