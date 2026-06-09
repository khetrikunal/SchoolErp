package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.LoginRequest;
import com.schoolerp.dto.response.AuthResponse;
import com.schoolerp.model.User;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.security.jwt.JwtUtils;
import com.schoolerp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    private final com.schoolerp.service.AuthenticationResolver authenticationResolver;

    @Override
    public AuthResponse login(LoginRequest request) {
        System.out.println("[AuthServiceImpl] /api/auth/login called");
        System.out.println("[AuthServiceImpl] request body: " + request);

        String emailOrNull = request.getEmail();
        String identifier = request.getIdentifier();

        System.out.println("[AuthServiceImpl] received email: " + emailOrNull);
        System.out.println("[AuthServiceImpl] received identifier: " + identifier);

        try {
            // Resolve user by priority: email -> teacherId -> studentId
            // JWT generation must remain stable (subject is still user.email)
            User resolvedUser = authenticationResolver.resolveUser(emailOrNull, identifier);
            System.out.println("[AuthServiceImpl] user lookup result: " + resolvedUser);

            // Password match result is indirectly determined by authenticationManager.authenticate(...)
            try {
                System.out.println("[AuthServiceImpl] attempting authenticationManager.authenticate(...) for email=" + resolvedUser.getEmail());
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(resolvedUser.getEmail(), request.getPassword())
                );
                System.out.println("[AuthServiceImpl] password match result: SUCCESS");
            } catch (Exception e) {
                System.out.println("[AuthServiceImpl] password match result: FAILED");
                System.out.println("[AuthServiceImpl] exact auth exception causing 403:");
                System.out.println("[AuthServiceImpl] exception class: " + e.getClass().getName());
                System.out.println("[AuthServiceImpl] exception message: " + e.getMessage());
                throw e;
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resolvedUser.getEmail(), request.getPassword())
            );

            User user = (User) authentication.getPrincipal();

            // JWT validation result (sanity check)
            String token = jwtUtils.generateToken(user);
            boolean jwtValid = jwtUtils.validateToken(token);
            System.out.println("[AuthServiceImpl] JWT validation result: " + jwtValid);

            return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .designation(user.getDesignation())
                .build();
        } catch (Exception e) {
            System.out.println("[AuthServiceImpl] login failed -> exact exception causing 403:");
            System.out.println("[AuthServiceImpl] exception class: " + e.getClass().getName());
            System.out.println("[AuthServiceImpl] exception message: " + e.getMessage());
            throw e;
        }
    }


}
