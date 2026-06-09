package com.schoolerp.service;
import com.schoolerp.dto.request.EventRequest;
import com.schoolerp.model.Event;
import java.util.List;
import java.util.Set;
public interface EventService {
    List<Event> getAllEvents();
    Event getEventById(Long id);
    Event createEvent(EventRequest request);
    Event updateEvent(Long id, EventRequest request);
    void deleteEvent(Long id);
    Event updateEventAccess(Long eventId, Set<Long> teacherIds);
    List<Event> getEventsByTeacher(Long teacherId);
}
