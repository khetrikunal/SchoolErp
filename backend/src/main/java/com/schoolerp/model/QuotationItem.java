package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "quotation_items")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class QuotationItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String material;
    private Integer quantity;
    private String unit;
    private Long unitCost;
    private Long total;
    private String vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id")
    private Quotation quotation;
}
