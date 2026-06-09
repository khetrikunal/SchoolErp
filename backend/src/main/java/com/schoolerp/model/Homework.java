package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "homework")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Homework {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String subject;
    private String className;
    private LocalDate dueDate;
    private LocalDate createdAt;
    private String createdBy;
    private Integer totalStudents;
    private Integer submissions = 0;
}
