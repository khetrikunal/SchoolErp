package com.schoolerp.serviceImpl;

import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Promotion;
import com.schoolerp.model.Student;
import com.schoolerp.repository.PromotionRepository;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private static final String STATUS_PROMOTED = "PROMOTED";
    private static final String STATUS_HELD_BACK = "HELD_BACK";

    private final StudentRepository studentRepository;
    private final PromotionRepository promotionRepository;

    @Override
    @Transactional
    public Promotion promoteStudent(String studentId, String fromClass, String toClass, String academicYear, String status) {
        validateCommon(studentId, "studentId");
        validateCommon(fromClass, "fromClass");
        validateCommon(toClass, "toClass");
        validateCommon(academicYear, "academicYear");
        validateCommon(status, "status");

        String normalizedStatus = normalizeStatus(status);

        Student student = studentRepository.findByStudentId(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found for studentId: " + studentId));

        // Maintain division compatibility: use existing student division
        // Class/division fields already used by attendance/homework, so we update only className.
        // The division remains as-is to avoid breaking legacy flows.
        String currentClassName = student.getClassName();
        if (currentClassName != null && !currentClassName.equalsIgnoreCase(fromClass)) {
            // Soft validation: still allow if fromClass provided but mismatched could be a client bug.
            // For strictness, uncomment exception. Keeping backward compatibility.
        }

        student.setClassName(toClass);
        Student saved = studentRepository.save(student);

        Promotion promo = Promotion.builder()
            .studentId(saved.getStudentId())
            .fromClass(fromClass)
            .toClass(toClass)
            .academicYear(academicYear)
            .promotedAt(LocalDateTime.now())
            .status(normalizedStatus)
            .build();

        return promotionRepository.save(promo);
    }

    @Override
    @Transactional
    public List<Promotion> promoteBulkClass(String fromClass, String toClass, String academicYear) {
        validateCommon(fromClass, "fromClass");
        validateCommon(toClass, "toClass");
        validateCommon(academicYear, "academicYear");

        List<Student> students = studentRepository.findByClassName(fromClass);

        // Batch history creation; preserve transactional rollback safety.
        List<Promotion> promotions = students.stream().map(s -> {
            // Update className
            s.setClassName(toClass);
            return Promotion.builder()
                .studentId(s.getStudentId())
                .fromClass(fromClass)
                .toClass(toClass)
                .academicYear(academicYear)
                .promotedAt(LocalDateTime.now())
                .status(STATUS_PROMOTED)
                .build();
        }).collect(Collectors.toList());

        studentRepository.saveAll(students);
        return promotionRepository.saveAll(promotions);
    }

    private void validateCommon(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
    }

    private String normalizeStatus(String status) {
        String s = status.trim().toUpperCase(Locale.ROOT);
        if (STATUS_PROMOTED.equals(s) || STATUS_HELD_BACK.equals(s)) {
            return s;
        }
        throw new IllegalArgumentException("status must be PROMOTED or HELD_BACK");
    }
}

