package com.schoolerp.service;
import com.schoolerp.dto.request.LoginRequest;
import com.schoolerp.dto.response.AuthResponse;
public interface AuthService {
    AuthResponse login(LoginRequest request);
}
