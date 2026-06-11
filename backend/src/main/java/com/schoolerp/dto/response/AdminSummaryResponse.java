package com.schoolerp.dto.response;

import com.schoolerp.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}

