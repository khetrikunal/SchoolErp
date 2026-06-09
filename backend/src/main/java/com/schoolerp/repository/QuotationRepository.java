package com.schoolerp.repository;
import com.schoolerp.model.Quotation;
import com.schoolerp.model.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByTeacherId(Long teacherId);
    List<Quotation> findByStatus(QuotationStatus status);
    List<Quotation> findByEventId(Long eventId);
}
