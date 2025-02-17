package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.LoginRequest;
import com.parentsPearl.dto.request.ParentRegistrationRequest;
import com.parentsPearl.dto.response.UserResponse;

public interface AuthService {
    UserResponse login(LoginRequest request);
    UserResponse registerParent(ParentRegistrationRequest request);
    void logout();
    UserResponse refreshToken();
}