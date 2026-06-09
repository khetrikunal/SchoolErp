package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "classes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String className; // LKG, UKG, 1st-10th

    @Column(nullable = false)
    private String division; // A, B, C

    private String classTeacher;

    private String room;

    private String academicYear;

    private Integer totalStudents;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}


