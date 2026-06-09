package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;
@Data
public class EventRequest {
    @NotBlank private String name;
    private String type;
    private LocalDate date;
    private LocalTime time;
    private String venue;
    private String description;
    private Long budget;
    private String status;
    private Set<Long> assignedTeacherIds;
}
