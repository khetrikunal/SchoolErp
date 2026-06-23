import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  GraduationCap, Eye, EyeOff, Loader2, Users,
  ShieldCheck, UserSquare2, ArrowLeft, School,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function getRoleFromQuery(search) {
  const sp = new URLSearchParams(search)
  return String(sp.get('role') || '').toLowerCase()
}

const roleMeta = {
  admin: {
    label: 'Admin & Staff',
    hint: 'Use your admin credentials or staff email.',
    icon: ShieldCheck,
    accentBg: 'bg-admin',
  },
  teacher: {
    label: 'Educator',
    hint: 'Use your teacher credentials.',
    icon: Users,
    accentBg: 'bg-teacher',
  },
  parent_student: {
    label: 'Family & Student',
    hint: 'Use your parent/student credentials.',
    icon: UserSquare2,
    accentBg: 'bg-student',
  },
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = useMemo(() => getRoleFromQuery(location.search), [location.search])
  const meta = roleMeta[role] || { label: 'Sign In', hint: 'Enter your credentials to continue.', icon: School, accentBg: 'bg-primary-600' }
  const Icon = meta.icon

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      const r = String(user.role || '').toUpperCase()
      if (r === 'ADMIN') navigate('/admin')
      else if (r === 'TEACHER') navigate('/teacher')
      else if (r === 'STUDENT') navigate('/student')
    }
  }, [user, navigate])

  const validate = () => {
    const e = {}
    if (!form.identifier) e.identifier = 'Identifier is required'
    else if (form.identifier.trim().length < 3) e.identifier = 'Identifier is too short'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const res = await login(form.identifier, form.password)
      const name = res?.name || res?.user?.name || 'User'
      toast.success(`Welcome, ${String(name).split(' ')[0]}!`)
      
      // Determine redirection target based on actual role from response
      const serverRole = res?.role || res?.user?.role || ''
      const upperRole = String(serverRole).toUpperCase()
      
      let target = '/login'
      if (upperRole === 'ADMIN') {
        target = '/admin'
      } else if (upperRole === 'TEACHER') {
        target = '/teacher'
      } else if (upperRole === 'STUDENT') {
        target = '/student'
      } else {
        // Fallback to query-parameter role targets
        const targets = { admin: '/admin', teacher: '/teacher', parent_student: '/student' }
        target = targets[role] || '/login'
      }
      
      navigate(target)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-student/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-primary-300 hover:text-white text-sm mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div className={`${meta.accentBg} px-8 py-7 text-white text-center`}>
            <div className="inline-flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mb-3">
              <Icon size={30} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl">Academia Connect</h1>
            <p className="text-white/80 text-sm mt-1">Sign in as: <span className="font-bold text-white">{meta.label}</span></p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <p className="text-xs text-gray-500 text-center mb-6">{meta.hint}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-identifier" className="label">Identifier</label>
                <input
                  id="login-identifier"
                  className={`input ${errors.identifier ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="text"
                  placeholder="Enter Email or Registration ID"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                />
                {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>}
              </div>


              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    className={`input pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={show ? 'Hide password' : 'Show password'}>
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className={`btn-primary w-full py-3 text-sm mt-2`}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                  : 'Sign In'
                }
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Not your role?{' '}
              <button onClick={() => navigate('/')} className="text-primary-600 font-semibold hover:underline cursor-pointer">
                Choose a different portal
              </button>
            </p>
          </div>
        </div>

        {/* Logo at bottom */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-white/60 text-sm font-medium">Academia Connect</span>
        </div>
      </div>
    </div>
  )
}
