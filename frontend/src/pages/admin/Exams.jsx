import { useState } from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import { exams as init, results } from '../../utils/data'
import { StatusBadge, Modal, TableActions, ConfirmDialog, EmptyState, FormField } from '../../components/ui'
import { fmt } from '../../utils/helpers'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const BLANK = { name: '', type: 'Unit Test', class: '', subject: '', date: '', maxMarks: 100, passingMarks: 35, duration: '3 hours', status: 'Upcoming' }

export default function Exams() {
  const [data, setData] = useState(init)
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const save = () => {
    if (!form.name || !form.class || !form.date) return toast.error('Fill required fields')
    if (modal === 'add') { setData([...data, { ...form, id: Date.now() }]); toast.success('Exam created!') }
    else { setData(data.map(e => e.id === sel.id ? { ...sel, ...form } : e)); toast.success('Updated!') }
    setModal(null)
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Exams & Results</h1><p className="text-sm text-gray-500">{data.length} exams scheduled</p></div>
        <button onClick={() => { setForm(BLANK); setModal('add') }} className="btn-primary"><Plus size={15} />Create Exam</button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Exam Name', 'Type', 'Class', 'Subject', 'Date', 'Max Marks', 'Status', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {data.map(ex => (
                <tr key={ex.id} className="tr-hover">
                  <td className="td font-semibold text-gray-900 dark:text-white">{ex.name}</td>
                  <td className="td"><span className="badge badge-info">{ex.type}</span></td>
                  <td className="td font-semibold">{ex.class}</td>
                  <td className="td">{ex.subject}</td>
                  <td className="td">{fmt(ex.date)}</td>
                  <td className="td font-bold">{ex.maxMarks}</td>
                  <td className="td"><StatusBadge status={ex.status} /></td>
                  <td className="td"><TableActions onEdit={() => { setForm({ ...ex }); setSel(ex); setModal('edit') }} onDelete={() => setConfirm(ex.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Card>
        <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Published Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Student', 'Class', 'Exam', 'Subject', 'Marks', 'Grade', 'Remarks'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {results.map(r => (
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
      </Card>
      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Create Exam' : 'Edit Exam'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Exam Name" required><input className="input" value={form.name} onChange={e => f('name', e.target.value)} /></FormField>
          <FormField label="Type"><select className="input" value={form.type} onChange={e => f('type', e.target.value)}>{['Unit Test', 'Mid Term', 'Term Exam', 'Practical', 'Final'].map(t => <option key={t}>{t}</option>)}</select></FormField>
          <FormField label="Class" required><select className="input" value={form.class} onChange={e => f('class', e.target.value)}><option value="">Select</option>{['8-A', '8-B', '9-A', '9-B', '10-A', '10-B'].map(c => <option key={c}>{c}</option>)}</select></FormField>
          <FormField label="Subject"><input className="input" value={form.subject} onChange={e => f('subject', e.target.value)} /></FormField>
          <FormField label="Date" required><input className="input" type="date" value={form.date} onChange={e => f('date', e.target.value)} /></FormField>
          <FormField label="Duration"><input className="input" value={form.duration} onChange={e => f('duration', e.target.value)} /></FormField>
          <FormField label="Max Marks"><input className="input" type="number" value={form.maxMarks} onChange={e => f('maxMarks', e.target.value)} /></FormField>
          <FormField label="Passing Marks"><input className="input" type="number" value={form.passingMarks} onChange={e => f('passingMarks', e.target.value)} /></FormField>
          <FormField label="Status"><select className="input" value={form.status} onChange={e => f('status', e.target.value)}>{['Upcoming', 'Ongoing', 'Completed'].map(s => <option key={s}>{s}</option>)}</select></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save Exam</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.filter(e => e.id !== confirm)); setConfirm(null); toast.success('Deleted') }} title="Delete Exam" message="Delete this exam?" />
    </div>
  )
}
