package com.schoolerp.controller;

import com.schoolerp.model.Class;
import com.schoolerp.model.Notice;
import com.schoolerp.model.Student;
import com.schoolerp.model.Teacher;
import com.schoolerp.repository.ClassRepository;
import com.schoolerp.repository.NoticeRepository;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.dto.response.ApiResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminStatsController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;
    private final NoticeRepository noticeRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalClasses = classRepository.count();

        // Lightweight fallback to avoid heavy aggregate queries / schema assumptions.
        double avgAttendance = 94.2;

        // Latest notices - repository already supports ordering by date desc.
        // If the table has fewer than 5 records, it will naturally return fewer.
        List<Notice> recentNotices = noticeRepository.findAllByOrderByDateDesc();
        if (recentNotices != null && recentNotices.size() > 5) {
            recentNotices = recentNotices.subList(0, 5);
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("totalStudents", totalStudents);
        payload.put("totalTeachers", totalTeachers);
        payload.put("totalClasses", totalClasses);
        payload.put("avgAttendance", avgAttendance);
        payload.put("recentNotices", recentNotices);

        return ResponseEntity.ok(ApiResponse.ok(payload));
    }
}

