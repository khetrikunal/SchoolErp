package com.schoolerp.service;

import com.schoolerp.dto.request.TimetableRequest;
import com.schoolerp.model.Timetable;

import java.util.Optional;

public interface TimetableService {

    Optional<Timetable> getByClassId(Long classId);

    Timetable upsertForClass(Long classId, TimetableRequest req);

    void deleteByClassId(Long classId);

}
