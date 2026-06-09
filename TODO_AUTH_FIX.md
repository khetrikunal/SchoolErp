# TODO_AUTH_FIX

- [ ] Add backend request/body + auth debug logs around login + authentication failure/403 origin.
- [ ] Identify exact exception that triggers HTTP 403.
- [ ] Fix root cause in code.
- [ ] Verify: /api/auth/login permitted, JWT filter skips login, CSRF disabled, frontend payload fields match DTO, password encoder/auth manager works.

