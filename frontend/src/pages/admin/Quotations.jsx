import { useState } from 'react'
import { FileText, Check, X, MessageSquare } from 'lucide-react'
import { quotations as init } from '../../utils/data'
import { Avatar,StatusBadge,Modal,SearchInput } from '../../components/ui'
import { fmt,currency,search } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Quotations() {
  const [data, setData] = useState(init)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [remarks, setRemarks] = useState('')

  const filtered = search(data, q, ['eventName','teacherName','title']).filter(x=>!filter||x.status===filter)
  const counts = { Pending:data.filter(x=>x.status==='Pending').length, Approved:data.filter(x=>x.status==='Approved').length, Rejected:data.filter(x=>x.status==='Rejected').length }

  const updateStatus = (status) => {
    setData(data.map(x=>x.id===sel.id?{...x,status,adminRemarks:remarks}:x))
    toast.success(`Quotation ${status.toLowerCase()}!`); setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Quotation Management</h1><p className="text-sm text-gray-500">Review event expenditure quotations from teachers</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{label:'Pending Review',count:counts.Pending,style:'border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'},
          {label:'Approved',count:counts.Approved,style:'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'},
          {label:'Rejected',count:counts.Rejected,style:'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}].map(s=>(
          <div key={s.label} className={`card border-2 p-6 text-center ${s.style} flex flex-col justify-center`}>
            <p className="text-3xl font-display font-bold">{s.count}</p>
            <p className="text-sm font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search quotations..." className="flex-1"/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input sm:w-36">
          <option value="">All Status</option>
          {['Pending','Approved','Rejected'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length===0 ? <div className="card p-6"><EmptyStateInline/></div>
        : filtered.map(qn=>(
          <div key={qn.id} className="card hover:shadow-lg transition-all p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge badge-info">{qn.eventName}</span>
                  <StatusBadge status={qn.status}/>
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white break-words">{qn.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar name={qn.teacherName} size="sm"/>
                  <span className="text-sm text-gray-500">{qn.teacherName} · {fmt(qn.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{qn.items.length} line items · <span className="font-bold text-primary-600 dark:text-primary-400">{currency(qn.totalAmount)}</span></p>
                {qn.adminRemarks && <p className="text-xs text-gray-400 mt-1 bg-gray-50 dark:bg-gray-700/40 px-2 py-1 rounded-lg">Remark: {qn.adminRemarks}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={()=>{setSel(qn);setRemarks(qn.adminRemarks||'');setModal('view')}} className="btn-secondary text-xs">Review</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal==='view'} onClose={()=>setModal(null)} title="Review Quotation" size="xl">
        {sel && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[['Event',sel.eventName],['Teacher',sel.teacherName],['Submitted',fmt(sel.createdAt)],['Total',currency(sel.totalAmount)]].map(([k,v])=>(
                <div key={k} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl flex flex-col justify-center"><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-bold text-gray-800 dark:text-gray-200">{v}</p></div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Line Items</h4>
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700 table-auto">
                  <thead><tr>{['Material','Qty','Unit','Unit Cost','Total','Vendor'].map(h=><th key={h} className="th px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
                    {sel.items.map(item=>(
                      <tr key={item.id} className="tr-hover">
                        <td className="td px-4 py-3 whitespace-nowrap font-semibold">{item.material}</td>
                        <td className="td px-4 py-3 whitespace-nowrap">{item.quantity}</td>
                        <td className="td px-4 py-3 whitespace-nowrap text-gray-400">{item.unit}</td>
                        <td className="td px-4 py-3 whitespace-nowrap">{currency(item.unitCost)}</td>
                        <td className="td px-4 py-3 whitespace-nowrap font-bold text-primary-600 dark:text-primary-400">{currency(item.total)}</td>
                        <td className="td px-4 py-3 whitespace-nowrap text-gray-400 text-xs">{item.vendor}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-800/60">
                      <td colSpan={4} className="td px-4 py-3 whitespace-nowrap text-right font-bold">Grand Total:</td>
                      <td className="td px-4 py-3 whitespace-nowrap font-bold text-primary-600 dark:text-primary-400 text-base">{currency(sel.totalAmount)}</td>
                      <td className="td px-4 py-3 whitespace-nowrap"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {sel.notes && <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl"><p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Teacher Notes:</p><p className="text-sm text-gray-700 dark:text-gray-300">{sel.notes}</p></div>}
            {sel.status==='Pending' && (
              <>
                <div>
                  <label className="label flex items-center gap-1"><MessageSquare size={13}/>Admin Remarks</label>
                  <textarea className="input" rows={2} value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Add your remarks or reason for decision..."/>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>updateStatus('Approved')} className="btn-success flex-1"><Check size={15}/>Approve</button>
                  <button onClick={()=>updateStatus('Rejected')} className="btn-danger flex-1"><X size={15}/>Reject</button>
                </div>
              </>
            )}
            {sel.status!=='Pending' && (
              <div className={`p-3 rounded-xl border ${sel.status==='Approved'?'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700':'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
                <p className="text-sm font-bold">Decision: <StatusBadge status={sel.status}/></p>
                {sel.adminRemarks && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sel.adminRemarks}</p>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function EmptyStateInline() {
  return (
    <div className="text-center py-8">
      <FileText size={32} className="mx-auto text-gray-300 mb-2"/>
      <p className="font-semibold text-gray-500">No quotations found</p>
    </div>
  )
}
