import { notices } from '../../utils/data'
import { StatusBadge } from '../../components/ui/Badge'
import { fmt } from '../../utils/helpers'

export default function TeacherNotices() {
  const myNotices = notices.filter(n => n.audience === 'All' || n.audience === 'Teachers')
  const priorityColors = { High: 'border-l-red-400', Medium: 'border-l-amber-400', Low: 'border-l-blue-400' }
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Notice Board</h1><p className="text-sm text-gray-500">{myNotices.length} notices</p></div>
      <div className="space-y-3">
        {myNotices.map(n => (
          <div key={n.id} className={`card border-l-4 ${priorityColors[n.priority] || 'border-l-gray-300'}`}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <StatusBadge status={n.priority} />
              <span className="badge badge-gray">{n.category}</span>
              <span className="text-xs text-gray-400">{fmt(n.date)}</span>
            </div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white">{n.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.content}</p>
            <p className="text-xs text-gray-400 mt-2">— {n.postedBy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
