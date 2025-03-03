package com.parentPearl.config;

import com.parentPearl.model.User;
import com.parentPearl.model.enums.Role;
import com.parentPearl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Override
    public void run(String... args) {
        String adminEmail = "admin@parentpearl.com";
        String rawPassword = "admin123";
        
        // Vérifier si l'admin existe
        if (!userRepository.existsByEmail(adminEmail)) {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            log.info("Création admin - Email: {}, Password brut: {}, Password encodé: {}", 
                adminEmail, rawPassword, encodedPassword);
            
            User admin = User.builder()
                    .email(adminEmail)
                    .password(encodedPassword)
                    .name("Admin")
                    .role(Role.ADMIN)
                    .deleted(false)
                    .build();
            userRepository.save(admin);
            log.info("Admin créé avec succès");
        } else {
            User existingAdmin = userRepository.findByEmail(adminEmail).get();
            log.info("Admin existant - Email: {}, Role: {}, PasswordHash: {}", 
                existingAdmin.getEmail(), existingAdmin.getRole(), existingAdmin.getPassword());
        }
    }
} 