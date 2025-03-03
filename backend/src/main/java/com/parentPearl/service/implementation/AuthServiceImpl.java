package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.AuthRequest;
import com.parentPearl.dto.response.AuthResponse;
import com.parentPearl.dto.response.RegisterResponse;
import com.parentPearl.exception.BadRequestException;
import com.parentPearl.exception.NotFoundException;
import com.parentPearl.model.Parent;
import com.parentPearl.model.User;
import com.parentPearl.model.enums.Role;
import com.parentPearl.repository.ParentRepository;
import com.parentPearl.repository.UserRepository;
import com.parentPearl.service.interfaces.AuthService;
import com.parentPearl.utilitaire.JwtUtil;
import com.parentPearl.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.parentPearl.security.UserPrincipal;
  
import com.parentPearl.security.TokenBlacklist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService, UserDetailsService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationConfiguration authConfig;
    private final UserMapper userMapper;
    private final TokenBlacklist tokenBlacklist;
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public RegisterResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Parent parent = Parent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PARENT)
                .build();

        parent = parentRepository.save(parent);

        return RegisterResponse.builder()
                .message("Registration successful. Please login.")
                .user(userMapper.toResponse(parent))
                .build();
    }

    @Override
    public AuthResponse login(AuthRequest request) throws Exception {
        AuthenticationManager authenticationManager = getAuthManager();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmailAndNotDeleted(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found or account is deleted"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return AuthResponse.builder()
                .accessToken(token)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (jwtUtil.validateToken(refreshToken, email)) {
            String newToken = jwtUtil.generateToken(email, user.getRole());
            return AuthResponse.builder()
                    .accessToken(newToken)
                    .user(userMapper.toResponse(user))
                    .build();
        }
        throw new BadRequestException("Invalid refresh token");
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return new UserPrincipal(user);
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        return loadUserByUsername(email);
    }

    private AuthenticationManager getAuthManager() throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Override
    public void logout(String token) {
        try {
            
            tokenBlacklist.addToBlacklist(token);
            
      
            log.info("Token ajouté à la liste noire: {}", token);
            
            
            SecurityContextHolder.clearContext();
            
        } catch (Exception e) {
            log.error("Erreur lors de la déconnexion: {}", e.getMessage());
            throw e;
        }
    }
} 