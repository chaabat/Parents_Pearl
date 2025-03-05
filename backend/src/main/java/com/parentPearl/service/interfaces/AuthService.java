package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.AuthRequest;
import com.parentPearl.dto.response.AuthResponse;
import com.parentPearl.dto.response.RegisterResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    RegisterResponse register(AuthRequest request, MultipartFile file);
    AuthResponse login(AuthRequest request) throws Exception;
    AuthResponse refreshToken(String refreshToken);
    void logout(String token);
}