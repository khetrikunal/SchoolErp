# School ERP Admin Dashboard Fixes

## Priority 1: Exam Module Improvement
- [ ] Replace hardcoded class list in `frontend/src/pages/admin/Exams.jsx` with dynamic dropdown loaded from `GET /api/admin/classes`.
- [ ] Ensure newly created classes show immediately after class creation by relying on live API data (no static `utils/data.js` fallback for classes dropdown).
- [ ] Remove static class values in Exams form.

## Priority 2: Create Other Admin Accounts
- [ ] Add/verify backend API endpoint for creating admins (or extend existing service with controller) with RBAC (`ADMIN` only).
- [ ] Add request validation: email format + phone/mobile validation.
- [ ] Ensure passwords are hashed via existing `PasswordEncoder`.
- [ ] Prevent duplicate email accounts via repository existence check.
- [ ] Build frontend UI page under Admin Dashboard for Admin Management (responsive, loading states, validation messages).
- [ ] Wire frontend form to backend API with success/error toast messages.
- [ ] Add route + sidebar link (or embed section on existing dashboard) respecting role-based access.

## Verification
- [ ] Test: create class in Classes module, refresh/navigate to Exams module and confirm dropdown includes the new class.
- [ ] Test: main admin creates new admin, then login with created admin credentials.
- [ ] Test: duplicate email rejects with proper message.
- [ ] Test: non-admin cannot access admin-management endpoint/page.

