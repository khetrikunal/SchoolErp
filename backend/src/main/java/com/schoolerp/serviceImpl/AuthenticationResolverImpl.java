package com.schoolerp.serviceImpl;

import com.schoolerp.model.Student;
import com.schoolerp.model.Teacher;
import com.schoolerp.model.User;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.service.AuthenticationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationResolverImpl implements AuthenticationResolver {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Override
    public User resolveUser(String email, String identifier) {
        // Contract: identifier formats like TCH### / STD### / SCH####### must win over email,
        // otherwise teacher/student logins may fail when frontend accidentally sends email.

        String trimmed = identifier == null ? null : identifier.trim();

        if (trimmed != null && !trimmed.isBlank()) {
            // If identifier is clearly teacherId/studentId, resolve by that first.
            if (trimmed.startsWith("TCH")) {
                Teacher t = resolveTeacherByTeacherId(trimmed);
                if (t.getUser() != null) return t.getUser();
                throw new IllegalArgumentException("Teacher account is not provisioned");
            }

            if (trimmed.startsWith("STD") || trimmed.startsWith("SCH")) {
                Student s = resolveStudentByStudentId(trimmed);
                if (s.getUser() != null) return s.getUser();
                throw new IllegalArgumentException("Student account is not provisioned");
            }

            // If identifier looks like an email, treat it as email.
            if (trimmed.contains("@")) {
                return userRepository.findByEmail(trimmed)
                    .orElseThrow(() -> new IllegalArgumentException("User not found for email"));
            }
        }

        // Fallback: resolve by email only if no usable identifier was provided.
        if (email != null && !email.isBlank()) {
            return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email"));
        }

        throw new IllegalArgumentException("Identifier is required");
    }


    @Override
    public Teacher resolveTeacherByTeacherId(String teacherId) {
        return teacherRepository.findByTeacherId(teacherId)
            .orElseThrow(() -> new IllegalArgumentException("Teacher not found for id"));

    }

    @Override
    public Student resolveStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found for id"));

    }
}

