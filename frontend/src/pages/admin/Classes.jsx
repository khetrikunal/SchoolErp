import { useEffect, useMemo, useState } from 'react'
import { Plus, School } from 'lucide-react'
import { Modal, TableActions, ConfirmDialog, EmptyState, FormField, SearchInput } from '../../components/ui'
import { search } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { classService } from '../../services/api/classService'

// Note: teacher dropdown is temporarily kept compatible with existing UI shape.
// We will wire real teachers in a later batch.
import { teachers as teachersFallback } from '../../utils/data'

const BLANK = { name:'', division:'A', classTeacher:'', room:'', academicYear:'', totalStudents:0 }

export default function Classes() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await classService.getAllAdminClasses()
        if (cancelled) return
        setData(Array.isArray(res) ? res : [])
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || 'Failed to load classes'
        setError(msg)
        toast.error(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const normalized = data.map((c) => ({
      ...c,
      // compatibility with old UI keys
      name: c.className,
      section: c.division,
      classTeacher: c.classTeacher,
    }))
    return search(normalized, q, ['name', 'classTeacher', 'room'])
  }, [data, q])

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const subjectColors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-purple-100 text-purple-700',
    'bg-cyan-100 text-cyan-700',
  ]

  const toPayload = () => ({
    className: form.name,
    division: form.division,
    classTeacher: form.classTeacher,
    room: form.room,
    academicYear: form.academicYear,
    totalStudents: form.totalStudents ? Number(form.totalStudents) : 0,
  })

  const onSave = async () => {
    if (!form.name) return toast.error('Class name required')
    setSaving(true)
    try {
      const payload = toPayload()
      if (modal === 'add') {
        const created = await classService.createClass(payload)
        setData((prev) => [created, ...prev])
        toast.success('Class created!')
      } else {
        const updated = await classService.updateClass(sel.id, payload)
        setData((prev) => prev.map((c) => (c.id === sel.id ? updated : c)))
        toast.success('Updated!')
      }
      setModal(null)
      setSel(null)
    } catch (e) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm) return
    setSaving(true)
    try {
      await classService.deleteClass(confirm)
      setData((prev) => prev.filter((c) => c.id !== confirm))
      toast.success('Class deleted')
    } catch (e) {
      toast.error(e?.message || 'Delete failed')
    } finally {
      setSaving(false)
      setConfirm(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Classes & Sections</h1>
          <p className="text-sm text-gray-500">{loading ? 'Loading...' : `${data.length} classes configured`}</p>
        </div>
        <button
          onClick={() => {
            setForm(BLANK)
            setModal('add')
          }}
          className="btn-primary"
          disabled={loading || saving}
        >
          <Plus size={15} />Add Class
        </button>
      </div>

      <div className="card p-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search classes..." className="max-w-sm" />
      </div>

      {loading ? (
        <div className="card p-8 flex items-center justify-center">Loading classes...</div>
      ) : error ? (
        <div className="col-span-3 card">
          <EmptyState icon={School} title="Failed to load classes" desc={error} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="col-span-3 card">
          <EmptyState icon={School} title="No classes found" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cls, i) => (
            <div key={cls.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`px-3 py-1.5 rounded-xl text-sm font-display font-bold ${subjectColors[i % 6]}`}
                >
                  {cls.name}
                </div>
                <TableActions
                  onEdit={() => {
                    setForm({
                      name: cls.className,
                      division: cls.division || cls.section,
                      classTeacher: cls.classTeacher || '',
                      room: cls.room || '',
                      academicYear: cls.academicYear || '',
                      totalStudents: cls.totalStudents || 0,
                    })
                    setSel(cls)
                    setModal('edit')
                  }}
                  onDelete={() => setConfirm(cls.id)}
                />
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">Class {cls.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-500">
                  🏫 <span className="font-medium text-gray-700 dark:text-gray-300">{cls.room}</span>
                </p>
                <p className="text-gray-500">
                  👩‍🏫{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cls.classTeacher}</span>
                </p>
                <p className="text-gray-500">
                  👥 Students:{' '}
                  <span className="font-bold text-gray-800 dark:text-gray-200">{cls.totalStudents}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal === 'add' || modal === 'edit'}
        onClose={() => {
          if (!saving) setModal(null)
        }}
        title={modal === 'add' ? 'Add Class' : 'Edit Class'}
        size="md"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Class Name" required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => f('name', e.target.value)}
              placeholder="LKG, UKG, 1st–10th"
            />
          </FormField>

          <FormField label="Section">
            <select
              className="input"
              value={form.division}
              onChange={(e) => f('division', e.target.value)}
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </FormField>

          <FormField label="Room">
            <input
              className="input"
              value={form.room}
              onChange={(e) => f('room', e.target.value)}
              placeholder="Room 101"
            />
          </FormField>

          <FormField label="Academic Year">
            <input
              className="input"
              value={form.academicYear}
              onChange={(e) => f('academicYear', e.target.value)}
              placeholder="2025-26"
            />
          </FormField>

          <FormField label="Class Teacher">
            <select
              className="input"
              value={form.classTeacher}
              onChange={(e) => f('classTeacher', e.target.value)}
            >
              <option value="">Select Teacher</option>
              {/* temporary fallback until teacher service is migrated */}
              {teachersFallback.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Total Students">
            <input
              className="input"
              type="number"
              value={form.totalStudents}
              onChange={(e) => f('totalStudents', e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
          <button onClick={onSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Class'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => {
          if (!saving) setConfirm(null)
        }}
        onConfirm={onDelete}
        title="Delete Class"
        message="Delete this class permanently?"
      />
    </div>
  )
}
