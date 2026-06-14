import { useState, useEffect } from 'react'
import { BookOpen, Users, Trophy, Bell, Calendar, ClipboardList } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notices, events, exams, attendanceSummary } from '../../utils/data'
import { StatusBadge } from '../../components/ui/Badge'
import { apiGet } from '../../services/api/apiClient'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { fmt } from '../../utils/helpers'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const myClasses = user?.classes || []
  const myEvents = events.filter(e => (e.assignedTeacherIds || []).includes(user?.id))
  const myNotices = notices.filter(n => n.audience === 'All' || n.audience === 'Teachers').slice(0, 4)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const [homeworkData, setHomeworkData] = useState([])
  const [hwLoading, setHwLoading] = useState(true)

  useEffect(() => {
    const fetchHw = async () => {
      try {
        const res = await apiGet('/api/homework')
        setHomeworkData(Array.isArray(res) ? res : res?.data || [])
      } catch (err) {
        console.error('Dashboard homework load failed', err)
      } finally {
        setHwLoading(false)
      }
    }
    fetchHw()
  }, [])

  const classesText = myClasses.length > 0 ? myClasses.join(', ') : 'No assigned classes'

  return (
    <div className="space-y-6">
      {/* Premium Welcome Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-primary-500/10">
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Teacher Portal</span>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-2">Welcome Back, {user?.name || 'Teacher'}!</h1>
          <p className="text-primary-100 text-sm mt-1">Here is what is happening at your school today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl self-start md:self-auto">
          <Calendar size={18} className="text-primary-200" />
          <span className="text-sm font-semibold whitespace-nowrap">{today}</span>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Classes" value={myClasses.length} sub={classesText} color="primary" />
        <StatCard icon={BookOpen} label="Active Homework" value={hwLoading ? '...' : homeworkData.length} sub="Pending submissions" color="emerald" />
        <StatCard icon={Trophy} label="My Events" value={myEvents.length} sub="Assigned school events" color="amber" />
        <StatCard icon={ClipboardList} label="Upcoming Exams" value={exams.filter(e => e.status === 'Upcoming' && myClasses.includes(e.class)).length} sub="Scheduled exams" color="purple" />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={17} className="text-amber-500" />
              <h2 className="font-display font-bold text-gray-800 dark:text-white">My Assigned Events</h2>
            </div>
            {myEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No events assigned to you yet.</p>
            ) : (
              <div className="space-y-3">
                {myEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex flex-col items-center justify-center text-center flex-shrink-0">
                      <p className="text-xs font-bold text-amber-600 leading-none">{new Date(ev.date).getDate()}</p>
                      <p className="text-[9px] text-amber-500 uppercase">{new Date(ev.date).toLocaleString('en', { month: 'short' })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{ev.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StatusBadge status={ev.status} />
                        <span className="text-xs text-gray-400">{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={17} className="text-primary-500" />
              <h2 className="font-display font-bold text-gray-800 dark:text-white">Notices</h2>
            </div>
            <div className="space-y-3">
              {myNotices.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={n.priority} />
                    <span className="text-[10px] text-gray-400">{fmt(n.date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={17} className="text-emerald-500" />
              <h2 className="font-display font-bold text-gray-800 dark:text-white">Recent Homework</h2>
            </div>
            {hwLoading ? (
              <p className="text-sm text-gray-400 text-center py-12">Loading homework...</p>
            ) : homeworkData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No homework assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {homeworkData.slice(0, 4).map(hw => (
                  <div key={hw.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{hw.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="badge badge-info">{hw.subject}</span>
                      <span>{hw.className || hw.class}</span>
                      <span>Due: {fmt(hw.dueDate)}</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${((hw.submissions || 0) / (hw.totalStudents || 32)) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{hw.submissions || 0}/{hw.totalStudents || 32} submitted</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={17} className="text-blue-500" />
              <h2 className="font-display font-bold text-gray-800 dark:text-white">Class Attendance Summary</h2>
            </div>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No class attendance logs available.</p>
            ) : (
              <div className="space-y-3.5">
                {attendanceSummary.filter(s => myClasses.includes(s.class)).slice(0, 5).map(s => (
                  <div key={s.studentId} className="flex items-center gap-3">
                    <span className="text-sm flex-1 text-gray-700 dark:text-gray-300 truncate">{s.name}</span>
                    <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${s.percentage}%` }} />
                    </div>
                    <span className={`text-xs font-bold w-12 text-right flex-shrink-0 ${s.percentage >= 90 ? 'text-emerald-600' : s.percentage >= 75 ? 'text-amber-600' : 'text-red-500'}`}>{s.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
