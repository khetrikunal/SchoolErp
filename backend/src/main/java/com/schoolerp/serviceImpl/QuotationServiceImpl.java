package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.QuotationRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.*;
import com.schoolerp.repository.*;
import com.schoolerp.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {

    private final QuotationRepository quotationRepository;
    private final EventRepository eventRepository;
    private final TeacherRepository teacherRepository;

    @Override public List<Quotation> getAllQuotations() { return quotationRepository.findAll(); }

    @Override
    public Quotation getQuotationById(Long id) {
        return quotationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + id));
    }

    @Override
    public Quotation createQuotation(QuotationRequest req, Long teacherId) {
        Event event = eventRepository.findById(req.getEventId())
            .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + req.getEventId()));
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherId));

        Quotation q = Quotation.builder()
            .title(req.getTitle()).notes(req.getNotes()).vendorDetails(req.getVendorDetails())
            .status(QuotationStatus.PENDING).event(event).teacher(teacher)
            .createdAt(LocalDate.now()).adminRemarks("").build();

        if (req.getItems() != null) {
            List<QuotationItem> items = req.getItems().stream().map(i -> {
                long total = (long)(i.getQuantity() != null ? i.getQuantity() : 0) * (i.getUnitCost() != null ? i.getUnitCost() : 0);
                return QuotationItem.builder().material(i.getMaterial()).quantity(i.getQuantity())
                    .unit(i.getUnit()).unitCost(i.getUnitCost()).total(total)
                    .vendor(i.getVendor()).quotation(q).build();
            }).collect(Collectors.toList());
            q.setItems(items);
            q.setTotalAmount(items.stream().mapToLong(QuotationItem::getTotal).sum());
        }
        return quotationRepository.save(q);
    }

    @Override
    public Quotation updateStatus(Long id, QuotationStatus status, String remarks) {
        Quotation q = getQuotationById(id);
        q.setStatus(status);
        q.setAdminRemarks(remarks);
        return quotationRepository.save(q);
    }

    @Override
    public List<Quotation> getQuotationsByTeacher(Long teacherId) {
        return quotationRepository.findByTeacherId(teacherId);
    }
}
