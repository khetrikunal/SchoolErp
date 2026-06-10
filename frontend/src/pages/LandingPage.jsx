import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, BarChart3, BookOpen, Bus, CalendarDays, CheckCircle2,
  ChevronRight, Clock, CreditCard, GraduationCap, LayoutDashboard,
  Mail, MapPin, Menu, Phone, ShieldCheck, Sparkles, Star, Users, X,
  School, Building2, UserCheck, Bell, Award, TrendingUp, Play,
  Zap, Globe, Lock, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ─── data ─────────────────────────────────────────── */
const navLinks = [
  { label: 'Features',     href: '#features' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Resources',    href: '#resources' },
]

const stats = [
  { label: 'Students managed',    value: '48K+', icon: GraduationCap, color: 'text-blue-500' },
  { label: 'Active teachers',     value: '3.2K', icon: Users,         color: 'text-emerald-500' },
  { label: 'Partner schools',     value: '180+', icon: Building2,     color: 'text-violet-500' },
  { label: 'Attendance accuracy', value: '98%',  icon: CheckCircle2,  color: 'text-amber-500' },
]

const roleCards = [
  {
    key: 'admin',
    eyebrow: 'ADMIN & STAFF',
    title: 'School Administrators',
    description: 'Manage records, fees, staff, and campus resources.',
    action: 'Access Admin Portal',
    role: 'admin',
    gradient: 'from-blue-600 to-blue-800',
    lightBg: 'bg-blue-50',
    iconBg: 'bg-blue-600',
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#EFF6FF"/>
        <path d="M32 12L44 20v6H20v-6L32 12z" fill="#2563EB"/>
        <rect x="20" y="26" width="24" height="20" fill="#3B82F6"/>
        <rect x="26" y="38" width="12" height="8" fill="#BFDBFE"/>
        <circle cx="32" cy="22" r="3" fill="white"/>
        <path d="M42 24l4 4-2 2-4-4 2-2z" fill="#1D4ED8"/>
        <circle cx="44" cy="30" r="8" fill="#1D4ED8"/>
        <path d="M40 30l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'teacher',
    eyebrow: 'TEACHERS',
    title: 'Educator Workspace',
    description: 'Grade assignments, track progress, and create lesson plans.',
    action: 'Login to Teacher Dashboard',
    role: 'teacher',
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'bg-emerald-50',
    iconBg: 'bg-emerald-600',
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#F0FDF4"/>
        <rect x="14" y="18" width="36" height="28" rx="2" fill="#D1FAE5"/>
        <rect x="14" y="18" width="36" height="8" rx="2" fill="#059669"/>
        <circle cx="32" cy="14" r="5" fill="#F87171"/>
        <path d="M27 14 Q32 8 37 14" fill="#EF4444"/>
        <rect x="20" y="32" width="10" height="2" rx="1" fill="#6EE7B7"/>
        <rect x="20" y="36" width="14" height="2" rx="1" fill="#6EE7B7"/>
        <rect x="20" y="40" width="8"  height="2" rx="1" fill="#6EE7B7"/>
        <circle cx="42" cy="38" r="7" fill="#059669"/>
        <path d="M38.5 38l2.5 2.5L44.5 35" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'parent_student',
    eyebrow: 'PARENTS & STUDENTS',
    title: 'Family & Student Hub',
    description: 'View grades, view attendance, communicate, and pay fees.',
    action: 'Go to Parent/Student Portal',
    role: 'parent_student',
    gradient: 'from-violet-600 to-purple-800',
    lightBg: 'bg-violet-50',
    iconBg: 'bg-violet-600',
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#F5F3FF"/>
        <circle cx="22" cy="24" r="7" fill="#7C3AED"/>
        <path d="M10 46c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#8B5CF6"/>
        <circle cx="44" cy="20" r="5" fill="#A78BFA"/>
        <path d="M36 40c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#C4B5FD"/>
        <circle cx="32" cy="44" r="4" fill="#DDD6FE"/>
      </svg>
    ),
  },
]

const featureCards = [
  {
    title: 'Smart Attendance',
    description: 'Instant classroom marking with absence alerts and trend insights.',
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
    color: 'bg-blue-500',
  },
  {
    title: 'Automated Fee Collection',
    description: 'Collect, reconcile, and report fees with fewer manual steps.',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    color: 'bg-emerald-500',
  },
  {
    title: 'Interactive Timetable',
    description: 'Build clash-free schedules for classes, teachers, rooms, and exams.',
    icon: CalendarDays,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
    color: 'bg-amber-500',
  },
  {
    title: 'Real-Time Bus Tracking',
    description: 'Keep families informed with route visibility and safety updates.',
    icon: Bus,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    color: 'bg-violet-500',
  },
]

