package com.schoolerp.controller;

import com.schoolerp.dto.request.QuotationRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.*;
import com.schoolerp.service.QuotationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    @GetMapping("/admin/quotations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Quotation>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(quotationService.getAllQuotations()));
    }

    @GetMapping("/admin/quotations/{id}")
    public ResponseEntity<ApiResponse<Quotation>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(quotationService.getQuotationById(id)));
    }

    @PutMapping("/admin/quotations/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Quotation>> updateStatus(
        @PathVariable Long id,
        @RequestParam QuotationStatus status,
        @RequestParam(required = false, defaultValue = "") String remarks) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", quotationService.updateStatus(id, status, remarks)));
    }

    @PostMapping("/teacher/quotations")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<Quotation>> create(
        @Valid @RequestBody QuotationRequest req,
        @RequestParam Long teacherId) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Quotation submitted", quotationService.createQuotation(req, teacherId)));
    }

    @GetMapping("/teacher/quotations")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<List<Quotation>>> getByTeacher(@RequestParam Long teacherId) {
        return ResponseEntity.ok(ApiResponse.ok(quotationService.getQuotationsByTeacher(teacherId)));
    }
}
