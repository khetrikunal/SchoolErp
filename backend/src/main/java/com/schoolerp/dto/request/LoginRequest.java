package com.schoolerp.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginRequest {
    /**
     * Backward compatible: existing frontend sends `email`.
     * New flow may send identifier via `identifier`.
     */
    @Email
    private String email;

    /**
     * Identifier can be email, teacherId (TCH###), or studentId (STD###).
     */
    private String identifier;

    @NotBlank @Size(min = 6)
    private String password;
}