const testimonials = [
  {
    quote: 'Our staff moved from scattered spreadsheets to a single command center. The experience feels polished and easy to trust.',
    name: 'Anika Rao',
    role: 'Principal, Greenfield Academy',
    initials: 'AR',
    color: 'bg-blue-500',
  },
  {
    quote: 'Teachers save time every morning, and parents finally receive updates without waiting for manual follow-ups.',
    name: 'Daniel Mathew',
    role: 'Operations Head, Northstar School',
    initials: 'DM',
    color: 'bg-emerald-500',
  },
  {
    quote: 'The dashboard gives our leadership team a clear picture of attendance, collections, and daily school activity.',
    name: 'Meera Shah',
    role: 'Director, Heritage Public School',
    initials: 'MS',
    color: 'bg-violet-500',
  },
]

const trustedSchools = ['Northstar', 'Greenfield', 'Oakridge', 'Brighton', 'Scholars', 'Riverdale']

const reasons = [
  { icon: Sparkles, title: 'Designed for every campus workflow', desc: 'Admissions, attendance, fees, notices, classes, and reports live in one elegant operating layer.' },
  { icon: ShieldCheck, title: 'Secure role-based access', desc: 'Admins, teachers, students, and families see only what matters to their daily responsibilities.' },
  { icon: BarChart3, title: 'Insightful decisions in real time', desc: 'Track campus health, student progress, finance updates, and communication performance at a glance.' },
]

/* ─── sub-components ────────────────────────────────── */
function Logo({ inverse }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg
        ${inverse ? 'bg-white' : 'bg-primary-600'}`}>
        <GraduationCap size={20} className={inverse ? 'text-primary-600' : 'text-white'} />
      </div>
      <div>
        <p className={`text-base font-display font-bold leading-tight ${inverse ? 'text-white' : 'text-gray-900'}`}>
          Academia Connect
        </p>
        <p className={`text-xs font-medium ${inverse ? 'text-blue-200' : 'text-gray-500'}`}>
          School Management Suite
        </p>
      </div>
    </div>
  )
}

function RoleCard({ item, onAction }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-card p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border-blue-100">
      <div className="flex justify-center mb-5">
        {item.icon}
      </div>
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.eyebrow}</p>
      <h3 className="text-center text-xl font-display font-bold text-gray-900 mb-3">{item.title}</h3>
      <p className="text-center text-sm text-gray-500 leading-relaxed flex-1 mb-6">{item.description}</p>
      <button
        type="button"
        onClick={onAction}
        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 bg-gradient-to-r ${item.gradient} hover:opacity-90 shadow-sm`}
      >
        {item.action}
        <ArrowRight size={15} />
      </button>
    </article>
  )
}

