package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String fromClass;

    @Column(nullable = false)
    private String toClass;

    @Column(nullable = false)
    private String academicYear;

    @Column(nullable = false)
    private LocalDateTime promotedAt;

    @Column(nullable = false)
    private String status; // PROMOTED / HELD_BACK
}

