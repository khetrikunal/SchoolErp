package com.schoolerp.controller;

import com.schoolerp.dto.request.ClassRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Class;
import com.schoolerp.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Class>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(classService.getAllClasses()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Class>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(classService.getClassById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Class>> create(@Valid @RequestBody ClassRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Class created", classService.createClass(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Class>> update(@PathVariable Long id, @Valid @RequestBody ClassRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Class updated", classService.updateClass(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.ok("Class deleted", null));
    }
}

