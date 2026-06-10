import { useAuth } from '../../context/AuthContext'
import { notices, exams, homework, timetable, attendanceSummary } from '../../utils/data'
import { StatusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { UserCheck, BookOpen, ClipboardList, Bell } from 'lucide-react'
import { fmt } from '../../utils/helpers'

export default function StudentDashboard() {
  const { user } = useAuth()
  const myClass = user?.class || '10-A'
  const myAttendance = attendanceSummary.find(s => s.studentId === user?.id) || { percentage: 93.3, present: 112, absent: 5, late: 3, totalDays: 120 }
  const myNotices = notices.filter(n => n.audience === 'All' || n.audience === 'Students').slice(0, 4)
  const myHomework = homework.filter(h => h.class === myClass)
  const myExams = exams.filter(e => e.class === myClass)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{today} · Class {myClass}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={UserCheck} label="Attendance" value={`${myAttendance.percentage}%`} sub={`${myAttendance.present} present / ${myAttendance.absent} absent`} color="emerald" />
        <StatCard icon={BookOpen} label="Pending Homework" value={myHomework.length} sub="Assignments due" color="amber" />
        <StatCard icon={ClipboardList} label="Upcoming Exams" value={myExams.filter(e => e.status === 'Upcoming').length} sub="Scheduled exams" color="primary" />
        <StatCard icon={Bell} label="New Notices" value={myNotices.length} sub="Unread notices" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Attendance Overview</h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray={`${myAttendance.percentage}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-display font-bold text-gray-800 dark:text-gray-200">{myAttendance.percentage}%</span>
              </div>
            </div>
            <div className="space-y-1">
              {[['Present', myAttendance.present, 'text-emerald-600'], ['Absent', myAttendance.absent, 'text-red-500'], ['Late', myAttendance.late, 'text-amber-500']].map(([k, v, c]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">{k}</span>
                  <span className={`font-bold ${c}`}>{v}</span>
                  <span className="text-xs text-gray-400">/ {myAttendance.totalDays} days</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Upcoming Exams</h2>
          <div className="space-y-2">
            {myExams.length === 0
              ? <p className="text-sm text-gray-400 text-center py-4">No upcoming exams</p>
              : myExams.map(ex => (
                <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-primary-600 leading-none">{new Date(ex.date).getDate()}</p>
                    <p className="text-[9px] text-primary-400 uppercase">{new Date(ex.date).toLocaleString('en', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ex.subject}</p>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={ex.status} />
                      <span className="text-xs text-gray-400">{ex.duration} · Max: {ex.maxMarks}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Homework Due</h2>
          <div className="space-y-2">
            {myHomework.length === 0
              ? <p className="text-sm text-gray-400 text-center py-4">No pending homework</p>
              : myHomework.map(hw => (
                <div key={hw.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge badge-primary">{hw.subject}</span>
                    <span className="text-xs text-gray-400">Due: {fmt(hw.dueDate)}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{hw.title}</p>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Latest Notices</h2>
          <div className="space-y-2">
            {myNotices.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 mb-0.5">
                  <StatusBadge status={n.priority} />
                  <span className="text-xs text-gray-400">{fmt(n.date)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
