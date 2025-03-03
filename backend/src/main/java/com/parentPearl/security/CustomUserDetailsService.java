package com.parentPearl.security;

import com.parentPearl.model.User;
import com.parentPearl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            log.info("Loading user details for email: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            
            log.info("Found user: {} with password hash: {}", user.getEmail(), user.getPassword());
            
            UserPrincipal principal = new UserPrincipal(user);
            log.info("Created UserPrincipal with authorities: {}", principal.getAuthorities());
            log.debug("Principal password hash: {}", principal.getPassword());
            
            return principal;
        } catch (Exception e) {
            log.error("Error in loadUserByUsername: ", e);
            throw e;
        }
    }
}
