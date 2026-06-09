package com.schoolerp.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClassRequest {

    @NotBlank
    private String className;

    @NotBlank
    private String division;

    private String classTeacher;

    private String room;

    private String academicYear;

    @Min(0)
    private Integer totalStudents;

    // Optional: if provided, otherwise backend will set createdAt
    private LocalDateTime createdAt;
}

