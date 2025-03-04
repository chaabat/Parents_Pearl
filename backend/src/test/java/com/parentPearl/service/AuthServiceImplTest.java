package com.parentPearl.service;

import com.parentPearl.dto.request.AuthRequest;
import com.parentPearl.dto.response.AuthResponse;
import com.parentPearl.dto.response.UserResponse;
import com.parentPearl.mapper.UserMapper;
import com.parentPearl.model.Parent;
import com.parentPearl.model.enums.Role;
import com.parentPearl.repository.ParentRepository;
import com.parentPearl.repository.UserRepository;
import com.parentPearl.security.TokenBlacklist;
import com.parentPearl.service.implementation.AuthServiceImpl;
import com.parentPearl.utilitaire.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private ParentRepository parentRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @Mock
    private TokenBlacklist tokenBlacklist;
    
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AuthenticationConfiguration authConfig;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private AuthRequest authRequest;
    private Parent parent;

    @BeforeEach
    void setUp() throws Exception {
        authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password");

        parent = Parent.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.PARENT)
                .build();
    }

    @Test
    void login_Success() throws Exception {
        // Given
        when(authConfig.getAuthenticationManager()).thenReturn(authenticationManager);
        when(authenticationManager.authenticate(any())).thenReturn(
            new UsernamePasswordAuthenticationToken(
                parent,
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + parent.getRole()))
            )
        );
        when(userRepository.findByEmailAndNotDeleted(anyString()))
                .thenReturn(Optional.of(parent));
        when(jwtUtil.generateToken(anyString(), any(Role.class)))
                .thenReturn("token");
        when(userMapper.toResponse(any())).thenReturn(
            UserResponse.builder()
                .id(parent.getId())
                .email(parent.getEmail())
                .role(parent.getRole())
                .build()
        );

        // When
        AuthResponse response = authService.login(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("token", response.getAccessToken());
        verify(authenticationManager).authenticate(any());
        verify(userRepository).findByEmailAndNotDeleted(anyString());
    }

    @Test
    void logout_Success() {
        // Given
        String token = "token123";
        
        // When
        authService.logout(token);

        // Then
        verify(tokenBlacklist).addToBlacklist(token);
    }

    @Test
    void register_Success() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(parentRepository.save(any(Parent.class))).thenReturn(parent);

        // When
        var response = authService.register(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("Registration successful. Please login.", response.getMessage());
        verify(parentRepository).save(any(Parent.class));
    }
} 