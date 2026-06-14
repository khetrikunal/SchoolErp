import { useState, useEffect } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Modal, FormField, TableActions, ConfirmDialog, EmptyState, StatusBadge } from '../../components/ui'
import { fmt } from '../../utils/helpers'
import { apiGet, apiPost, apiPut, apiDelete } from '../../services/api/apiClient'
import toast from 'react-hot-toast'

const BLANK = { title: '', subject: '', class: '', dueDate: '', description: '' }

export default function TeacherHomework() {
  const { user } = useAuth()
  const myClasses = user?.classes || []
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const [file, setFile] = useState(null)
  const [removeFile, setRemoveFile] = useState(false)
  
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const loadHomework = async () => {
    try {
      setLoading(true)
      const res = await apiGet('/api/homework')
      const list = Array.isArray(res) ? res : res?.data || []
      setData(list)
    } catch (err) {
      toast.error('Failed to load homework: ' + (err?.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHomework()
  }, [])

  const save = async () => {
    if (!form.title || !form.class || !form.dueDate) return toast.error('Fill required fields')

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('subject', form.subject || '')
    formData.append('className', form.class)
    formData.append('dueDate', form.dueDate)
    formData.append('description', form.description || '')
    if (file) {
      formData.append('file', file)
    }

    try {
      if (modal === 'add') {
        const res = await apiPost('/api/homework', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const saved = res?.data || res
        setData([saved, ...data])
        toast.success('Homework assigned!')
      } else {
        formData.append('removeAttachment', removeFile)
        const res = await apiPut(`/api/homework/${sel.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const updated = res?.data || res
        setData(data.map(h => h.id === sel.id ? updated : h))
        toast.success('Updated!')
      }
      setModal(null)
      setFile(null)
      setRemoveFile(false)
    } catch (err) {
      toast.error('Failed to save homework: ' + (err?.response?.data?.message || err.message))
    }
  }

  const performDelete = async () => {
    try {
      await apiDelete(`/api/homework/${confirm}`)
      setData(data.filter(h => h.id !== confirm))
      setConfirm(null)
      toast.success('Deleted')
    } catch (err) {
      toast.error('Failed to delete homework: ' + (err?.response?.data?.message || err.message))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Homework & Assignments</h1>
          <p className="text-sm text-gray-500">{data.length} assignments</p>
        </div>
        <button onClick={() => { setForm(BLANK); setFile(null); setRemoveFile(false); setModal('add') }} className="btn-primary">
          <Plus size={15} />Assign Homework
        </button>
      </div>

      {loading ? (
        <div className="card p-8 text-center"><p className="text-gray-400">Loading assignments...</p></div>
      ) : data.length === 0 ? (
        <div className="card p-6"><EmptyState icon={BookOpen} title="No homework assigned yet" desc="Create your first assignment" /></div>
      ) : (
        <div className="space-y-3">
          {data.map(hw => (
            <div key={hw.id} className="card hover:shadow-lg transition-all p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="badge badge-primary">{hw.subject}</span>
                    <span className="badge badge-info">{hw.className || hw.class}</span>
                    <span className="text-xs text-gray-400">Due: {fmt(hw.dueDate)}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white break-words">{hw.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{hw.description}</p>
                  
                  {hw.attachmentUrl && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Attachment:</p>
                      <a href={hw.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-block group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        {hw.attachmentUrl.toLowerCase().endsWith('.pdf') ? (
                          <div className="p-3 text-xs text-red-500 font-semibold flex items-center gap-1.5">
                            <BookOpen size={16} /> View PDF Document
                          </div>
                        ) : (
                          <div className="relative">
                            <img src={hw.attachmentUrl} alt="Homework Attachment" className="max-h-20 max-w-[200px] object-cover group-hover:opacity-90 transition" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-medium transition">
                              View Full Photo
                            </div>
                          </div>
                        )}
                      </a>
                    </div>
                  )}

                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-40 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${((hw.submissions || 0) / (hw.totalStudents || 32)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{hw.submissions || 0}/{hw.totalStudents || 32} submitted</span>
                    </div>
                  </div>
                </div>
                <TableActions 
                  onEdit={() => { 
                    setForm({ title: hw.title, subject: hw.subject, class: hw.className || hw.class, dueDate: hw.dueDate, description: hw.description, attachmentUrl: hw.attachmentUrl }); 
                    setSel(hw); 
                    setFile(null);
                    setRemoveFile(false);
                    setModal('edit'); 
                  }} 
                  onDelete={() => setConfirm(hw.id)} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
          
          <FormField label="Attachment (Photo or PDF)">
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                className="input" 
                onChange={e => {
                  const fObj = e.target.files[0];
                  if (fObj) {
                    if (fObj.size > 5 * 1024 * 1024) {
                      toast.error("File size exceeds 5MB limit");
                      e.target.value = '';
                      return;
                    }
                    if (!fObj.type.startsWith("image/") && fObj.type !== "application/pdf") {
                      toast.error("Only images and PDFs are allowed");
                      e.target.value = '';
                      return;
                    }
                    setFile(fObj);
                    setRemoveFile(false);
                  }
                }} 
              />
              {file && (
                <div className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-lg flex items-center justify-between">
                  <span>Selected: {file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">×</button>
                </div>
              )}
              {form.attachmentUrl && !removeFile && (
                <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-750 px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <a href={form.attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-500 truncate max-w-[80%]">
                    View Current Attachment
                  </a>
                  <button type="button" onClick={() => { setRemoveFile(true); }} className="text-red-500 hover:text-red-700 text-xs font-semibold">Remove</button>
                </div>
              )}
              {removeFile && (
                <span className="text-xs text-red-500">Current attachment will be removed on Save.</span>
              )}
            </div>
          </FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={performDelete} title="Delete Homework" message="Delete this assignment?" />
    </div>
  )
}
