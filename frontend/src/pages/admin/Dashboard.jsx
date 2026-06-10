import { useEffect, useMemo, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GraduationCap, Users, School, UserCheck, Trophy, Bell } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { classService } from '../../services/api/classService'
import { statsService } from '../../services/api/statsService'
import toast from 'react-hot-toast'
import { fmt } from '../../utils/helpers'

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b']

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await statsService.getAdminStats()
        if (cancelled) return
        setStats(res ?? {})
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || 'Failed to load dashboard stats'
        setError(msg)
        toast.error(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const safeNum = (v, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)
  const safeStr = (v, fallback = '') => (v === null || v === undefined ? fallback : String(v))

  const totalStudents = safeNum(stats?.totalStudents, 0)
  const totalTeachers = safeNum(stats?.totalTeachers, 0)
  const totalClasses = safeNum(stats?.totalClasses, 0)

  const avgAttendanceLabel = useMemo(() => {
    const v = stats?.avgAttendance
    if (typeof v === 'number' && Number.isFinite(v)) return `${v}%`
    if (typeof v === 'string' && v.trim()) return v
    return '0%'
  }, [stats])

  const chartAttendance = useMemo(() => {
    const arr = stats?.chartAttendance
    return Array.isArray(arr) && arr.length ? arr : [{ month: 'N/A', present: 0 }]
  }, [stats])

  const chartEnrollment = useMemo(() => {
    const arr = stats?.chartEnrollment
    return Array.isArray(arr) && arr.length
      ? arr
      : [
          { grade: 'N/A', students: 0 },
          { grade: 'N/A', students: 0 },
          { grade: 'N/A', students: 0 },
        ]
  }, [stats])

  const chartPerformance = useMemo(() => {
    const arr = stats?.chartPerformance
    return Array.isArray(arr) && arr.length ? arr : [{ subject: 'N/A', avg: 0 }]
  }, [stats])

  const recentNotices = useMemo(() => {
    const arr = stats?.recentNotices
    return Array.isArray(arr) ? arr : []
  }, [stats])

  const upcomingEvents = useMemo(() => {
    const arr = stats?.upcomingEvents
    return Array.isArray(arr) ? arr : []
  }, [stats])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Loading...</p>
          </div>
          <span className="badge badge-success self-start">● System Online</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} label="Total Students" value={0} sub="" color="primary" />
          <StatCard icon={Users} label="Total Teachers" value={0} sub="" color="emerald" />
          <StatCard icon={School} label="Total Classes" value={0} sub="" color="amber" />
          <StatCard icon={UserCheck} label="Avg Attendance" value={'0%'} sub="" color="blue" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{error}</p>
          </div>
          <span className="badge badge-success self-start">● System Online</span>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">Dashboard data could not be loaded.</p>
        </div>
      </div>
    )
  }

  if (!stats || typeof stats !== 'object') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">No dashboard data available.</p>
          </div>
          <span className="badge badge-success self-start">● System Online</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Academic Year 2023–24 · {fmt(new Date())}</p>
        </div>
        <span className="badge badge-success self-start">● System Online</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          value={totalStudents}
          sub=""
          color="primary"
        />
        <StatCard
          icon={Users}
          label="Total Teachers"
          value={totalTeachers}
          sub=""
          color="emerald"
        />
        <StatCard
          icon={School}
          label="Total Classes"
          value={totalClasses}
          sub=""
          color="amber"
        />
        <StatCard
          icon={UserCheck}
          label="Avg Attendance"
          value={avgAttendanceLabel}
          sub=""
          color="blue"
        />
      </div>

      {/* Attendance + Enrollment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800 dark:text-white">Monthly Attendance</h2>
            <span className="badge badge-success text-xs">↑ 2.3% vs last month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartAttendance}>
              <defs>
                <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{fontSize:12,fill:'#9ca3af'}}/>
              <YAxis tick={{fontSize:12,fill:'#9ca3af'}}/>
              <Tooltip contentStyle={{borderRadius:12,border:'none',boxShadow:'0 4px 16px rgba(0,0,0,.1)'}}/>
              <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={2.5} fill="url(#gPresent)" name="Present %"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Enrollment</h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={chartEnrollment} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="students" paddingAngle={3}>
                {chartEnrollment.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {chartEnrollment.map((d,i)=>(
              <div key={d.grade} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{background:PIE_COLORS[i]}}/>
                  <span className="text-gray-600 dark:text-gray-400">{d.grade}</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">{d.students}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance */}
      <Card>
        <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Subject Performance — Class Average</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartPerformance} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
            <XAxis dataKey="subject" tick={{fontSize:12,fill:'#9ca3af'}}/>
            <YAxis domain={[0,100]} tick={{fontSize:12,fill:'#9ca3af'}}/>
            <Tooltip contentStyle={{borderRadius:12,border:'none',boxShadow:'0 4px 16px rgba(0,0,0,.1)'}}/>
            <Bar dataKey="avg" fill="#6366f1" radius={[6,6,0,0]} name="Average %"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Notices + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={17} className="text-primary-500"/>
            <h2 className="font-display font-bold text-gray-800 dark:text-white">Recent Notices</h2>
          </div>
          <div className="space-y-2">
            {(recentNotices || []).slice(0, 4).map((n) => (


              <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <Bell size={13} className="text-primary-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{n.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={n.priority}/>
                    <span className="text-xs text-gray-400">{fmt(n.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={17} className="text-amber-500"/>
            <h2 className="font-display font-bold text-gray-800 dark:text-white">Upcoming Events</h2>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((ev) => (

              <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 text-center">
                  <p className="text-xs font-bold text-amber-600 leading-none">{new Date(ev.date).getDate()}</p>
                  <p className="text-[9px] text-amber-400 uppercase">{new Date(ev.date).toLocaleString('en',{month:'short'})}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{ev.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={ev.status}/>
                    <span className="text-xs text-gray-400">{ev.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
