package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.EventRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Event;
import com.schoolerp.model.Teacher;
import com.schoolerp.repository.EventRepository;
import com.schoolerp.repository.TeacherRepository;
import com.schoolerp.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final TeacherRepository teacherRepository;

    @Override public List<Event> getAllEvents() { return eventRepository.findAll(); }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
    }

    @Override
    public Event createEvent(EventRequest req) {
        Event event = buildEvent(new Event(), req);
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, EventRequest req) {
        Event event = getEventById(id);
        buildEvent(event, req);
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    public Event updateEventAccess(Long eventId, Set<Long> teacherIds) {
        Event event = getEventById(eventId);
        Set<Teacher> teachers = teacherIds.stream()
            .map(tid -> teacherRepository.findById(tid).orElse(null))
            .filter(Objects::nonNull).collect(Collectors.toSet());
        event.setAssignedTeachers(teachers);
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getEventsByTeacher(Long teacherId) {
        return eventRepository.findByAssignedTeacherId(teacherId);
    }

    private Event buildEvent(Event ev, EventRequest req) {
        ev.setName(req.getName()); ev.setType(req.getType());
        ev.setDate(req.getDate()); ev.setTime(req.getTime());
        ev.setVenue(req.getVenue()); ev.setDescription(req.getDescription());
        ev.setBudget(req.getBudget()); ev.setStatus(req.getStatus());
        if (req.getAssignedTeacherIds() != null) {
            Set<Teacher> teachers = req.getAssignedTeacherIds().stream()
                .map(tid -> teacherRepository.findById(tid).orElse(null))
                .filter(Objects::nonNull).collect(Collectors.toSet());
            ev.setAssignedTeachers(teachers);
        }
        return ev;
    }
}
