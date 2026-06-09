package com.schoolerp.repository;

import com.schoolerp.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassRepository extends JpaRepository<Class, Long> {
    Optional<Class> findByClassNameAndDivision(String className, String division);
    List<Class> findByAcademicYear(String academicYear);
}

