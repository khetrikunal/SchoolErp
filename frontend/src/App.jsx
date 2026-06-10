import { Routes, Route, Navigate } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import Unauthorized from './pages/Unauthorized'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminClasses from './pages/admin/Classes'
import AdminAttendance from './pages/admin/Attendance'
import AdminTimetable from './pages/admin/Timetable'
import AdminExams from './pages/admin/Exams'
import AdminEvents from './pages/admin/Events'
import AdminQuotations from './pages/admin/Quotations'
import AdminNotices from './pages/admin/Notices'
import AdminReports from './pages/admin/Reports'

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherHomework from './pages/teacher/Homework'
import TeacherResults from './pages/teacher/Results'
import TeacherEvents from './pages/teacher/Events'
import TeacherQuotations from './pages/teacher/Quotations'
import TeacherNotices from './pages/teacher/Notices'

// Student
import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentTimetable from './pages/student/Timetable'
import StudentHomework from './pages/student/Homework'
import StudentResults from './pages/student/Results'
import StudentNotices from './pages/student/Notices'
import StudentProfile from './pages/student/Profile'

function Protected({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to="/unauthorized" replace />
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{ style: { borderRadius: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' } }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin */}
          <Route path="/admin" element={<Protected role="ADMIN"><AdminDashboard /></Protected>} />
          <Route path="/admin/students" element={<Protected role="ADMIN"><AdminStudents /></Protected>} />
          <Route path="/admin/teachers" element={<Protected role="ADMIN"><AdminTeachers /></Protected>} />
          <Route path="/admin/classes" element={<Protected role="ADMIN"><AdminClasses /></Protected>} />
          <Route path="/admin/attendance" element={<Protected role="ADMIN"><AdminAttendance /></Protected>} />
          <Route path="/admin/timetable" element={<Protected role="ADMIN"><AdminTimetable /></Protected>} />
          <Route path="/admin/exams" element={<Protected role="ADMIN"><AdminExams /></Protected>} />
          <Route path="/admin/events" element={<Protected role="ADMIN"><AdminEvents /></Protected>} />
          <Route path="/admin/quotations" element={<Protected role="ADMIN"><AdminQuotations /></Protected>} />
          <Route path="/admin/notices" element={<Protected role="ADMIN"><AdminNotices /></Protected>} />
          <Route path="/admin/reports" element={<Protected role="ADMIN"><AdminReports /></Protected>} />

          {/* Teacher */}
          <Route path="/teacher" element={<Protected role="TEACHER"><TeacherDashboard /></Protected>} />
          <Route path="/teacher/attendance" element={<Protected role="TEACHER"><TeacherAttendance /></Protected>} />
          <Route path="/teacher/homework" element={<Protected role="TEACHER"><TeacherHomework /></Protected>} />
          <Route path="/teacher/results" element={<Protected role="TEACHER"><TeacherResults /></Protected>} />
          <Route path="/teacher/events" element={<Protected role="TEACHER"><TeacherEvents /></Protected>} />
          <Route path="/teacher/quotations" element={<Protected role="TEACHER"><TeacherQuotations /></Protected>} />
          <Route path="/teacher/notices" element={<Protected role="TEACHER"><TeacherNotices /></Protected>} />

          {/* Student */}
          <Route path="/student" element={<Protected role="STUDENT"><StudentDashboard /></Protected>} />
          <Route path="/student/attendance" element={<Protected role="STUDENT"><StudentAttendance /></Protected>} />
          <Route path="/student/timetable" element={<Protected role="STUDENT"><StudentTimetable /></Protected>} />
          <Route path="/student/homework" element={<Protected role="STUDENT"><StudentHomework /></Protected>} />
          <Route path="/student/results" element={<Protected role="STUDENT"><StudentResults /></Protected>} />
          <Route path="/student/notices" element={<Protected role="STUDENT"><StudentNotices /></Protected>} />
          <Route path="/student/profile" element={<Protected role="STUDENT"><StudentProfile /></Protected>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

