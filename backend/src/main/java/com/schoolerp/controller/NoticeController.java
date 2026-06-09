package com.schoolerp.controller;

import com.schoolerp.dto.request.NoticeRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Notice;
import com.schoolerp.model.User;
import com.schoolerp.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/admin/notices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Notice>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getAllNotices()));
    }

    @PostMapping("/admin/notices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Notice>> create(
        @Valid @RequestBody NoticeRequest req,
        @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Notice posted", noticeService.createNotice(req, user.getName())));
    }

    @PutMapping("/admin/notices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Notice>> update(@PathVariable Long id, @Valid @RequestBody NoticeRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Notice updated", noticeService.updateNotice(id, req)));
    }

    @DeleteMapping("/admin/notices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.ok("Notice deleted", null));
    }

    @GetMapping("/teacher/notices")
    public ResponseEntity<ApiResponse<List<Notice>>> getForTeacher() {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getNoticesForRole("TEACHER")));
    }

    @GetMapping("/student/notices")
    public ResponseEntity<ApiResponse<List<Notice>>> getForStudent() {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getNoticesForRole("STUDENT")));
    }
}
