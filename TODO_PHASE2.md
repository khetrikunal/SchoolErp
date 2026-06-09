# TODO - Phase 2 (Authentication & User Account System)

## Current status
- [x] Support identifier-based login request (`identifier` + `password`) while keeping `email` backward compatible
- [x] Add identifier resolver with priority: email -> teacherId -> studentId
- [x] Update AuthServiceImpl to authenticate using resolved email (JWT generation unchanged)
- [x] Extend repositories to find teacher/student by their IDs

## Remaining tasks (Phase 2)
- [ ] Update TeacherRequest to include `password` + `confirmPassword`
- [ ] Update StudentRequest to include `password` + `confirmPassword`
- [ ] Modify TeacherServiceImpl.createTeacher():
  - [ ] validate password == confirmPassword
  - [ ] create User with TEACHER role
  - [ ] hash password via BCryptPasswordEncoder
  - [ ] link Teacher.user = created User
- [ ] Modify StudentServiceImpl.createStudent():
  - [ ] validate password == confirmPassword
  - [ ] create User with STUDENT role
  - [ ] hash password
  - [ ] link Student.user = created User
- [ ] Ensure updateTeacher/updateStudent keeps backward compatibility (optional password changes only if provided)
- [ ] Compile verification (attempt Maven build)

## Manual test cases
- [ ] Admin login using email works
- [ ] Teacher login using email works
- [ ] Teacher login using TCH### works
- [ ] Student login using email works
- [ ] Student login using STD### works

