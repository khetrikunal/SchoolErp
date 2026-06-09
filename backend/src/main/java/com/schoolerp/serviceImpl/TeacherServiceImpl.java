package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.TeacherRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Teacher;
import com.schoolerp.model.User;

import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + id));
    }

    @Override
    public Teacher createTeacher(TeacherRequest req) {
        if (req.getPassword() == null || req.getConfirmPassword() == null || !req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String empId = "TCH-" + String.format("%03d", teacherRepository.count() + 1);
        String teacherId = generateTeacherId();

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(com.schoolerp.model.Role.TEACHER)
            .designation("Teacher")
            .build();

        user = userRepository.save(user);

        Teacher teacher = Teacher.builder()
            .empId(empId)
            .teacherId(teacherId)
            .name(req.getName())
            .email(req.getEmail())
            .phone(req.getPhone())
            // new optional fields
            .dateOfBirth(req.getDateOfBirth())
            .role(req.getRole())
            .profilePhoto(req.getProfilePhoto())
            .division(req.getDivision())
            .assignedSubject(req.getAssignedSubject())
            .assignedClass(req.getAssignedClass())
            // existing fields
            .qualification(req.getQualification())
            .experience(req.getExperience())
            .joinDate(req.getJoinDate())
            .gender(req.getGender())
            .address(req.getAddress())
            .status(req.getStatus() != null ? req.getStatus() : "Active")
            .subjects(req.getSubjects())
            .classes(req.getClasses())
            .user(user)
            .build();

        return teacherRepository.save(teacher);
    }


    @Override
    public Teacher updateTeacher(Long id, TeacherRequest req) {
        Teacher t = getTeacherById(id);
        t.setName(req.getName());
        t.setEmail(req.getEmail());
        t.setPhone(req.getPhone());

        // new optional fields
        t.setDateOfBirth(req.getDateOfBirth());
        t.setRole(req.getRole());
        t.setProfilePhoto(req.getProfilePhoto());
        t.setDivision(req.getDivision());
        t.setAssignedSubject(req.getAssignedSubject());
        t.setAssignedClass(req.getAssignedClass());

        // existing fields
        t.setQualification(req.getQualification());
        t.setExperience(req.getExperience());
        t.setJoinDate(req.getJoinDate());
        t.setGender(req.getGender());
        t.setAddress(req.getAddress());
        if (req.getStatus() != null) t.setStatus(req.getStatus());
        if (req.getSubjects() != null) t.setSubjects(req.getSubjects());
        if (req.getClasses() != null) t.setClasses(req.getClasses());

        // legacy records fallback
        if (t.getTeacherId() == null || t.getTeacherId().isBlank()) {
            t.setTeacherId(generateTeacherId());
        }

        return teacherRepository.save(t);
    }

    @Override
    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    // Generate new teacherId in TCH### format based on max existing values.

    private String generateTeacherId() {
        int max = teacherRepository.findAll().stream()
            .filter(t -> t.getTeacherId() != null && t.getTeacherId().startsWith("TCH"))
            .map(t -> t.getTeacherId().replace("TCH", ""))
            .filter(v -> v.matches("\\d+"))
            .mapToInt(Integer::parseInt)
            .max()
            .orElse(0);

        int next = max + 1;
        return "TCH" + String.format("%03d", next);
    }
}

