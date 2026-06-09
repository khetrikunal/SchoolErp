# 🏫 EduManage Pro — School ERP System

Full-stack School Management System with role-based access control.

## 🔐 Demo Login Credentials

| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | admin@school.edu     | Admin@123    |
| Teacher | teacher@school.edu   | Teacher@123  |
| Student | student@school.edu   | Student@123  |

---

## 🚀 Quick Start

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Backend (Spring Boot)

**Prerequisites:**
- Java 21
- Maven
- PostgreSQL running on localhost:5432

**Setup Database:**
```sql
CREATE DATABASE school_erp;
```

**Run:**
```bash
cd backend
mvn spring-boot:run
# API runs at http://localhost:8080
```

> The backend auto-seeds the 3 demo login users on first run.

---

## 📁 Project Structure

```
school-erp/
├── frontend/                    # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── ui/              # Reusable UI components
│       │   └── layout/          # Sidebar, AppLayout
│       ├── context/             # Auth & Theme context
│       ├── pages/
│       │   ├── admin/           # 11 admin pages
│       │   ├── teacher/         # 7 teacher pages
│       │   └── student/         # 7 student pages
│       └── utils/
│           ├── data.js          # Application data
│           └── helpers.js       # Utility functions
│
└── backend/                     # Spring Boot + PostgreSQL
    └── src/main/java/com/schoolerp/
        ├── controller/          # REST API endpoints
        ├── service/             # Service interfaces
        ├── serviceImpl/         # Service implementations
        ├── repository/          # JPA repositories
        ├── model/               # JPA entities
        ├── dto/                 # Request/Response DTOs
        ├── security/jwt/        # JWT auth filter & utils
        └── config/              # Security, CORS, DataInitializer
```

---

## ✨ Features

### Admin Panel
- Dashboard with charts and analytics
- Full CRUD: Students, Teachers, Classes
- Event Management with **per-teacher access control**
- Quotation approval workflow (Approve / Reject)
- Attendance monitoring
- Exam & Results management
- Notice Board
- Reports & Analytics

### Teacher Panel
- View only assigned events (access controlled by Admin)
- Mark & edit student attendance
- Create homework assignments
- Add student marks/results
- Submit event quotations with line items → sent to Admin
- View notices

### Student Panel
- Attendance overview with percentage
- Class timetable
- Homework list & submission
- Exam results with grades
- Notice board
- Profile page

---

## 🔌 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/login | Public |
| GET/POST/PUT/DELETE | /api/admin/students | ADMIN |
| GET/POST/PUT/DELETE | /api/admin/teachers | ADMIN |
| GET/POST/PUT/DELETE | /api/admin/events | ADMIN |
| PUT | /api/admin/events/{id}/access | ADMIN |
| GET/PUT | /api/admin/quotations | ADMIN |
| GET/POST/DELETE | /api/admin/notices | ADMIN |
| POST | /api/teacher/attendance | TEACHER |
| GET/POST | /api/teacher/quotations | TEACHER |
| GET | /api/teacher/events | TEACHER |
| GET | /api/student/attendance/{id} | STUDENT |
| GET | /api/student/notices | STUDENT |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Spring Boot 3.2, Java 21 |
| Security | Spring Security + JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Build | Maven |
