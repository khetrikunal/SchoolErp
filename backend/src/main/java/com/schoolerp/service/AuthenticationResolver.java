package com.schoolerp.service;

import com.schoolerp.model.Student;
import com.schoolerp.model.Teacher;
import com.schoolerp.model.User;

public interface AuthenticationResolver {
    User resolveUser(String email, String identifier);
    Teacher resolveTeacherByTeacherId(String teacherId);
    Student resolveStudentByStudentId(String studentId);
}

