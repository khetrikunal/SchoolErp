package com.schoolerp.repository;
import com.schoolerp.model.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByClassName(String className);
    List<Homework> findByCreatedBy(String createdBy);
}
