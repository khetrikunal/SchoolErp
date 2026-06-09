package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "notices")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String content;

    private String priority;

    // New targeting fields (nullable for compatibility)
    private String targetType; // ALL, TEACHERS, STUDENTS, SPECIFIC_CLASS
    private String targetClass;
    private String targetDivision;

    // Existing audience fields (compatibility)
    private String audience;
    private String category;

    private String postedBy;
    private LocalDate date;
}
