package com.parentPearl.config;

import com.parentPearl.model.User;
import com.parentPearl.model.Admin;
import com.parentPearl.model.enums.Role;
import com.parentPearl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.DependsOn;

@Component
@RequiredArgsConstructor
@DependsOn({"userRepository"})
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Override
    public void run(String... args) {
        String adminEmail = "admin@parentpearl.com";
        String rawPassword = "admin123";
        
        // Check if admin exists
        if (!userRepository.existsByEmail(adminEmail)) {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            
            // Log the exact password details for debugging
            log.info("Creating admin with raw password: {} and encoded password: {}", 
                rawPassword, encodedPassword);
            
            Admin admin = Admin.builder()
                    .email(adminEmail)
                    .password(encodedPassword)
                    .name("Admin")
                    .role(Role.ADMIN)
                    .deleted(false)
                    .build();

            Admin savedAdmin = userRepository.save(admin);
            
            // Verify the saved password
            log.info("Admin created successfully. Saved password hash: {}", 
                savedAdmin.getPassword());
        } else {
            // For existing admin, verify the password
            User existingAdmin = userRepository.findByEmail(adminEmail).get();
            
            // Update password if needed
            String currentEncodedPassword = existingAdmin.getPassword();
            if (!passwordEncoder.matches(rawPassword, currentEncodedPassword)) {
                String newEncodedPassword = passwordEncoder.encode(rawPassword);
                existingAdmin.setPassword(newEncodedPassword);
                userRepository.save(existingAdmin);
                log.info("Updated admin password. New hash: {}", newEncodedPassword);
            }
            
            log.info("Existing admin found. Current password hash: {}", 
                existingAdmin.getPassword());
        }
    }
}