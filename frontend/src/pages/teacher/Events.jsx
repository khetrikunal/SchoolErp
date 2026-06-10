import { useState } from 'react'
import { Trophy, Calendar, MapPin, DollarSign } from 'lucide-react'
import { events } from '../../utils/data'
import { useAuth } from '../../context/AuthContext'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui'
import { fmt, currency } from '../../utils/helpers'

export default function TeacherEvents() {
  const { user } = useAuth()
  const myEvents = events.filter(e => (e.assignedTeacherIds || []).includes(user?.id))
  const [sel, setSel] = useState(null)
  const TYPE_COLORS = { Cultural: 'bg-purple-100 text-purple-700', Sports: 'bg-blue-100 text-blue-700', Academic: 'bg-emerald-100 text-emerald-700', Seminar: 'bg-amber-100 text-amber-700', Workshop: 'bg-rose-100 text-rose-700', Competition: 'bg-cyan-100 text-cyan-700', Other: 'bg-gray-100 text-gray-700' }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">My Assigned Events</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{myEvents.length} events assigned to you</p>
      </div>
      {myEvents.length === 0
        ? <div className="card p-10 text-center"><Trophy size={40} className="mx-auto text-gray-300 mb-2" /><p className="font-semibold text-gray-500">No events assigned yet</p><p className="text-sm text-gray-400">Admin will assign events to you</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{myEvents.map(ev => (
          <div key={ev.id} className="card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[ev.type] || TYPE_COLORS.Other}`}>{ev.type}</span>
              <StatusBadge status={ev.status} />
            </div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mt-1 mb-2">{ev.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ev.description}</p>
            <div className="space-y-1.5 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1.5"><Calendar size={13} className="text-primary-500" /><span>{fmt(ev.date)} · {ev.time}</span></div>
              <div className="flex items-center gap-1.5"><MapPin size={13} className="text-emerald-500" /><span>{ev.venue}</span></div>
              <div className="flex items-center gap-1.5"><DollarSign size={13} className="text-amber-500" /><span>Budget: {currency(ev.budget)}</span></div>
            </div>
            <button onClick={() => setSel(ev)} className="btn-primary w-full">View Details</button>
          </div>
        ))}</div>
      }
      <Modal open={!!sel} onClose={() => setSel(null)} title="Event Details" size="md">
        {sel && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl text-white">
              <p className="text-xs opacity-70 uppercase">{sel.type}</p>
              <h3 className="text-xl font-display font-bold mt-0.5">{sel.name}</h3>
              <StatusBadge status={sel.status} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-xl">{sel.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Date', fmt(sel.date)], ['Time', sel.time], ['Venue', sel.venue], ['Budget', currency(sel.budget)]].map(([k, v]) => (
                <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-bold text-gray-800 dark:text-gray-200">{v}</p></div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
