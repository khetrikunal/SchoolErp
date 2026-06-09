# TODO - Phase 1 (Backend Foundation Upgrade Only)

## 0. Codebase inspection & safety notes
- [x] Inspect current entities/controllers/services/repositories for Student/Teacher/Notice and DataInitializer/CORS.
- [x] Identify compatibility constraints for existing DTOs and APIs.

## 1. Class Management System
- [ ] Create `Class` entity with required fields + validation.
- [ ] Create `ClassRepository`.
- [ ] Create `ClassService` + `ClassServiceImpl`.
- [ ] Create `ClassController` with CRUD under `/api/admin/classes`.
- [ ] Add `ClassRequest` DTO (if controller pattern uses DTOs).

## 2. Student Entity Upgrade
- [x] Extend `Student` entity with optional fields.
- [x] Add `studentId` with `STD001` generation for new records.
- [x] Update `StudentRequest` DTO to include optional new fields.
- [x] Update `StudentServiceImpl` to generate `studentId` and keep old fields behavior.


## 3. Teacher Entity Upgrade
- [x] Extend `Teacher` entity with optional fields.
- [x] Add `teacherId` generation `TCH001` for new records.
- [x] Update `TeacherRequest` DTO with optional new fields.
- [x] Update `TeacherServiceImpl` to generate `teacherId` while keeping `empId` intact.


## 4. Notice System Upgrade
- [x] Extend `Notice` entity with optional targeting fields.
- [x] Update `NoticeRequest` DTO with optional targeting fields.
- [x] Update `NoticeServiceImpl` targeting logic with fallback to existing audience logic.
- [ ] Update `NoticeController` to pass-through new request fields (without breaking old behavior).


## 5. DataInitializer
- [x] Remove ONLY demo teacher + demo student seeds.
- [x] Keep admin seed.


## 6. Fix CORS
- [x] Update `SecurityConfig` CORS origins to include `http://localhost:5173`.


## 7. Verification
- [ ] Run backend compile/tests.

- [ ] List modified files.
- [ ] Document database changes and migration risks.

