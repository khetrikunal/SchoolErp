package com.schoolerp.service;
import com.schoolerp.dto.request.AttendanceRequest;
import com.schoolerp.model.Attendance;
import java.util.List;
import java.util.Map;
public interface AttendanceService {
    List<Attendance> saveAttendance(AttendanceRequest request, String markedBy);
    List<Attendance> getAttendanceByStudent(Long studentId);
    List<Attendance> getAttendanceByClass(String className);
    Map<String, Object> getAttendanceSummary(Long studentId);
}
