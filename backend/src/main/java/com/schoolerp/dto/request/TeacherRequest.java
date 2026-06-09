package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class TeacherRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    private String phone;

    // New optional fields
    private LocalDate dateOfBirth;
    private String role;
    private String profilePhoto;
    private String division;
    private String assignedSubject;
    private String assignedClass;

    // User provisioning (admin-created only)
    @NotBlank private String password;
    @NotBlank private String confirmPassword;


    // Existing fields
    private String qualification;
    private String experience;
    private LocalDate joinDate;
    private String gender;
    private String address;
    private String status;
    private List<String> subjects;
    private List<String> classes;
}


