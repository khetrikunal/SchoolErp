package com.schoolerp.service;
import com.schoolerp.dto.request.TeacherRequest;
import com.schoolerp.model.Teacher;
import java.util.List;
public interface TeacherService {
    List<Teacher> getAllTeachers();
    Teacher getTeacherById(Long id);
    Teacher createTeacher(TeacherRequest request);
    Teacher updateTeacher(Long id, TeacherRequest request);
    void deleteTeacher(Long id);
}
