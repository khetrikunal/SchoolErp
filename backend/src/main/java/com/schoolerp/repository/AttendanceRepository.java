package com.schoolerp.repository;
import com.schoolerp.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassNameAndDate(String className, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByClassName(String className);
}
