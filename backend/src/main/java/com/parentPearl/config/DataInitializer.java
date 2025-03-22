package com.parentPearl.config;

import com.parentPearl.model.User;
import com.parentPearl.model.Admin;  // Add this import
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
            
            // Use Admin.builder() instead of User.builder()
            Admin admin = Admin.builder()
                    .email(adminEmail)
                    .password(encodedPassword)
                    .name("Admin")
                    .role(Role.ADMIN)  // This will ensure ADMIN role
                    .deleted(false)
                    .build();

            userRepository.save(admin);
            log.info("Admin créé avec succès avec le rôle: {}", admin.getRole());
        } else {
            User existingAdmin = userRepository.findByEmail(adminEmail).get();
            
            // Update role if it's not ADMIN
            if (existingAdmin.getRole() != Role.ADMIN) {
                existingAdmin.setRole(Role.ADMIN);
                userRepository.save(existingAdmin);
                log.info("Rôle mis à jour vers ADMIN pour: {}", existingAdmin.getEmail());
            }
            
            log.info("Admin existant - Email: {}, Role: {}, PasswordHash: {}", 
                existingAdmin.getEmail(), existingAdmin.getRole(), existingAdmin.getPassword());
        }
    }
}