package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.ClassRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Class;
import com.schoolerp.repository.ClassRepository;
import com.schoolerp.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;

    @Override
    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    @Override
    public Class getClassById(Long id) {
        return classRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));
    }

    @Override
    public Class createClass(ClassRequest request) {
        validateClassNameAndDivision(request.getClassName(), request.getDivision());

        LocalDateTime createdAt = request.getCreatedAt() != null ? request.getCreatedAt() : LocalDateTime.now();

        // If same className/division exists, treat as update-like behavior prevention
        classRepository.findByClassNameAndDivision(request.getClassName(), request.getDivision())
            .ifPresent(existing -> {
                throw new IllegalArgumentException("Class already exists for className/division: "
                    + request.getClassName() + "/" + request.getDivision());
            });

        return classRepository.save(
            Class.builder()
                .className(request.getClassName())
                .division(request.getDivision())
                .classTeacher(request.getClassTeacher())
                .room(request.getRoom())
                .academicYear(request.getAcademicYear())
                .totalStudents(request.getTotalStudents())
                .createdAt(createdAt)
                .build()
        );
    }

    @Override
    public Class updateClass(Long id, ClassRequest request) {
        Class c = getClassById(id);
        validateClassNameAndDivision(request.getClassName(), request.getDivision());

        c.setClassName(request.getClassName());
        c.setDivision(request.getDivision());
        c.setClassTeacher(request.getClassTeacher());
        c.setRoom(request.getRoom());
        c.setAcademicYear(request.getAcademicYear());
        c.setTotalStudents(request.getTotalStudents());
        if (request.getCreatedAt() != null) {
            c.setCreatedAt(request.getCreatedAt());
        }
        return classRepository.save(c);
    }

    @Override
    public void deleteClass(Long id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found: " + id);
        }
        classRepository.deleteById(id);
    }

    private void validateClassNameAndDivision(String className, String division) {
        if (className == null || className.isBlank()) {
            throw new IllegalArgumentException("className is required");
        }
        if (division == null || division.isBlank()) {
            throw new IllegalArgumentException("division is required");
        }

        String normalizedDivision = division.trim().toUpperCase();
        if (!normalizedDivision.matches("[ABC]")) {
            throw new IllegalArgumentException("division must be one of A, B, C");
        }

        String normalizedClassName = className.trim();
        // Allow LKG, UKG, 1st-10th (keep flexible to avoid breaking compatibility)
        boolean ok =
            "LKG".equalsIgnoreCase(normalizedClassName) ||
            "UKG".equalsIgnoreCase(normalizedClassName) ||
            normalizedClassName.matches("(?i)^[1-9]th$") ||
            normalizedClassName.matches("(?i)^10th$") ||
            normalizedClassName.matches("(?i)^([1]st|2nd|3rd|[4-9]th|10th)$");

        if (!ok) {
            throw new IllegalArgumentException("className must be LKG, UKG, or 1st-10th");
        }

    }
}


