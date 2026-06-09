package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.StudentRequest;
import com.schoolerp.dto.response.PagedResponse;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Student;
import com.schoolerp.model.User;

import com.schoolerp.repository.StudentRepository;
import com.schoolerp.repository.UserRepository;
import com.schoolerp.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public PagedResponse<Student> getAllStudents(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        Page<Student> studentPage;
        if (search != null && !search.isBlank()) {
            studentPage = studentRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else {
            studentPage = studentRepository.findAll(pageable);
        }
        return PagedResponse.<Student>builder()
            .content(studentPage.getContent())
            .page(studentPage.getNumber())
            .size(studentPage.getSize())
            .totalElements(studentPage.getTotalElements())
            .totalPages(studentPage.getTotalPages())
            .last(studentPage.isLast())
            .build();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public Student createStudent(StudentRequest req) {
        if (req.getPassword() == null || req.getConfirmPassword() == null || !req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String rollNo = "STU-" + System.currentTimeMillis() % 100000;

        // generate SCHYYYYNNN style registration ID (for new records only)
        String studentId = generateStudentId();


        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(com.schoolerp.model.Role.STUDENT)
            .designation("Student")
            .build();

        user = userRepository.save(user);

        Student student = Student.builder()
            .rollNo(rollNo)
            .studentId(studentId)
            .name(req.getName())
            .email(req.getEmail())
            .phone(req.getPhone())
            // new optional fields
            .parentEmail(req.getParentEmail())
            .bloodGroup(req.getBloodGroup())
            .emergencyContact(req.getEmergencyContact())
            .previousSchool(req.getPreviousSchool())
            .academicYear(req.getAcademicYear())
            .admissionDate(req.getAdmissionDate())
            .profilePhoto(req.getProfilePhoto())
            .division(req.getDivision())
            // existing fields
            .className(req.getClassName())
            .section(req.getSection())
            .gender(req.getGender())
            .dateOfBirth(req.getDateOfBirth())
            .parentName(req.getParentName())
            .parentPhone(req.getParentPhone())
            .address(req.getAddress())
            .admissionYear(req.getAdmissionYear())
            .status(req.getStatus() != null ? req.getStatus() : "Active")
            .user(user)
            .build();

        return studentRepository.save(student);
    }



    @Override
    public Student updateStudent(Long id, StudentRequest req) {
        Student student = getStudentById(id);
        student.setName(req.getName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());

        // new optional fields (safe to set null)
        student.setParentEmail(req.getParentEmail());
        student.setBloodGroup(req.getBloodGroup());
        student.setEmergencyContact(req.getEmergencyContact());
        student.setPreviousSchool(req.getPreviousSchool());
        student.setAcademicYear(req.getAcademicYear());
        student.setAdmissionDate(req.getAdmissionDate());
        student.setProfilePhoto(req.getProfilePhoto());
        student.setDivision(req.getDivision());

        // existing fields
        student.setClassName(req.getClassName());
        student.setSection(req.getSection());
        student.setGender(req.getGender());
        student.setDateOfBirth(req.getDateOfBirth());
        student.setParentName(req.getParentName());
        student.setParentPhone(req.getParentPhone());
        student.setAddress(req.getAddress());
        student.setAdmissionYear(req.getAdmissionYear());
        if (req.getStatus() != null) student.setStatus(req.getStatus());

        // for legacy records that might not have studentId
        if (student.getStudentId() == null || student.getStudentId().isBlank()) {
            student.setStudentId(generateStudentId());
        }

        return studentRepository.save(student);
    }


    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) throw new ResourceNotFoundException("Student not found: " + id);
        studentRepository.deleteById(id);
    }

    @Override
    public List<Student> getStudentsByClass(String className) {
        return studentRepository.findByClassName(className);
    }

    private String generateStudentId() {
        // Generate SCH + YEAR + 3-digit sequential counter (e.g., SCH2026001)
        // NOTE: We only generate this format for new students. Legacy existing IDs are preserved.
        int year = java.time.LocalDate.now().getYear();

        // Find max sequence for current year (SCHYYYYNNN)
        int max = studentRepository.findAll().stream()
            .map(StudentServiceImpl::safeExtractSchYearSeq)
            .filter(t -> t != null && t.year == year)
            .mapToInt(t -> t.seq)
            .max()
            .orElse(0);

        int next = max + 1;
        return "SCH" + year + String.format("%03d", next);
    }

    private static class SchParts {
        final int year;
        final int seq;
        SchParts(int year, int seq) {
            this.year = year;
            this.seq = seq;
        }
    }

    private static SchParts safeExtractSchYearSeq(Student s) {
        if (s == null || s.getStudentId() == null) return null;
        String sid = s.getStudentId();
        if (!sid.startsWith("SCH")) return null;
        // Expect SCHYYYYNNN
        if (sid.length() != 3 + 4 + 3) return null;
        String yearStr = sid.substring(3, 7);
        String seqStr = sid.substring(7);
        if (!yearStr.matches("\\d{4}") || !seqStr.matches("\\d{3}")) return null;
        int year = Integer.parseInt(yearStr);
        int seq = Integer.parseInt(seqStr);
        return new SchParts(year, seq);
    }
}


