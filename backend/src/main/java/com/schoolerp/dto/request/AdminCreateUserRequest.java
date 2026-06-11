package com.schoolerp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AdminCreateUserRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Mobile number must be 10 to 15 digits")
    private String phone;

    @NotBlank
    private String password;

    // Backend must enforce ADMIN role; frontend may ignore this.
    private String role;

    private String gender;
}



