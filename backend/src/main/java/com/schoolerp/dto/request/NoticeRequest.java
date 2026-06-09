package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class NoticeRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    private String priority;
    private String audience;
    private String category;

    // New optional targeting fields
    private String targetType; // ALL, TEACHERS, STUDENTS, SPECIFIC_CLASS
    private String targetClass;
    private String targetDivision;
}

