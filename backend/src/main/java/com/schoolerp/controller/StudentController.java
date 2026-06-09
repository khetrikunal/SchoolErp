package com.schoolerp.controller;

import com.schoolerp.dto.request.StudentRequest;
import com.schoolerp.dto.response.*;
import com.schoolerp.model.Student;
import com.schoolerp.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/admin/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<Student>>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getAllStudents(page, size, search)));
    }

    @GetMapping("/admin/students/{id}")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudentById(id)));
    }

    @PostMapping("/admin/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Student>> create(@Valid @RequestBody StudentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Student created", studentService.createStudent(req)));
    }

    @PutMapping("/admin/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable Long id, @Valid @RequestBody StudentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Student updated", studentService.updateStudent(id, req)));
    }

    @DeleteMapping("/admin/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted", null));
    }

    @GetMapping("/admin/students/class/{className}")
    public ResponseEntity<ApiResponse<List<Student>>> getByClass(@PathVariable String className) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getStudentsByClass(className)));
    }
}
