package com.schoolerp.service;

import com.schoolerp.dto.request.ClassRequest;
import com.schoolerp.model.Class;

import java.util.List;

public interface ClassService {
    List<Class> getAllClasses();
    Class getClassById(Long id);
    Class createClass(ClassRequest request);
    Class updateClass(Long id, ClassRequest request);
    void deleteClass(Long id);
}

