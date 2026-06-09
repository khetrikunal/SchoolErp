package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "students")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String rollNo;

    // New production IDs (nullable for backward compatibility with existing records)
    @Column(unique = true)
    private String studentId;


    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    // New fields
    private String parentEmail;
    private String bloodGroup;
    private String emergencyContact;
    private String previousSchool;
    private String academicYear;
    private LocalDate admissionDate;
    private String profilePhoto;
    private String division;

    // Existing fields (keep for compatibility)
    private String className;
    private String section;
    private String gender;

    private LocalDate dateOfBirth;
    private String parentName;
    private String parentPhone;
    private String address;
    private Integer admissionYear;


    @Column(nullable = false)
    private String status = "Active";

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
