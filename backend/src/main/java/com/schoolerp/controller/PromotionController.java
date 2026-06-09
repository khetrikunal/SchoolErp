package com.schoolerp.controller;

import com.schoolerp.dto.response.ApiResponse;

import com.schoolerp.model.Promotion;
import com.schoolerp.service.PromotionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Promotion>> promote(@Valid @RequestBody PromoteRequest req) {
        Promotion promo = promotionService.promoteStudent(
            req.getStudentId(),
            req.getFromClass(),
            req.getToClass(),
            req.getAcademicYear(),
            req.getStatus()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Promotion created", promo));
    }

    @PostMapping("/promote/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Promotion>>> promoteBulk(@Valid @RequestBody PromoteBulkRequest req) {
        List<Promotion> promotions = promotionService.promoteBulkClass(
            req.getFromClass(),
            req.getToClass(),
            req.getAcademicYear()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Bulk promotions created", promotions));
    }

    @Data
    @AllArgsConstructor
    public static class PromoteRequest {
        @NotBlank
        private String studentId;
        @NotBlank
        private String fromClass;
        @NotBlank
        private String toClass;
        @NotBlank
        private String academicYear;
        @NotBlank
        private String status; // PROMOTED or HELD_BACK
    }

    @Data
    @AllArgsConstructor
    public static class PromoteBulkRequest {
        @NotBlank
        private String fromClass;
        @NotBlank
        private String toClass;
        @NotBlank
        private String academicYear;
    }
}

