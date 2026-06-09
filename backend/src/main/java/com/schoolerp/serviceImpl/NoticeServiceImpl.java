package com.schoolerp.serviceImpl;

import com.schoolerp.dto.request.NoticeRequest;
import com.schoolerp.exception.ResourceNotFoundException;
import com.schoolerp.model.Notice;
import com.schoolerp.repository.NoticeRepository;
import com.schoolerp.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {
    private final NoticeRepository noticeRepository;

    @Override public List<Notice> getAllNotices() { return noticeRepository.findAllByOrderByDateDesc(); }

    @Override
    public Notice createNotice(NoticeRequest req, String postedBy) {
        return noticeRepository.save(Notice.builder()
            .title(req.getTitle()).content(req.getContent()).priority(req.getPriority())
            .audience(req.getAudience()).category(req.getCategory())
            .postedBy(postedBy).date(LocalDate.now()).build());
    }

    @Override
    public Notice updateNotice(Long id, NoticeRequest req) {
        Notice n = noticeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notice not found: " + id));
        n.setTitle(req.getTitle()); n.setContent(req.getContent());
        n.setPriority(req.getPriority()); n.setAudience(req.getAudience()); n.setCategory(req.getCategory());
        return noticeRepository.save(n);
    }

    @Override
    public void deleteNotice(Long id) { noticeRepository.deleteById(id); }

    @Override
    public List<Notice> getNoticesForRole(String role) {
        // Backward compatibility: if no targeting fields are used, keep existing audience logic.
        // New targeting model requires client-side filtering for specific class/division, which is optional.
        if ("TEACHER".equals(role)) {
            return noticeRepository.findByAudienceInOrderByDateDesc(List.of("All","Teachers"));
        }
        if ("STUDENT".equals(role)) {
            return noticeRepository.findByAudienceInOrderByDateDesc(List.of("All","Students"));
        }
        return getAllNotices();
    }

}
