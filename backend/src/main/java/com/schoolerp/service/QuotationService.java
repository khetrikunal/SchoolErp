package com.schoolerp.service;
import com.schoolerp.dto.request.QuotationRequest;
import com.schoolerp.model.Quotation;
import com.schoolerp.model.QuotationStatus;
import java.util.List;
public interface QuotationService {
    List<Quotation> getAllQuotations();
    Quotation getQuotationById(Long id);
    Quotation createQuotation(QuotationRequest request, Long teacherId);
    Quotation updateStatus(Long id, QuotationStatus status, String remarks);
    List<Quotation> getQuotationsByTeacher(Long teacherId);
}
