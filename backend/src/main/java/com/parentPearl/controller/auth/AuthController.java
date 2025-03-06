package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.AuthRequest;
import com.parentPearl.dto.response.AuthResponse;
import com.parentPearl.dto.response.ErrorResponse;
import com.parentPearl.dto.response.RegisterResponse;
import com.parentPearl.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import com.parentPearl.model.User;
import org.springframework.http.HttpStatus;
import com.parentPearl.repository.UserRepository;
import com.parentPearl.exception.NotFoundException;
import org.springframework.security.authentication.BadCredentialsException;



@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RegisterResponse> register(
        @RequestPart("userData") String userDataJson,
        @RequestPart(value = "file", required = false) MultipartFile file  // Make file optional
    ) {
        try {
            log.debug("Received userData: {}", userDataJson);
            log.debug("Received file: {}", file != null ? file.getOriginalFilename() : "no file");
            
            ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());
            AuthRequest request = objectMapper.readValue(userDataJson, AuthRequest.class);
            
            return ResponseEntity.ok(authService.register(request, file));
        } catch (Exception e) {
            log.error("Registration error", e);
            throw new RuntimeException("Error processing registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            log.info("Tentative de connexion pour: " + request.getEmail());
            
            // Vérifier d'abord si l'utilisateur existe (banni ou non)
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("Utilisateur non trouvé"));
                
            // Vérifier si l'utilisateur est banni
            if (user.isDeleted()) {
                log.warn("Tentative de connexion d'un utilisateur banni: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ErrorResponse.of(403, "Accès refusé", 
                        "Votre compte a été désactivé. Veuillez contacter l'administrateur.", 
                        "/api/auth/login"));
            }

            log.info("Utilisateur trouvé avec le rôle: " + user.getRole());
            AuthResponse response = authService.login(request);
            log.info("=== Login Request Completed Successfully ===");
            return ResponseEntity.ok(response);
            
        } catch (NotFoundException e) {
            log.error("Login failed - User not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(404, "Non trouvé", 
                    "Aucun compte n'existe avec cet email", 
                    "/api/auth/login"));
        } catch (BadCredentialsException e) {
            log.error("Login failed - Bad credentials: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "Non autorisé", 
                    "Email ou mot de passe incorrect", 
                    "/api/auth/login"));
        } catch (Exception e) {
            log.error("Erreur de connexion détaillée: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(500, "Erreur serveur", 
                    "Une erreur est survenue lors de la connexion", 
                    "/api/auth/login"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.ok().build();
    }

   
} 