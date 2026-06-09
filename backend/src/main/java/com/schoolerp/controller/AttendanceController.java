package com.schoolerp.controller;

import com.schoolerp.dto.request.AttendanceRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.*;
import com.schoolerp.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/teacher/attendance")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> save(
        @RequestBody AttendanceRequest req,
        @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Attendance saved", attendanceService.saveAttendance(req, user.getName())));
    }

    @GetMapping("/admin/attendance/class/{className}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByClass(@PathVariable String className) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAttendanceByClass(className)));
    }

    @GetMapping("/student/attendance/{studentId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAttendanceByStudent(studentId)));
    }

    @GetMapping("/student/attendance/{studentId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAttendanceSummary(studentId)));
    }
}
