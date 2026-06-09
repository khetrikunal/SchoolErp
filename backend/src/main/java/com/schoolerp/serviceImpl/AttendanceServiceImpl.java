package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.AttendanceRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.*;
import com.schoolerp.repository.*;
import com.schoolerp.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Override
    public List<Attendance> saveAttendance(AttendanceRequest req, String markedBy) {
        List<Attendance> records = req.getRecords().stream().map(r -> {
            Student student = studentRepository.findById(r.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student: " + r.getStudentId()));
            return Attendance.builder()
                .student(student).date(req.getDate()).status(r.getStatus())
                .className(req.getClassName()).markedBy(markedBy).build();
        }).collect(Collectors.toList());
        return attendanceRepository.saveAll(records);
    }

    @Override
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @Override
    public List<Attendance> getAttendanceByClass(String className) {
        return attendanceRepository.findByClassName(className);
    }

    @Override
    public Map<String, Object> getAttendanceSummary(Long studentId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        long present = records.stream().filter(a -> "Present".equals(a.getStatus())).count();
        long absent  = records.stream().filter(a -> "Absent".equals(a.getStatus())).count();
        long late    = records.stream().filter(a -> "Late".equals(a.getStatus())).count();
        long total   = records.size();
        double pct   = total > 0 ? Math.round((present * 100.0 / total) * 10) / 10.0 : 0;
        return Map.of("totalDays", total, "present", present, "absent", absent, "late", late, "percentage", pct);
    }
}
