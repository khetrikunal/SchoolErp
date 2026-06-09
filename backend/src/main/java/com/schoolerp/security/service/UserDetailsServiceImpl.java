package com.schoolerp.security.service;

import com.schoolerp.model.Student;
import com.schoolerp.model.Teacher;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;


    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String id = identifier == null ? null : identifier.trim();
        if (id == null || id.isBlank()) {
            throw new UsernameNotFoundException("User identifier is required");
        }

        // 1) email lookup
        return userRepository.findByEmail(id)
            .map(u -> (UserDetails) u)
            .orElseGet(() -> resolveByStudentOrTeacher(id));
    }

    private UserDetails resolveByStudentOrTeacher(String identifier) {
        // 2) studentId lookup (STD### legacy or SCHYYYYNNN)
        if (identifier.startsWith("STD") || identifier.startsWith("SCH")) {
            return studentRepository.findByStudentId(identifier)
                .map(Student::getUser)
                .filter(u -> u != null)
                .map(u -> (UserDetails) u)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for studentId: " + identifier));
        }


        // 3) teacherId lookup (TCH###)
        if (identifier.startsWith("TCH")) {
            return teacherRepository.findByTeacherId(identifier)
                .map(Teacher::getUser)
                .filter(u -> u != null)
                .map(u -> (UserDetails) u)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for teacherId: " + identifier));
        }

        throw new UsernameNotFoundException("User not found: " + identifier);
    }

}

