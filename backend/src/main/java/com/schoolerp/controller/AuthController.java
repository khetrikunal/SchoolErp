package com.schoolerp.controller;

import com.schoolerp.dto.request.LoginRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.dto.response.AuthResponse;
import com.schoolerp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() { return ResponseEntity.ok("School ERP API is running!"); }
}
