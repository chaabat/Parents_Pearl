package com.parentPearl.security;

import com.parentPearl.service.interfaces.AuthService;
import com.parentPearl.utilitaire.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.context.annotation.Lazy;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklist tokenBlacklist;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        // Only log token warnings for secured endpoints
        boolean isPublicEndpoint = path.startsWith("/api/auth/");
        
        String authHeader = request.getHeader("Authorization");

        if (!isPublicEndpoint) {
            log.info("Processing secured request to: {}", path);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("No Bearer token found in header");
            }
        }

        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            
            // Log pour debug
           log.info("Token reçu: " + token);
            log.info("Est dans la liste noire? " + tokenBlacklist.isBlacklisted(token));

            if (tokenBlacklist.isBlacklisted(token)) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType("application/json");
                String jsonResponse = "{\"status\":\"UNAUTHORIZED\",\"message\":\"Token blacklisted. Please login again.\"}";
                response.getWriter().write(jsonResponse);
                return;
            }

            try {
                email = jwtUtil.extractEmail(token);
                log.debug("Token found for user: {}", email);
            } catch (Exception e) {
                log.error("Error extracting token: {}", e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtUtil.validateToken(token, email)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("Authentication successful for user: {}", email);
            }
        }

        filterChain.doFilter(request, response);
    }
}
