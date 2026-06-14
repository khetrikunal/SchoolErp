package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.LoginRequest;
import com.schoolerp.dto.response.AuthResponse;
import com.schoolerp.model.User;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.security.jwt.JwtUtils;
import com.schoolerp.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final com.schoolerp.service.AuthenticationResolver authenticationResolver;

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("[AuthServiceImpl] Login attempt started for identifier: {}", request.getIdentifier());

        String emailOrNull = request.getEmail();
        String identifier = request.getIdentifier();

        try {
            // Resolve user by priority: email -> teacherId -> studentId
            User resolvedUser = authenticationResolver.resolveUser(emailOrNull, identifier);
            log.debug("[AuthServiceImpl] User resolved: {}", resolvedUser.getEmail());

            // Authenticate exactly once
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resolvedUser.getEmail(), request.getPassword())
            );
            log.info("[AuthServiceImpl] Authentication successful for email: {}", resolvedUser.getEmail());

            User user = (User) authentication.getPrincipal();

            // JWT generation
            String token = jwtUtils.generateToken(user);

            return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .designation(user.getDesignation())
                .build();
        } catch (Exception e) {
            log.error("[AuthServiceImpl] Login failed: {}", e.getMessage());
            throw e;
        }
    }
}

