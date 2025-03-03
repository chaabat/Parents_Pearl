package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.AuthRequest;
import com.parentPearl.dto.response.AuthResponse;
import com.parentPearl.dto.response.RegisterResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface AuthService {
    RegisterResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request) throws Exception;
    AuthResponse refreshToken(String refreshToken);
    UserDetails loadUserByEmail(String email) throws UsernameNotFoundException;
    void logout(String token);
   
}
