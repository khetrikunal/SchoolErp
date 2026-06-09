package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity @Table(name = "events")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;
    private LocalDate date;
    private LocalTime time;
    private String venue;

    @Column(length = 1000)
    private String description;

    private Long budget;
    private String status;

    @ManyToMany
    @JoinTable(
        name = "event_teacher_access",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> assignedTeachers = new HashSet<>();
}
