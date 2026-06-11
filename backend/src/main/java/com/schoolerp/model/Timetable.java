package com.schoolerp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "timetables",
       uniqueConstraints = @UniqueConstraint(name = "uk_timetables_class_id", columnNames = "class_id"))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false, foreignKey = @ForeignKey(name = "fk_timetable_class"))
    private Class classRef;

    // One timetable has many entries (days + periods)
    // We manage persistence via TimetableEntryRepository/service (or cascade if preferred).
}
