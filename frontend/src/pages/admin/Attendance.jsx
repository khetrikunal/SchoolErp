import { useState } from 'react'
import { UserCheck } from 'lucide-react'
import { attendanceSummary, chartAttendance } from '../../utils/data'
import { SearchInput, StatusBadge } from '../../components/ui'
import { search } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/ui/Card'

export default function Attendance() {
  const [q, setQ] = useState('')
  const filtered = search(attendanceSummary, q, ['name', 'class'])
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Attendance Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor student attendance across all classes</p>
      </div>
      <Card>
        <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Monthly Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartAttendance} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }} />
            <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present %" />
            <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="card p-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search students..." className="max-w-sm" />
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Student', 'Class', 'Total Days', 'Present', 'Absent', 'Late', 'Attendance %'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {filtered.map(s => (
                <tr key={s.studentId} className="tr-hover">
                  <td className="td font-semibold text-gray-900 dark:text-white">{s.name}</td>
                  <td className="td">{s.class}</td>
                  <td className="td">{s.totalDays}</td>
                  <td className="td"><span className="font-bold text-emerald-600">{s.present}</span></td>
                  <td className="td"><span className="font-bold text-red-500">{s.absent}</span></td>
                  <td className="td"><span className="font-bold text-amber-500">{s.late}</span></td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-20">
                        <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${s.percentage}%` }} />
                      </div>
                      <span className={`font-bold text-sm ${s.percentage >= 90 ? 'text-emerald-600' : s.percentage >= 75 ? 'text-amber-600' : 'text-red-500'}`}>{s.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
