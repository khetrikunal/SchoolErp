package com.schoolerp.repository;

import com.schoolerp.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    Optional<Timetable> findByClassRef_Id(Long classId);
    void deleteByClassRef_Id(Long classId);
}
