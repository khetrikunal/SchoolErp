package com.schoolerp.service;
import com.schoolerp.dto.request.StudentRequest;
import com.schoolerp.dto.response.PagedResponse;
import com.schoolerp.model.Student;
import java.util.List;
public interface StudentService {
    PagedResponse<Student> getAllStudents(int page, int size, String search);
    Student getStudentById(Long id);
    Student createStudent(StudentRequest request);
    Student updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    List<Student> getStudentsByClass(String className);
}
