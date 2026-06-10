import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { results as init, exams, students } from '../../utils/data'
import { useAuth } from '../../context/AuthContext'
import { Modal, FormField, EmptyState } from '../../components/ui'
import { StatusBadge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const BLANK = { studentId: '', studentName: '', class: '', examName: '', subject: '', marksObtained: '', maxMarks: 100 }
const gradeFor = (got, max) => {
  const p = (got / max) * 100
  if (p >= 90) return 'A+'
  if (p >= 80) return 'A'
  if (p >= 70) return 'B+'
  if (p >= 60) return 'B'
  if (p >= 50) return 'C'
  if (p >= 35) return 'D'
  return 'F'
}

export default function TeacherResults() {
  const { user } = useAuth()
  const myClasses = user?.classes || []
  const [data, setData] = useState(init.filter(r => myClasses.includes(r.class)))
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(BLANK)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!form.studentName || !form.marksObtained) return toast.error('Fill required fields')
    const grade = gradeFor(Number(form.marksObtained), Number(form.maxMarks))
    const remarks = { 'A+': 'Outstanding', A: 'Excellent', 'B+': 'Very Good', B: 'Good', C: 'Average', D: 'Below Average', F: 'Fail' }[grade]
    setData([...data, { ...form, id: Date.now(), grade, remarks, marksObtained: Number(form.marksObtained), maxMarks: Number(form.maxMarks) }])
    toast.success('Result added!'); setModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Student Results</h1><p className="text-sm text-gray-500">Manage marks and grades</p></div>
        <button onClick={() => { setForm(BLANK); setModal(true) }} className="btn-primary">+ Add Marks</button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Student', 'Class', 'Exam', 'Subject', 'Marks', 'Grade', 'Remarks'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {data.length === 0 ? <tr><td colSpan={7}><EmptyState icon={BarChart3} title="No results yet" /></td></tr>
                : data.map(r => (
                  <tr key={r.id} className="tr-hover">
                    <td className="td font-semibold text-gray-900 dark:text-white">{r.studentName}</td>
                    <td className="td">{r.class}</td>
                    <td className="td text-gray-500">{r.examName}</td>
                    <td className="td">{r.subject}</td>
                    <td className="td font-bold">{r.marksObtained}/{r.maxMarks}</td>
                    <td className="td"><span className="badge badge-success">{r.grade}</span></td>
                    <td className="td text-gray-500">{r.remarks}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Student Marks" size="md">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Student Name" required><input className="input" value={form.studentName} onChange={e => f('studentName', e.target.value)} /></FormField>
          <FormField label="Class"><select className="input" value={form.class} onChange={e => f('class', e.target.value)}><option value="">Select</option>{myClasses.map(c => <option key={c}>{c}</option>)}</select></FormField>
          <FormField label="Exam Name"><input className="input" value={form.examName} onChange={e => f('examName', e.target.value)} /></FormField>
          <FormField label="Subject"><input className="input" value={form.subject} onChange={e => f('subject', e.target.value)} /></FormField>
          <FormField label="Marks Obtained" required><input className="input" type="number" value={form.marksObtained} onChange={e => f('marksObtained', e.target.value)} /></FormField>
          <FormField label="Max Marks"><input className="input" type="number" value={form.maxMarks} onChange={e => f('maxMarks', e.target.value)} /></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Add Result</button>
        </div>
      </Modal>
    </div>
  )
}
