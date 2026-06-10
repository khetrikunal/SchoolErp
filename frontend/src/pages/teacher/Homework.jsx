import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { homework as init } from '../../utils/data'
import { useAuth } from '../../context/AuthContext'
import { Modal, FormField, TableActions, ConfirmDialog, EmptyState, StatusBadge } from '../../components/ui'
import { fmt } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BLANK = { title: '', subject: '', class: '', dueDate: '', description: '' }

export default function TeacherHomework() {
  const { user } = useAuth()
  const myClasses = user?.classes || []
  const [data, setData] = useState(init.filter(h => myClasses.includes(h.class)))
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!form.title || !form.class || !form.dueDate) return toast.error('Fill required fields')
    const entry = { ...form, id: Date.now(), createdBy: user.name, createdAt: new Date().toISOString().split('T')[0], submissions: 0, totalStudents: 32 }
    if (modal === 'add') { setData([entry, ...data]); toast.success('Homework assigned!') }
    else { setData(data.map(h => h.id === sel.id ? { ...sel, ...form } : h)); toast.success('Updated!') }
    setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Homework & Assignments</h1><p className="text-sm text-gray-500">{data.length} assignments</p></div>
        <button onClick={() => { setForm(BLANK); setModal('add') }} className="btn-primary"><Plus size={15} />Assign Homework</button>
      </div>
      {data.length === 0
        ? <div className="card p-6"><EmptyState icon={BookOpen} title="No homework assigned yet" desc="Create your first assignment" /></div>
        : <div className="space-y-3">{data.map(hw => (
          <div key={hw.id} className="card hover:shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge badge-primary">{hw.subject}</span>
                  <span className="badge badge-info">{hw.class}</span>
                  <span className="text-xs text-gray-400">Due: {fmt(hw.dueDate)}</span>
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white">{hw.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{hw.description}</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-40 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{hw.submissions}/{hw.totalStudents} submitted</span>
                  </div>
                </div>
              </div>
              <TableActions onEdit={() => { setForm({ ...hw }); setSel(hw); setModal('edit') }} onDelete={() => setConfirm(hw.id)} />
            </div>
          </div>
        ))}</div>
      }
      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Assign Homework' : 'Edit Homework'} size="md">
        <div className="space-y-4">
          <FormField label="Title" required><input className="input" value={form.title} onChange={e => f('title', e.target.value)} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject"><input className="input" value={form.subject} onChange={e => f('subject', e.target.value)} /></FormField>
            <FormField label="Class" required>
              <select className="input" value={form.class} onChange={e => f('class', e.target.value)}>
                <option value="">Select</option>
                {myClasses.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Due Date" required><input className="input" type="date" value={form.dueDate} onChange={e => f('dueDate', e.target.value)} /></FormField>
          <FormField label="Description"><textarea className="input" rows={3} value={form.description} onChange={e => f('description', e.target.value)} /></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.filter(h => h.id !== confirm)); setConfirm(null); toast.success('Deleted') }} title="Delete Homework" message="Delete this assignment?" />
    </div>
  )
}
