package com.schoolerp.controller;

import com.schoolerp.dto.request.EventRequest;
import com.schoolerp.dto.response.ApiResponse;
import com.schoolerp.model.Event;
import com.schoolerp.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/admin/events")
    public ResponseEntity<ApiResponse<List<Event>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAllEvents()));
    }

    @GetMapping("/admin/events/{id}")
    public ResponseEntity<ApiResponse<Event>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEventById(id)));
    }

    @PostMapping("/admin/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Event>> create(@Valid @RequestBody EventRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Event created", eventService.createEvent(req)));
    }

    @PutMapping("/admin/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Event>> update(@PathVariable Long id, @Valid @RequestBody EventRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Event updated", eventService.updateEvent(id, req)));
    }

    @DeleteMapping("/admin/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted", null));
    }

    @PutMapping("/admin/events/{id}/access")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Event>> updateAccess(@PathVariable Long id, @RequestBody Set<Long> teacherIds) {
        return ResponseEntity.ok(ApiResponse.ok("Access updated", eventService.updateEventAccess(id, teacherIds)));
    }

    @GetMapping("/teacher/events")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ApiResponse<List<Event>>> getTeacherEvents(@RequestParam Long teacherId) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEventsByTeacher(teacherId)));
    }
}
