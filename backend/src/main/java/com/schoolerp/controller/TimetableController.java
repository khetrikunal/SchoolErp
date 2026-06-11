package com.schoolerp.controller;

import com.schoolerp.dto.request.TimetableRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Timetable;
import com.schoolerp.model.TimetableEntry;
import com.schoolerp.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/timetables")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping("/classes/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForClass(@PathVariable Long classId) {
        Optional<Timetable> ttOpt = timetableService.getByClassId(classId);
        if (ttOpt.isEmpty()) {
            // Return empty timetable structure
            Map<String, Object> empty = new HashMap<>();
            empty.put("days", Collections.emptyList());
            return ResponseEntity.ok(ApiResponse.ok(empty));
        }

        Timetable tt = ttOpt.get();

        // We don't expose entries via TimetableService interface, so we rebuild from entries by calling delete/upset logic?
        // Instead, we return a minimal structure by reusing controller logic:
        // If the timetable exists, we’ll call upsert with null? No.
        // So: cast to impl to access entriesByDay. (Keeps API surface minimal while we complete feature.)
        if (!(timetableService instanceof com.schoolerp.serviceImpl.TimetableServiceImpl impl)) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("days", Collections.emptyList());
            return ResponseEntity.ok(ApiResponse.ok(empty));
        }

        Map<String, List<TimetableEntry>> byDay = impl.entriesByDay(classId);

        List<Map<String, Object>> days = byDay.entrySet().stream()
            .map(e -> {
                String day = e.getKey();
                // periodIndex 0.. => P1..P6
                List<TimetableEntry> entries = e.getValue().stream()
                    .sorted(Comparator.comparingInt(TimetableEntry::getPeriodIndex))
                    .collect(Collectors.toList());

                List<String> periods = new ArrayList<>(6);
                for (int i = 0; i < 6; i++) periods.add("");

                for (TimetableEntry te : entries) {
                    int idx = te.getPeriodIndex() == null ? -1 : te.getPeriodIndex();
                    if (idx >= 0 && idx < 6) periods.set(idx, te.getSubject());
                }

                Map<String, Object> dayObj = new HashMap<>();
                dayObj.put("day", day);
                dayObj.put("periods", periods);
                return dayObj;
            })
            .collect(Collectors.toList());

        Map<String, Object> payload = new HashMap<>();
        payload.put("days", days);
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    @PostMapping("/classes/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Timetable>> create(@PathVariable Long classId,
                                                          @RequestBody(required = false) TimetableRequest req) {
        Timetable created = timetableService.upsertForClass(classId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Timetable created", created));
    }

    @PutMapping("/classes/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Timetable>> update(@PathVariable Long classId,
                                                          @RequestBody(required = false) TimetableRequest req) {
        Timetable updated = timetableService.upsertForClass(classId, req);
        return ResponseEntity.ok(ApiResponse.ok("Timetable updated", updated));
    }

    @DeleteMapping("/classes/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long classId) {
        timetableService.deleteByClassId(classId);
        return ResponseEntity.ok(ApiResponse.ok("Timetable deleted", null));
    }
}
