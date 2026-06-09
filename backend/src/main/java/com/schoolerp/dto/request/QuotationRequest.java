package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
@Data
public class QuotationRequest {
    @NotBlank private String title;
    @NotNull  private Long eventId;
    private String notes;
    private String vendorDetails;
    private List<QuotationItemRequest> items;
    @Data
    public static class QuotationItemRequest {
        private String material;
        private Integer quantity;
        private String unit;
        private Long unitCost;
        private String vendor;
    }
}
