package com.schoolerp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableRequest {

    // days -> periods[6] in UI order
    private List<TimetableDayRequest> days = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimetableDayRequest {
        @NotBlank
        private String day;

        // UI currently expects 6 periods (P1..P6)
        private List<String> periods = new ArrayList<>();
    }
}
