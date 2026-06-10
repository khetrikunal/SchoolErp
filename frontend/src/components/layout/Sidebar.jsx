import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard,Users,GraduationCap,BookOpen,Calendar,ClipboardList,Bell,Trophy,FileText,BarChart3,UserCheck,School,Megaphone,LogOut,ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'

const NAV = {
  ADMIN:[
    {label:'Dashboard',    icon:LayoutDashboard, to:'/admin'},
    {label:'Students',     icon:GraduationCap,   to:'/admin/students'},
    {label:'Teachers',     icon:Users,            to:'/admin/teachers'},
    {label:'Classes',      icon:School,           to:'/admin/classes'},
    {label:'Attendance',   icon:UserCheck,        to:'/admin/attendance'},
    {label:'Timetable',    icon:Calendar,         to:'/admin/timetable'},
    {label:'Exams',        icon:ClipboardList,    to:'/admin/exams'},
    {label:'Events',       icon:Trophy,           to:'/admin/events'},
    {label:'Quotations',   icon:FileText,         to:'/admin/quotations'},
    {label:'Notice Board', icon:Megaphone,        to:'/admin/notices'},
    {label:'Reports',      icon:BarChart3,        to:'/admin/reports'},
  ],
  TEACHER:[
    {label:'Dashboard',    icon:LayoutDashboard, to:'/teacher'},
    {label:'Attendance',   icon:UserCheck,       to:'/teacher/attendance'},
    {label:'Notice Board', icon:Megaphone,       to:'/teacher/notices'},
    {label:'Profile',      icon:Users,          to:'/teacher/notices'},
  ],


    STUDENT:[
    {label:'Dashboard',    icon:LayoutDashboard, to:'/student'},
    {label:'Attendance',   icon:UserCheck,       to:'/student/attendance'},
    {label:'Notice Board', icon:Megaphone,       to:'/student/notices'},
    {label:'My Profile',   icon:Users,           to:'/student/profile'},
  ],

}

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const role = user?.role
  let nav = NAV[role] || []

  // Extra safety: filter to known routes per role
  const allowedByRole = {
    ADMIN: new Set(['/admin','/admin/students','/admin/teachers','/admin/classes','/admin/attendance','/admin/timetable','/admin/exams','/admin/events','/admin/quotations','/admin/notices','/admin/reports']),
    TEACHER: new Set(['/teacher','/teacher/attendance','/teacher/homework','/teacher/results','/teacher/events','/teacher/quotations','/teacher/notices']),
    STUDENT: new Set(['/student','/student/attendance','/student/timetable','/student/homework','/student/results','/student/notices','/student/profile']),
  }

  const allowed = allowedByRole[role]
  if (allowed) nav = nav.filter((i) => allowed.has(i.to))


  const go = to => { navigate(to); onClose?.() }
  const isActive = (to) => (to === '/admin' || to === '/teacher' || to === '/student' ? pathname === to : pathname.startsWith(to))


  return (
    <aside className="flex flex-col h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <School size={16} className="text-white"/>
          </div>
          <span className="font-display font-bold text-gray-900 dark:text-white text-lg leading-none">
            EduManage<span className="text-primary-600"> Pro</span>
          </span>
        </div>
      </div>
      {/* User card */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Avatar name={user?.name} size="md"/>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {nav.map(({label,icon:Icon,to}) => {
          const active = isActive(to)
          return (
            <button key={to} onClick={()=>go(to)} className={`sidebar-link ${active?'sidebar-active':'sidebar-inactive'}`}>
              <Icon size={17} className="flex-shrink-0"/>
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-60"/>}
            </button>
          )
        })}
      </nav>
      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button onClick={toggle} className="sidebar-link sidebar-inactive">
          <span className="text-base leading-none">{dark?'☀️':'🌙'}</span>
          <span>{dark?'Light Mode':'Dark Mode'}</span>
        </button>
        <button onClick={logout} className="sidebar-link text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          <LogOut size={17}/>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
