package com.schoolerp.repository;
import com.schoolerp.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmail(String email);
    Optional<Teacher> findByTeacherId(String teacherId);
    List<Teacher> findByStatus(String status);
    boolean existsByEmail(String email);
}

