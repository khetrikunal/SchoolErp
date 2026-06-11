package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.TimetableRequest;
import com.schoolerp.model.Timetable;
import com.schoolerp.model.TimetableEntry;
import com.schoolerp.model.Class;
import com.schoolerp.repository.ClassRepository;
import com.schoolerp.repository.TimetableEntryRepository;
import com.schoolerp.repository.TimetableRepository;
import com.schoolerp.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final TimetableEntryRepository timetableEntryRepository;
    private final ClassRepository classRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<Timetable> getByClassId(Long classId) {
        return timetableRepository.findByClassRef_Id(classId);
    }

    @Override
    @Transactional
    public Timetable upsertForClass(Long classId, TimetableRequest req) {
        // ensure class exists (no hardcoded class mappings)
        Class classRef = classRepository.findById(classId)
            .orElseThrow(() -> new NoSuchElementException("Class not found: " + classId));

        Timetable timetable = timetableRepository.findByClassRef_Id(classId).orElseGet(() ->
            Timetable.builder().classRef(classRef).build()
        );

        Timetable saved = timetableRepository.save(timetable);

        // Replace entries (simpler + robust for CRUD)
        timetableEntryRepository.deleteByTimetable_Id(saved.getId());

        List<TimetableEntry> entries = new ArrayList<>();
        if (req != null && req.getDays() != null) {
            for (TimetableRequest.TimetableDayRequest dayReq : req.getDays()) {
                if (dayReq == null) continue;
                String day = dayReq.getDay();
                List<String> periods = dayReq.getPeriods() == null ? Collections.emptyList() : dayReq.getPeriods();

                for (int i = 0; i < periods.size(); i++) {
                    String subject = periods.get(i);
                    if (subject == null) continue;
                    entries.add(TimetableEntry.builder()
                        .timetable(saved)
                        .day(day)
                        .periodIndex(i)
                        .subject(subject)
                        .build());
                }
            }
        }

        if (!entries.isEmpty()) {
            timetableEntryRepository.saveAll(entries);
        }

        return saved;
    }

    @Override
    @Transactional
    public void deleteByClassId(Long classId) {
        Optional<Timetable> ttOpt = timetableRepository.findByClassRef_Id(classId);
        if (ttOpt.isEmpty()) return;

        Timetable tt = ttOpt.get();
        timetableEntryRepository.deleteByTimetable_Id(tt.getId());
        timetableRepository.delete(tt);
    }

    // Utility (used by controller)
    @Transactional(readOnly = true)
    public Map<String, List<TimetableEntry>> entriesByDay(Long classId) {
        Timetable tt = timetableRepository.findByClassRef_Id(classId)
            .orElseThrow(() -> new NoSuchElementException("Timetable not found for classId: " + classId));

        List<TimetableEntry> entries = timetableEntryRepository.findByTimetable_Id(tt.getId());
        return entries.stream().collect(Collectors.groupingBy(TimetableEntry::getDay));
    }
}
