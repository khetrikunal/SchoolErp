import { useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { students, attendanceSummary } from '../../utils/data'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/ui'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function TeacherAttendance() {
  const { user } = useAuth()
  const myClasses = user?.classes || []
  const [selClass, setSelClass] = useState(myClasses[0] || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const classStudents = students.filter(s => s.class === selClass)
  const [attendance, setAttendance] = useState({})
  const [saved, setSaved] = useState(false)

  const mark = (id, status) => setAttendance(a => ({ ...a, [id]: status }))

  const saveAttendance = () => {
    const unmarked = classStudents.filter(s => !attendance[s.id])
    if (unmarked.length > 0) {
      unmarked.forEach(s => mark(s.id, 'Present'))
    }
    setSaved(true)
    toast.success(`Attendance saved for ${selClass} — ${date}`)
  }

  const statusBtn = (id, status, icon, color) => {
    const active = attendance[id] === status
    return (
      <button onClick={() => mark(id, status)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${active ? color + ' text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
        {icon}{status}
      </button>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Mark Attendance</h1><p className="text-sm text-gray-500">{classStudents.length} students</p></div>
        <div className="flex gap-2">
          <select value={selClass} onChange={e => { setSelClass(e.target.value); setAttendance({}); setSaved(false) }} className="input w-28">
            {myClasses.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setAttendance({}); setSaved(false) }} className="input w-40" />
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-700 dark:text-gray-300">Class {selClass} · {date}</p>
          <div className="flex gap-2 text-xs">
            <span className="badge badge-success">P: {Object.values(attendance).filter(v => v === 'Present').length}</span>
            <span className="badge badge-danger">A: {Object.values(attendance).filter(v => v === 'Absent').length}</span>
            <span className="badge badge-warning">L: {Object.values(attendance).filter(v => v === 'Late').length}</span>
          </div>
        </div>

        <div className="space-y-2">
          {classStudents.map(s => (
            <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${attendance[s.id] === 'Present' ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800' : attendance[s.id] === 'Absent' ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' : attendance[s.id] === 'Late' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' : 'border-gray-100 dark:border-gray-700'}`}>
              <Avatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{s.name}</p>
                <p className="text-xs text-gray-400">{s.rollNo}</p>
              </div>
              <div className="flex gap-1.5">
                {statusBtn(s.id, 'Present', <CheckCircle size={12} />, 'bg-emerald-500')}
                {statusBtn(s.id, 'Absent', <XCircle size={12} />, 'bg-red-500')}
                {statusBtn(s.id, 'Late', <Clock size={12} />, 'bg-amber-500')}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button onClick={saveAttendance} className="btn-primary px-6">
            {saved ? '✓ Attendance Saved' : 'Save Attendance'}
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-bold text-gray-800 dark:text-white mb-3">Class Attendance Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Student', 'Present', 'Absent', 'Late', '%'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {attendanceSummary.filter(s => myClasses.includes(s.class)).map(s => (
                <tr key={s.studentId} className="tr-hover">
                  <td className="td font-semibold text-gray-900 dark:text-white">{s.name}</td>
                  <td className="td text-emerald-600 font-bold">{s.present}</td>
                  <td className="td text-red-500 font-bold">{s.absent}</td>
                  <td className="td text-amber-500 font-bold">{s.late}</td>
                  <td className="td"><span className={`font-bold ${s.percentage >= 90 ? 'text-emerald-600' : s.percentage >= 75 ? 'text-amber-500' : 'text-red-500'}`}>{s.percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
