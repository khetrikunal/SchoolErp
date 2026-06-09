package com.schoolerp.service;
import com.schoolerp.dto.request.NoticeRequest;
import com.schoolerp.model.Notice;
import java.util.List;
public interface NoticeService {
    List<Notice> getAllNotices();
    Notice createNotice(NoticeRequest request, String postedBy);
    Notice updateNotice(Long id, NoticeRequest request);
    void deleteNotice(Long id);
    List<Notice> getNoticesForRole(String role);
}
