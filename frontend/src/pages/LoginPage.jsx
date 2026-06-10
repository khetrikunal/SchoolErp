import { useMemo, useState } from 'react'
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
    gradient: 'from-blue-600 to-blue-800',
    light: 'bg-blue-50 text-blue-600',
  },
  teacher: {
    label: 'Educator',
    hint: 'Use your teacher credentials.',
    icon: Users,
    gradient: 'from-emerald-600 to-teal-700',
    light: 'bg-emerald-50 text-emerald-600',
  },
  parent_student: {
    label: 'Family & Student',
    hint: 'Use your parent/student credentials.',
    icon: UserSquare2,
    gradient: 'from-violet-600 to-purple-800',
    light: 'bg-violet-50 text-violet-600',
  },
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = useMemo(() => getRoleFromQuery(location.search), [location.search])
  const meta = roleMeta[role] || { label: 'Sign In', hint: 'Enter your credentials to continue.', icon: School, gradient: 'from-blue-600 to-primary-700', light: 'bg-blue-50 text-blue-600' }
  const Icon = meta.icon

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
      const targets = { admin: '/admin', teacher: '/teacher', parent_student: '/student' }
      navigate(targets[role] || '/login')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-primary-900 to-blue-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div className={`bg-gradient-to-r ${meta.gradient} px-8 py-7 text-white text-center`}>
            <div className="inline-flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mb-3 backdrop-blur-sm">
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
                <label className="label">Identifier</label>
                <input
                  className={`input ${errors.identifier ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="text"
                  placeholder="Enter Email or Registration ID"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                />
                {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>}
              </div>


              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    className={`input pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className={`btn-primary w-full py-3 text-sm mt-2 bg-gradient-to-r ${meta.gradient} hover:opacity-90`}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                  : 'Sign In'
                }
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Not your role?{' '}
              <button onClick={() => navigate('/')} className="text-primary-600 font-semibold hover:underline">
                Choose a different portal
              </button>
            </p>
          </div>
        </div>

        {/* Logo at bottom */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-white/60 text-sm font-medium">Academia Connect</span>
        </div>
      </div>
    </div>
  )
}
