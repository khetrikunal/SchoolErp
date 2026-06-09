# TODO - School ERP Admin upgrade (end-to-end)

## FEATURE 1 — Timetable management
- [ ] Inspect existing admin timetable UI + timetable backend readiness (Timetable.jsx, student/teacher Timetable pages)
- [ ] Add backend entities: Timetable, Subject (reuse existing Class)
- [ ] Add repositories
- [ ] Add services with visibility rules: 
  - [ ] Student sees only their class timetable
  - [ ] Teacher sees only assigned classes timetable
- [ ] Add controllers + DTOs + validation
- [ ] Add admin CRUD APIs for timetable
- [ ] Wire frontend API clients
- [ ] Implement/upgrade admin timetable dashboard pages (Create Class, Manage Classes, Create/Edit Timetable, Timetable List)
- [ ] Implement/upgrade student “My Timetable” page to call student timetable API
- [ ] Implement/upgrade teacher “Assigned Timetable” page to call teacher timetable API

## FEATURE 2 — Exam management by class
- [ ] Add backend Exam entity + DTOs + service + repo
- [ ] Create admin CRUD exam APIs under /api/admin/exams
- [ ] Create student/teacher filtered exam APIs
- [ ] Upgrade frontend admin Exams.jsx
- [ ] Upgrade frontend student My Exams
- [ ] Upgrade frontend teacher Class Exams

## FEATURE 3 — Registration ID login system
- [ ] Add sequential unique registrationId auto-generation when creating students
- [ ] Store sequential id in Student.studentId
- [ ] Update authentication resolver to accept identifier (email OR registrationId)
- [ ] Ensure JWT flow remains stable
- [ ] Verify frontend login placeholder works end-to-end

## FEATURE 4 — Student profile image + documents
- [ ] Add StudentDocument entity
- [ ] Implement secure upload endpoint (validation + size limit + multi upload)
- [ ] Store returned URLs
- [ ] Update student profile API response
- [ ] Update frontend student profile UI + admin upload forms

## FEATURE 5 — Teacher profile image + documents
- [ ] Add TeacherDocument entity
- [ ] Implement teacher document upload endpoint + validation
- [ ] Update teacher profile/display endpoints
- [ ] Update frontend teacher forms/UI

## FEATURE 7 — Admin creates another admin (role + uploads)
- [ ] Implement admin create-user APIs for ADMIN/TEACHER/STUDENT
- [ ] Guard route so only ADMIN can create another ADMIN
- [ ] Implement role mapping + file upload
- [ ] Update frontend admin management UI (create admin form)

## FEATURE 6 — Class Teacher Assignment (OPTIONAL)
- [ ] Add optional field `assignedClassId` while creating Teacher
- [ ] Update backend DB/migration for Teacher↔Class relation (reuse existing Class entity)

- [ ] Add relation between Teacher and existing Class entity
- [ ] Validate to prevent duplicate class teacher assignment (one class → one class teacher)
- [ ] Update DTOs/services/repositories/APIs for assignment
- [ ] Frontend: Admin → Create Teacher form dropdown “Assigned Class Teacher”
- [ ] Teacher Dashboard: show “My Assigned Class”
- [ ] Integrate visibility into timetable/exam/attendance modules (as future modules depend on assignment)


## Verification
- [ ] Backend build + run
- [ ] Frontend build + run
- [ ] Manual API testing with example payloads
- [ ] Confirm end-to-end login + role-based access
