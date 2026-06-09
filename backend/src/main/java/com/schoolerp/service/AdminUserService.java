package com.schoolerp.service;

import com.schoolerp.dto.request.AdminCreateUserRequest;
import com.schoolerp.dto.request.StudentCreateUserRequest;
import com.schoolerp.dto.request.TeacherCreateUserRequest;
import com.schoolerp.model.User;

public interface AdminUserService {
    User createAdmin(AdminCreateUserRequest req);
    User createTeacher(TeacherCreateUserRequest req);
    User createStudent(StudentCreateUserRequest req);
}

