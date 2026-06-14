package com.schoolerp.controller;

import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Homework;
import com.schoolerp.model.User;
import com.schoolerp.model.Student;
import com.schoolerp.repository.HomeworkRepository;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/homework")
@RequiredArgsConstructor
@Slf4j
public class HomeworkController {

    private final HomeworkRepository homeworkRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Homework>>> getHomework(
            @RequestParam(required = false) String className,
            Principal principal
    ) {
        log.info("[HomeworkController] Fetching homework requested by: {}", principal.getName());
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Homework> list;
        if (user.getRole().name().equals("STUDENT")) {
            // Students can only see homework for their own class
            Student student = studentRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
            String studentClass = student.getClassName();
            log.info("[HomeworkController] Student class resolved: {}", studentClass);
            if (studentClass == null || studentClass.isBlank()) {
                list = Collections.emptyList();
            } else {
                list = homeworkRepository.findByClassName(studentClass);
            }
        } else if (user.getRole().name().equals("TEACHER")) {
            // Teachers see homework they created, or by class if requested
            if (className != null && !className.isBlank()) {
                list = homeworkRepository.findByClassName(className);
            } else {
                list = homeworkRepository.findByCreatedBy(user.getName());
            }
        } else {
            // Admin can see everything
            if (className != null && !className.isBlank()) {
                list = homeworkRepository.findByClassName(className);
            } else {
                list = homeworkRepository.findAll();
            }
        }

        // Sort by id descending so newest is first
        list.sort((h1, h2) -> h2.getId().compareTo(h1.getId()));

        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Homework>> createHomework(
            @RequestParam("title") String title,
            @RequestParam("subject") String subject,
            @RequestParam("className") String className,
            @RequestParam("dueDate") String dueDate,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal principal
    ) {
        log.info("[HomeworkController] Creating homework: {} for class: {}", title, className);
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String attachmentUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                attachmentUrl = cloudinaryService.uploadFile(file);
            } catch (Exception e) {
                log.error("[HomeworkController] Cloudinary upload failed: {}", e.getMessage());
                return ResponseEntity.badRequest().body(ApiResponse.error("File upload failed: " + e.getMessage()));
            }
        }

        Homework homework = Homework.builder()
                .title(title)
                .subject(subject)
                .className(className)
                .dueDate(LocalDate.parse(dueDate))
                .description(description)
                .createdAt(LocalDate.now())
                .createdBy(user.getName())
                .totalStudents(32) // placeholder
                .submissions(0)
                .attachmentUrl(attachmentUrl)
                .build();

        Homework saved = homeworkRepository.save(homework);
        return ResponseEntity.ok(ApiResponse.ok("Homework assigned successfully", saved));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Homework>> updateHomework(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("subject") String subject,
            @RequestParam("className") String className,
            @RequestParam("dueDate") String dueDate,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "removeAttachment", required = false, defaultValue = "false") boolean removeAttachment
    ) {
        log.info("[HomeworkController] Updating homework ID: {}", id);
        Homework existing = homeworkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Homework assignment not found"));

        existing.setTitle(title);
        existing.setSubject(subject);
        existing.setClassName(className);
        existing.setDueDate(LocalDate.parse(dueDate));
        existing.setDescription(description);

        if (removeAttachment) {
            existing.setAttachmentUrl(null);
        } else if (file != null && !file.isEmpty()) {
            try {
                String attachmentUrl = cloudinaryService.uploadFile(file);
                existing.setAttachmentUrl(attachmentUrl);
            } catch (Exception e) {
                log.error("[HomeworkController] Cloudinary upload failed: {}", e.getMessage());
                return ResponseEntity.badRequest().body(ApiResponse.error("File upload failed: " + e.getMessage()));
            }
        }

        Homework saved = homeworkRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.ok("Homework updated successfully", saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteHomework(@PathVariable Long id) {
        log.info("[HomeworkController] Deleting homework ID: {}", id);
        if (!homeworkRepository.existsById(id)) {
            throw new IllegalArgumentException("Homework assignment not found");
        }
        homeworkRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Homework deleted successfully", null));
    }
}
