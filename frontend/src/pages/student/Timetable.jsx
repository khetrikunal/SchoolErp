import { useAuth } from '../../context/AuthContext'
import { timetable } from '../../utils/data'

const PERIOD_TIMES = ['8:00–8:45', '8:45–9:30', '9:45–10:30', '10:30–11:15', '11:30–12:15', '12:15–1:00']
const SUBJ_COLORS = { 'Mathematics': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 'Physics': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', 'Chemistry': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', 'English': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', 'Comp Sci': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', 'Hindi': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', 'Biology': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300', 'History': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }

export default function StudentTimetable() {
  const { user } = useAuth()
  const cls = user?.class || '10-A'
  const tt = timetable[cls] || []
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">My Timetable</h1><p className="text-sm text-gray-500 dark:text-gray-400">Class {cls} — Weekly Schedule</p></div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr><th className="th w-28">Day</th>{PERIOD_TIMES.map((t, i) => <th key={i} className="th text-center"><div>P{i + 1}</div><div className="text-[10px] font-normal text-gray-400 normal-case">{t}</div></th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {tt.map(row => (
                <tr key={row.day} className="tr-hover">
                  <td className="td font-bold text-gray-800 dark:text-gray-200">{row.day}</td>
                  {row.periods.map((subj, i) => (
                    <td key={i} className="td text-center py-2">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${SUBJ_COLORS[subj] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{subj}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
