package com.schoolerp.controller;

import com.schoolerp.dto.request.TeacherRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Teacher;
import com.schoolerp.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Teacher>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getAllTeachers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Teacher>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getTeacherById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Teacher>> create(@Valid @RequestBody TeacherRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Teacher created", teacherService.createTeacher(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Teacher>> update(@PathVariable Long id, @Valid @RequestBody TeacherRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Teacher updated", teacherService.updateTeacher(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(ApiResponse.ok("Teacher deleted", null));
    }
}
