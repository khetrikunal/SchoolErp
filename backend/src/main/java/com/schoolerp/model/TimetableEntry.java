package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "timetable_entries",
       indexes = @Index(name = "idx_timetable_entries_timetable_id", columnList = "timetable_id"))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_id", nullable = false, foreignKey = @ForeignKey(name = "fk_timetable_entry_timetable"))
    private Timetable timetable;

    @Column(nullable = false)
    private String day;

    @Column(nullable = false)
    private Integer periodIndex;

    @Column(nullable = false, length = 100)
    private String subject;
}
