package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
@Data
public class StudentRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    private String phone;

    // New optional fields (nullable for backward compatibility)
    private String parentEmail;
    private String bloodGroup;
    private String emergencyContact;
    private String previousSchool;
    private String academicYear;
    private LocalDate admissionDate;
    private String profilePhoto;
    private String division;

    // User provisioning (admin-created only)
    @NotBlank private String password;
    @NotBlank private String confirmPassword;


    // Existing required/used fields
    @NotBlank private String className;
    private String section;
    private String gender;
    private LocalDate dateOfBirth;
    private String parentName;
    private String parentPhone;
    private String address;
    private Integer admissionYear;
    private String status;
}


