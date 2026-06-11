import { useState } from 'react'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { quotations as init, events } from '../../utils/data'
import { useAuth } from '../../context/AuthContext'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal, FormField, ConfirmDialog, EmptyState } from '../../components/ui'
import { fmt, currency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BLANK_ITEM = { material: '', quantity: 1, unit: 'Pcs', unitCost: 0, vendor: '' }

export default function TeacherQuotations() {
  const { user } = useAuth()
  const myData = init.filter(q => q.teacherId === user?.id)
  const [data, setData] = useState(myData)
  const [modal, setModal] = useState(false)
  const [sel, setSel] = useState(null)
  const myEvents = events.filter(e => (e.assignedTeacherIds || []).includes(user?.id))

  const [form, setForm] = useState({ eventId: '', title: '', notes: '', vendorDetails: '', items: [{ ...BLANK_ITEM }] })

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...BLANK_ITEM }] }))
  const removeItem = idx => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  const updateItem = (idx, k, v) => setForm(f => { const items = [...f.items]; items[idx] = { ...items[idx], [k]: v, total: k === 'quantity' || k === 'unitCost' ? (k === 'quantity' ? v : items[idx].quantity) * (k === 'unitCost' ? v : items[idx].unitCost) : items[idx].total }; return { ...f, items } })

  const total = form.items.reduce((s, i) => s + (Number(i.quantity) * Number(i.unitCost)), 0)
  const ev = myEvents.find(e => e.id === Number(form.eventId))

  const save = () => {
    if (!form.eventId || !form.title) return toast.error('Select event and add a title')
    const items = form.items.map(i => ({ ...i, quantity: Number(i.quantity), unitCost: Number(i.unitCost), total: Number(i.quantity) * Number(i.unitCost) }))
    setData([...data, { ...form, id: Date.now(), eventId: Number(form.eventId), eventName: ev?.name || '', teacherId: user.id, teacherName: user.name, status: 'Pending', totalAmount: total, createdAt: new Date().toISOString().split('T')[0], adminRemarks: '', items }])
    toast.success('Quotation submitted!'); setModal(false)
    setForm({ eventId: '', title: '', notes: '', vendorDetails: '', items: [{ ...BLANK_ITEM }] })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Event Quotations</h1><p className="text-sm text-gray-500">Submit expenditure estimates to admin</p></div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={15} />Create Quotation</button>
      </div>

      {data.length === 0
        ? <div className="card p-8"><EmptyState icon={FileText} title="No quotations yet" desc="Create your first event quotation" /></div>
        : <div className="space-y-3">{data.map(q => (
          <div key={q.id} className="card hover:shadow-lg transition-all cursor-pointer" onClick={() => setSel(q)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-info">{q.eventName}</span>
                  <StatusBadge status={q.status} />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white">{q.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{q.items.length} items · <span className="font-bold text-primary-600 dark:text-primary-400">{currency(q.totalAmount)}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">Submitted: {fmt(q.createdAt)}</p>
                {q.adminRemarks && <p className="text-xs text-gray-500 mt-1 bg-gray-50 dark:bg-gray-700/40 px-2 py-1 rounded-lg">Admin: {q.adminRemarks}</p>}
              </div>
            </div>
          </div>
        ))}</div>
      }

      {/* Create Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Create Event Quotation" size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Event" required>
              <select className="input" value={form.eventId} onChange={e => setForm(f => ({ ...f, eventId: e.target.value }))}>
                <option value="">Select Event</option>
                {myEvents.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </FormField>
            <FormField label="Quotation Title" required><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></FormField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Line Items</label>
              <button onClick={addItem} className="text-xs text-primary-600 hover:text-primary-700 font-semibold">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <input className="input col-span-2" placeholder="Material/Item" value={item.material} onChange={e => updateItem(idx, 'material', e.target.value)} />
                  <input className="input" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                  <input className="input" type="number" placeholder="Unit Cost ₹" value={item.unitCost} onChange={e => updateItem(idx, 'unitCost', e.target.value)} />
                  <div className="flex gap-1">
                    <input className="input flex-1" placeholder="Vendor" value={item.vendor} onChange={e => updateItem(idx, 'vendor', e.target.value)} />
                    {form.items.length > 1 && <button onClick={() => removeItem(idx)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-2">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total: </span>
              <span className="text-lg font-display font-bold text-primary-600 dark:text-primary-400">{currency(total)}</span>
            </div>
          </div>

          <FormField label="Vendor Details"><input className="input" value={form.vendorDetails} onChange={e => setForm(f => ({ ...f, vendorDetails: e.target.value }))} /></FormField>
          <FormField label="Notes"><textarea className="input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Submit Quotation</button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={!!sel} onClose={() => setSel(null)} title="Quotation Details" size="lg">
        {sel && (
          <div className="space-y-3">
            <div className="flex items-center gap-2"><span className="badge badge-info">{sel.eventName}</span><StatusBadge status={sel.status} /></div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">{sel.title}</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead><tr>{['Material', 'Qty', 'Unit Cost', 'Total', 'Vendor'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
                  {sel.items.map((item, i) => (
                    <tr key={i} className="tr-hover">
                      <td className="td font-semibold">{item.material}</td>
                      <td className="td">{item.quantity} {item.unit}</td>
                      <td className="td">{currency(item.unitCost)}</td>
                      <td className="td font-bold text-primary-600 dark:text-primary-400">{currency(item.total)}</td>
                      <td className="td text-gray-400 text-xs">{item.vendor}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-800/60">
                    <td colSpan={3} className="td text-right font-bold">Total:</td>
                    <td className="td font-bold text-primary-600 dark:text-primary-400 text-base">{currency(sel.totalAmount)}</td>
                    <td className="td"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {sel.adminRemarks && (
              <div
                className={`p-3 rounded-xl border ${
                  sel.status === 'Approved'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}
              >
                <p className="text-xs sm:text-sm font-bold leading-relaxed flex flex-wrap gap-2 items-center">
                  <span className="whitespace-nowrap">Admin Decision:</span>
                  <span className="flex-shrink-0"><StatusBadge status={sel.status} /></span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed break-words">
                  {sel.adminRemarks}
                </p>
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
  )
}
