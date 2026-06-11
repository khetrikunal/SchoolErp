package com.schoolerp.repository;

import com.schoolerp.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
    void deleteByTimetable_Id(Long timetableId);
    List<TimetableEntry> findByTimetable_Id(Long timetableId);
}
