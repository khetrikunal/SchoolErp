package com.schoolerp.service;

import com.schoolerp.model.Promotion;

import java.util.List;

public interface PromotionService {

    Promotion promoteStudent(String studentId, String fromClass, String toClass, String academicYear, String status);

    List<Promotion> promoteBulkClass(String fromClass, String toClass, String academicYear);
}

