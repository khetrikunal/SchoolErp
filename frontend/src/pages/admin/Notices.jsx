import { useEffect, useMemo, useState } from 'react'
import { Plus, Megaphone, Loader2 } from 'lucide-react'
import { StatusBadge, Modal, SearchInput, TableActions, ConfirmDialog, EmptyState, FormField } from '../../components/ui'
import { fmt, search } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { noticeService } from '../../services/api/noticeService'

const BLANK = { title: '', content: '', priority: 'Medium', audience: 'All', category: 'General' }

export default function Notices() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)


  const fetchNotices = async ({ silent } = {}) => {
    try {
      if (!silent) setLoading(true)
      setError(null)
      const res = await noticeService.getAllAdminNotices()
      setData(Array.isArray(res) ? res : [])
    } catch (e) {
      const msg = e?.message || 'Failed to load notices'
      setError(msg)
      if (!silent) toast.error(msg)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()

    const intervalId = setInterval(() => {
      // Light polling for real-time UX simulation
      fetchNotices({ silent: true })
    }, 45000)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const filtered = useMemo(() => search(data, q, ['title', 'content', 'category']), [data, q])
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.title || !form.content) return toast.error('Fill required fields')
    setSaving(true)
    try {
      if (modal === 'add') {
        const created = await noticeService.createNotice(form)
        setData((prev) => [created, ...prev])
        toast.success('Notice posted!')
      } else {
        const updated = await noticeService.updateNotice(sel.id, form)
        setData((prev) => prev.map((n) => (n.id === sel.id ? updated : n)))
        toast.success('Updated!')
      }
      setModal(null)
    } catch (e) {
      toast.error(e?.message || 'Operation failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm) return
    setSaving(true)
    try {
      await noticeService.deleteNotice(confirm)
      setData((prev) => prev.filter((n) => n.id !== confirm))
      toast.success('Deleted')
      setConfirm(null)
    } catch (e) {
      toast.error(e?.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  const priorityColors = {
    High: 'border-l-red-400',
    Medium: 'border-l-amber-400',
    Low: 'border-l-blue-400',
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Notice Board</h1>
          <p className="text-sm text-gray-500">{data.length} notices published</p>
        </div>
        <button
          onClick={() => {
            setForm(BLANK)
            setModal('add')
          }}
          className="btn-primary"
          disabled={loading || saving}
        >
          <Plus size={15} />Post Notice
        </button>
      </div>

      <div className="card p-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search notices..." className="max-w-sm" />
      </div>

      <div className="space-y-3">
            {loading ? (
              <div className="card p-8 flex items-center justify-center">
                <Loader2 size={18} className="animate-spin text-primary-500" />
              </div>
            ) : error ? (
              <div className="card p-6">
                <EmptyState icon={Megaphone} title="Failed to load notices" desc={error} />
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setError(null)
                      setLoading(true)
                      fetchNotices()
                    }}
                    className="btn-primary"
                    disabled={loading}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card p-6">
                <EmptyState icon={Megaphone} title="No notices found" />
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className={`relative card overflow-hidden border border-white/40 dark:border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5`}
                  style={{
                    // gradient accent bar (priority)
                    borderLeftColor: 'transparent',
                  }}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${
                      n.priority === 'High'
                        ? 'bg-gradient-to-b from-rose-500 to-pink-500'
                        : n.priority === 'Medium'
                          ? 'bg-gradient-to-b from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-b from-cyan-500 to-blue-500'
                    }`}
                  />

                  <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10">
                            <StatusBadge status={n.priority} />
                          </span>
                          <span className="badge badge-info rounded-full px-3 py-1">{n.audience}</span>
                          <span className="badge badge-gray rounded-full px-3 py-1">{n.category}</span>
                        </div>

                        <h3 className="font-display font-bold text-gray-900 dark:text-white text-[1.05rem] leading-tight">
                          {n.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {n.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-3">
                          Posted by <span className="font-semibold">{n.postedBy}</span> · {fmt(n.date)}
                        </p>
                      </div>
                      <TableActions
                        onEdit={() => {
                          setForm({ ...n })
                          setSel(n)
                          setModal('edit')
                        }}
                        onDelete={() => setConfirm(n.id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>

      <Modal
        open={modal === 'add' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Post Notice' : 'Edit Notice'}
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Title" required>
            <input className="input" value={form.title} onChange={(e) => f('title', e.target.value)} />
          </FormField>
          <FormField label="Content" required>
            <textarea
              className="input"
              rows={4}
              value={form.content}
              onChange={(e) => f('content', e.target.value)}
            />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Priority">
              <select className="input" value={form.priority} onChange={(e) => f('priority', e.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </FormField>
            <FormField label="Audience">
              <select className="input" value={form.audience} onChange={(e) => f('audience', e.target.value)}>
                <option>All</option>
                <option>Students</option>
                <option>Teachers</option>
              </select>
            </FormField>
            <FormField label="Category">
              <select className="input" value={form.category} onChange={(e) => f('category', e.target.value)}>
                {['General', 'Event', 'Exam', 'Meeting', 'Holiday', 'Training'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
          <button onClick={save} className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              modal === 'add' ? 'Post Notice' : 'Update Notice'
            )}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Delete Notice"
        message="Delete this notice permanently?"
      />
    </div>
  )
}



