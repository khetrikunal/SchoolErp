package com.schoolerp.controller;

import com.schoolerp.dto.request.AdminCreateUserRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.User;
import com.schoolerp.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminManagementController {

    private final AdminUserService adminUserService;
    private final com.schoolerp.repository.UserRepository userRepository;


    @PostMapping("/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> createAdmin(@Valid @RequestBody AdminCreateUserRequest req) {
        User created = adminUserService.createAdmin(req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Admin created", created));
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<com.schoolerp.dto.response.AdminSummaryResponse>>> getAdmins() {
        var admins = userRepository.findByRole(com.schoolerp.model.Role.ADMIN);

        List<com.schoolerp.dto.response.AdminSummaryResponse> result = admins.stream()
            .map(u -> new com.schoolerp.dto.response.AdminSummaryResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                u.getRole()
            ))
            .toList();

        return ResponseEntity.ok(ApiResponse.ok(result));
    }



}





