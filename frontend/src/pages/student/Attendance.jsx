import { useAuth } from '../../context/AuthContext'
import { attendanceSummary, attendance } from '../../utils/data'
import { StatusBadge } from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import { fmt } from '../../utils/helpers'

export default function StudentAttendance() {
  const { user } = useAuth()
  const myRecord = attendanceSummary.find(s => s.studentId === user?.id) || attendanceSummary[0]
  const myLogs = attendance.filter(a => a.studentId === user?.id)

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">My Attendance</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[['Total Days', myRecord.totalDays, 'text-gray-700 dark:text-gray-200'], ['Present', myRecord.present, 'text-emerald-600'], ['Absent', myRecord.absent, 'text-red-500'], ['Late', myRecord.late, 'text-amber-500']].map(([k, v, c]) => (
          <Card key={k} className="text-center py-4">
            <p className={`text-3xl font-display font-bold ${c}`}>{v}</p>
            <p className="text-sm text-gray-500 mt-0.5">{k}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-800 dark:text-white">Attendance Percentage</h2>
          <span className={`text-2xl font-display font-bold ${myRecord.percentage >= 90 ? 'text-emerald-600' : myRecord.percentage >= 75 ? 'text-amber-600' : 'text-red-500'}`}>{myRecord.percentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-3 rounded-full transition-all ${myRecord.percentage >= 90 ? 'bg-emerald-500' : myRecord.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${myRecord.percentage}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{myRecord.percentage >= 75 ? '✓ Attendance is satisfactory' : '⚠ Attendance below 75% — improvement needed'}</p>
      </Card>
      <Card>
        <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Recent Attendance Logs</h2>
        {myLogs.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">No logs found</p>
          : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Date', 'Status', 'Marked By'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {myLogs.map(log => (
                <tr key={log.id} className="tr-hover">
                  <td className="td">{fmt(log.date)}</td>
                  <td className="td"><StatusBadge status={log.status} /></td>
                  <td className="td text-gray-500">{log.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table></div>}
      </Card>
    </div>
  )
}
