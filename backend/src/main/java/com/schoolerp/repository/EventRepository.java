package com.schoolerp.repository;
import com.schoolerp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(String status);
    @Query("SELECT e FROM Event e JOIN e.assignedTeachers t WHERE t.id = :teacherId")
    List<Event> findByAssignedTeacherId(@Param("teacherId") Long teacherId);
}
