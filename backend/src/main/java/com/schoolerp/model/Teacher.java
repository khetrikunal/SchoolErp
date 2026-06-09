package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity @Table(name = "teachers")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Teacher {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String empId;

    // New display/login ID (nullable for backward compatibility)
    @Column(unique = true)
    private String teacherId;


    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    // New fields
    private LocalDate dateOfBirth;
    private String role;
    private String profilePhoto;
    private String division;
    private String assignedSubject;
    private String assignedClass;

    // Existing fields (keep for compatibility)
    private String qualification;

    private String experience;
    private LocalDate joinDate;
    private String gender;
    private String address;

    @Column(nullable = false)
    private String status = "Active";

    @ElementCollection
    @CollectionTable(name = "teacher_subjects", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "subject")
    private List<String> subjects;

    @ElementCollection
    @CollectionTable(name = "teacher_classes", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "class_name")
    private List<String> classes;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
