package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.AdminCreateUserRequest;
import com.schoolerp.dto.request.StudentCreateUserRequest;
import com.schoolerp.dto.request.TeacherCreateUserRequest;
import com.schoolerp.exception.ValidationException;
import com.schoolerp.model.Role;
import com.schoolerp.model.Student;
import com.schoolerp.model.Teacher;
import com.schoolerp.model.User;
import com.schoolerp.repository.StudentRepository;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createAdmin(AdminCreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(Role.ADMIN)
            .designation("Admin")
            .phone(req.getPhone())
            .build();

        return userRepository.save(user);
    }

    @Override
    public User createTeacher(TeacherCreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        String teacherId = "TCH" + String.format("%03d", teacherRepository.count() + 1);

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(Role.TEACHER)
            .designation("Teacher")
            .phone(req.getPhone())
            .build();

        user = userRepository.save(user);

        Teacher teacher = Teacher.builder()
            .empId("TCHEMP-" + System.currentTimeMillis() % 100000)
            .teacherId(teacherId)
            .name(req.getName())
            .email(req.getEmail())
            .phone(req.getPhone())
            .gender(req.getGender())
            .status("Active")
            .user(user)
            .build();

        teacherRepository.save(teacher);
        return user;
    }

    @Override
    public User createStudent(StudentCreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        String studentId = "SCH" + java.time.LocalDate.now().getYear() + String.format("%03d", studentRepository.count() + 1);

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(Role.STUDENT)
            .designation("Student")
            .phone(req.getPhone())
            .build();

        user = userRepository.save(user);

        Student student = Student.builder()
            .rollNo("STU-" + System.currentTimeMillis() % 100000)
            .studentId(studentId)
            .name(req.getName())
            .email(req.getEmail())
            .phone(req.getPhone())
            .gender(req.getGender())
            .className(req.getClassName())
            .status("Active")
            .user(user)
            .build();

        studentRepository.save(student);
        return user;
    }
}