/* ─── main component ────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const getDashPath = () => {
    if (!user) return null
    const r = String(user.role || '').toUpperCase()
    if (r === 'ADMIN')   return '/admin'
    if (r === 'TEACHER') return '/teacher'
    if (r === 'STUDENT') return '/student'
    return null
  }

  const openPortal = () => {
    const p = getDashPath()
    navigate(p || '/login')
  }

  const goToRole = (role) => navigate(`/login?role=${role}`)

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('/')} className="focus:outline-none">
            <Logo />
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button type="button" onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              Login
            </button>
          </div>

          {/* Mobile hamburger */}
          <button type="button" onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-xl border border-gray-200 text-gray-700">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 pb-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl">
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <button onClick={() => navigate('/login')} className="btn-secondary w-full justify-center">Login</button>
              <button onClick={openPortal} className="btn-primary w-full justify-center">Get a Demo <ArrowRight size={15}/></button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background: school cityscape with blue gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-950/90" />
            <div className="absolute inset-0 hero-pattern" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-0">
            {/* Hero text */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
                <Zap size={12} className="text-yellow-400" />
                Next-Gen School Management Platform
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
                Empower Your<br />
                <span className="gradient-text">Educational Ecosystem</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                Streamline communication, simplify administration, and maximize student success.
              </p>
            </div>

            {/* Role login cards panel */}
            <div className="relative">
              <div className="rounded-t-2xl bg-blue-950/80 backdrop-blur-xl border border-white/10 px-6 py-5">
                <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-blue-200 mb-6">
                  Seamless Logins for Every Role
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-2">
                  {roleCards.map((item) => (
                    <RoleCard key={item.key} item={item} onAction={() => goToRole(item.role)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE IMAGES (4-col mosaic) ─────────── */}
        <section id="features">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {featureCards.map((f) => {
              const Icon = f.icon
              return (
                <article key={f.title} className="group relative h-52 lg:h-56 overflow-hidden">
                  <img src={f.image} alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${f.color} mb-2`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <p className="text-white text-sm font-bold leading-tight">{f.title}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────── */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 mb-3 ${s.color}`}>
                      <Icon size={22} />
                    </div>
                    <p className="font-display font-bold text-3xl text-gray-900">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ───────────────────────────── */}
        <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Trusted by Leading Schools</p>
            <div className="flex flex-wrap justify-center gap-6">
              {trustedSchools.map((school) => (
                <div key={school}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <School size={16} className="text-primary-600" />
                  <span className="text-sm font-semibold text-gray-700">{school}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ───────────────────────────────── */}
        <section id="case-studies" className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div className="text-white">
                <span className="section-tag bg-white/20 text-white border-0">Why Academia Connect</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 mb-5 leading-tight">
                  Everything your school needs,<br/>built into one platform.
                </h2>
                <p className="text-blue-100 text-base leading-relaxed mb-8">
                  From admissions to graduation — manage every workflow without switching between tools.
                </p>
                <button type="button" onClick={openPortal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-blue-50 transition-all shadow-lg">
                  Explore Features <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid gap-4">
                {reasons.map((r) => {
                  const Icon = r.icon
                  return (
                    <div key={r.title} className="glass rounded-2xl p-5 flex gap-4 items-start">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{r.title}</h3>
                        <p className="text-sm text-blue-100 leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING / CTA CARD ───────────────────── */}
        <section id="pricing" className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-900 to-primary-700 p-10 lg:p-14 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
                <div className="text-white">
                  <span className="section-tag bg-white/15 text-white text-xs border-0">Flexible Pricing</span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 mb-4 leading-tight">
                    Start with the modules your school needs most.
                  </h2>
                  <p className="text-blue-100 leading-relaxed">
                    Choose academics, finance, communication, transport, or a complete ERP rollout with guided onboarding.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-7 backdrop-blur-sm">
                  <p className="text-blue-200 text-sm font-semibold">Implementation-ready</p>
                  <p className="text-5xl font-display font-bold text-white mt-2">30 days</p>
                  <p className="text-blue-200 text-sm mt-2 mb-6">Typical guided launch for a mid-sized school.</p>
                  <button type="button" onClick={openPortal}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-blue-50 transition-all shadow-lg">
                    Get a Demo <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <span className="section-tag">Testimonials</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-gray-900">
                Loved by academic and operations teams.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((t) => (
                <article key={t.name} className="card p-6 flex flex-col gap-4">
                  <div className="flex gap-1 text-amber-400">
                    {[1,2,3,4,5].map(s => <Star key={s} size={15} fill="currentColor" />)}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-gray-600 flex-1">
                    "{t.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESOURCES ────────────────────────────── */}
        <section id="resources" className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <span className="section-tag">Resources</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 mb-4 text-gray-900">
                  ERP playbooks for growing schools.
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Give your leadership team the operational clarity needed to improve communication, compliance, and student outcomes.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Implementation guide', 'Launch modules without overwhelming staff.', BookOpen, 'text-blue-500 bg-blue-50'],
                  ['Parent engagement kit', 'Improve communication across families and advisors.', Users, 'text-violet-500 bg-violet-50'],
                  ['Finance checklist', 'Standardize fee collection, receipts, and reporting.', CreditCard, 'text-emerald-500 bg-emerald-50'],
                  ['Academic analytics', 'Turn attendance and grades into actionable insights.', BarChart3, 'text-amber-500 bg-amber-50'],
                ].map(([title, desc, Icon, colors]) => (
                  <article key={title} className="card-hover p-5 cursor-pointer">
                    <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-3 ${colors}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-primary-700 to-violet-800 p-12 shadow-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={11} /> Ready to modernize?
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
                Bring administration, teaching, and family engagement into one connected ERP.
              </h2>
              <p className="text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
                Book a guided demo and see how the platform adapts to your school workflows.
              </p>
              <button type="button" onClick={openPortal}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-xl">
                Get a Demo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="bg-gray-950 text-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div>
              <Logo inverse />
              <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
                A modern School Management ERP SaaS platform for connected, efficient, and data-informed campuses.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4">Navigation</h3>
              <div className="grid gap-2.5">
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4">Resources</h3>
              <div className="grid gap-2.5">
                {['Implementation', 'Security', 'Support', 'Documentation'].map((item) => (
                  <a key={item} href="#resources" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <address className="not-italic">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4">Contact</h3>
              <div className="grid gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-2.5"><Mail size={14} className="text-blue-400" /> support@academiaconnect.com</span>
                <span className="flex items-center gap-2.5"><Phone size={14} className="text-blue-400" /> +91 98765 43210</span>
                <span className="flex items-center gap-2.5"><MapPin size={14} className="text-blue-400" /> Pune, Maharashtra</span>
              </div>
            </address>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>Copyright © {new Date().getFullYear()} Academia Connect. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#resources" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#resources" className="hover:text-blue-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
