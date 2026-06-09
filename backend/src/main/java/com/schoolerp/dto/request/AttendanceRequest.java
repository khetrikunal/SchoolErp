package com.schoolerp.dto.request;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class AttendanceRequest {
    private String className;
    private LocalDate date;
    private List<StudentAttendance> records;
    @Data
    public static class StudentAttendance {
        private Long studentId;
        private String status;
    }
}
