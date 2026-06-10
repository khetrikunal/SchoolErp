import { useState } from 'react'
import { Plus,Trophy,Calendar,MapPin,DollarSign,Users } from 'lucide-react'
import { events as init, teachers } from '../../utils/data'
import { Avatar,StatusBadge,Modal,SearchInput,TableActions,ConfirmDialog,EmptyState,FormField } from '../../components/ui'
import { fmt,currency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BLANK = { name:'',type:'Cultural',date:'',time:'',venue:'',description:'',budget:'',status:'Planning',assignedTeacherIds:[] }
const TYPES = ['Cultural','Sports','Academic','Seminar','Workshop','Competition','Other']
const TYPE_COLORS = { Cultural:'bg-purple-100 text-purple-700',Sports:'bg-blue-100 text-blue-700',Academic:'bg-emerald-100 text-emerald-700',Seminar:'bg-amber-100 text-amber-700',Workshop:'bg-rose-100 text-rose-700',Competition:'bg-cyan-100 text-cyan-700',Other:'bg-gray-100 text-gray-700' }

export default function Events() {
  const [data, setData] = useState(init)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)

  const filtered = data.filter(e=>e.name.toLowerCase().includes(q.toLowerCase()))
  const f = (k,v) => setForm(p=>({...p,[k]:v}))
  const toggleTeacher = id => setForm(p=>({...p,assignedTeacherIds:p.assignedTeacherIds.includes(id)?p.assignedTeacherIds.filter(t=>t!==id):[...p.assignedTeacherIds,id]}))

  const save = () => {
    if (!form.name||!form.date) return toast.error('Event name and date required')
    if (modal==='add') { setData([...data,{...form,id:Date.now(),budget:Number(form.budget)||0}]); toast.success('Event created!') }
    else { setData(data.map(e=>e.id===sel.id?{...sel,...form,budget:Number(form.budget)}:e)); toast.success('Updated!') }
    setModal(null)
  }

  const saveAccess = () => {
    setData(data.map(e=>e.id===sel.id?{...e,assignedTeacherIds:form.assignedTeacherIds}:e))
    toast.success('Access updated!'); setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Event Management</h1><p className="text-sm text-gray-500">{data.length} events · Teacher access control</p></div>
        <button onClick={()=>{setForm(BLANK);setModal('add')}} className="btn-primary"><Plus size={15}/>Create Event</button>
      </div>
      <div className="card p-4"><SearchInput value={q} onChange={setQ} placeholder="Search events..." className="max-w-sm"/></div>

      {filtered.length===0 ? <div className="card p-6"><EmptyState icon={Trophy} title="No events found"/></div>
      : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(ev=>{
            const assigned = teachers.filter(t=>(ev.assignedTeacherIds||[]).includes(t.id))
            return (
              <div key={ev.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[ev.type]||TYPE_COLORS.Other}`}>{ev.type}</span>
                  <StatusBadge status={ev.status}/>
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mt-1 mb-2">{ev.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{ev.description}</p>
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary-500"/><span>{fmt(ev.date)} · {ev.time}</span></div>
                  <div className="flex items-center gap-1.5"><MapPin size={12} className="text-emerald-500"/><span>{ev.venue}</span></div>
                  <div className="flex items-center gap-1.5"><DollarSign size={12} className="text-amber-500"/><span>Budget: {currency(ev.budget)}</span></div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                  <p className="text-xs text-gray-400 mb-1.5">Assigned Teachers ({assigned.length})</p>
                  {assigned.length===0 ? <p className="text-xs text-gray-400 italic">No teachers assigned</p>
                  : <div className="flex -space-x-2">{assigned.map(t=><div key={t.id} title={t.name}><Avatar name={t.name} size="sm"/></div>)}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>{setSel(ev);setModal('view')}} className="btn-secondary flex-1 text-xs py-1.5">Details</button>
                  <button onClick={()=>{setSel(ev);setForm({...ev});setModal('access')}} className="btn-primary flex-1 text-xs py-1.5"><Users size={12}/>Access</button>
                  <button onClick={()=>{setSel(ev);setForm({...ev,budget:ev.budget});setModal('edit')}} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      }

      {/* Create/Edit Modal */}
      <Modal open={modal==='add'||modal==='edit'} onClose={()=>setModal(null)} title={modal==='add'?'Create Event':'Edit Event'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Event Name" required><input className="input" value={form.name} onChange={e=>f('name',e.target.value)} placeholder="Annual Sports Day"/></FormField>
          <FormField label="Type"><select className="input" value={form.type} onChange={e=>f('type',e.target.value)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></FormField>
          <FormField label="Date" required><input className="input" type="date" value={form.date} onChange={e=>f('date',e.target.value)}/></FormField>
          <FormField label="Time"><input className="input" type="time" value={form.time} onChange={e=>f('time',e.target.value)}/></FormField>
          <FormField label="Venue"><input className="input" value={form.venue} onChange={e=>f('venue',e.target.value)}/></FormField>
          <FormField label="Budget (₹)"><input className="input" type="number" value={form.budget} onChange={e=>f('budget',e.target.value)}/></FormField>
          <FormField label="Status"><select className="input" value={form.status} onChange={e=>f('status',e.target.value)}>{['Planning','Upcoming','Ongoing','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}</select></FormField>
          <FormField label="Description"><textarea className="input" rows={2} value={form.description} onChange={e=>f('description',e.target.value)}/></FormField>
        </div>
        <div className="mt-4">
          <p className="label">Assign Teachers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {teachers.map(t=>{
              const chk = (form.assignedTeacherIds||[]).includes(t.id)
              return (
                <label key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${chk?'border-primary-500 bg-primary-50 dark:bg-primary-900/20':'border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}>
                  <input type="checkbox" checked={chk} onChange={()=>toggleTeacher(t.id)} className="rounded text-primary-600 w-4 h-4"/>
                  <Avatar name={t.name} size="sm"/>
                  <div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p><p className="text-xs text-gray-400">{t.subjects.slice(0,2).join(', ')}</p></div>
                </label>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save Event</button>
        </div>
      </Modal>

      {/* Access Management Modal */}
      <Modal open={modal==='access'} onClose={()=>setModal(null)} title={`Manage Access — ${sel?.name}`} size="md">
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-4 text-sm text-amber-700 dark:text-amber-300">
          ⚠️ Only selected teachers will see this event in their Teacher Panel.
        </div>
        <div className="space-y-2">
          {teachers.map(t=>{
            const chk = (form.assignedTeacherIds||[]).includes(t.id)
            return (
              <label key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${chk?'border-primary-500 bg-primary-50 dark:bg-primary-900/20':'border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}>
                <input type="checkbox" checked={chk} onChange={()=>toggleTeacher(t.id)} className="rounded text-primary-600 w-4 h-4"/>
                <Avatar name={t.name} size="sm"/>
                <div className="flex-1"><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p><p className="text-xs text-gray-400">{t.empId} · {t.subjects.join(', ')}</p></div>
                {chk && <span className="badge badge-success">Assigned</span>}
              </label>
            )
          })}
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={saveAccess} className="btn-primary">Update Access</button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={modal==='view'} onClose={()=>setModal(null)} title="Event Details" size="md">
        {sel && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl text-white">
              <span className="text-xs opacity-70 uppercase tracking-wider">{sel.type}</span>
              <h3 className="text-xl font-display font-bold mt-0.5">{sel.name}</h3>
              <StatusBadge status={sel.status}/>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-xl">{sel.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Date',fmt(sel.date)],['Time',sel.time],['Venue',sel.venue],['Budget',currency(sel.budget)]].map(([k,v])=>(
                <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-bold text-gray-800 dark:text-gray-200">{v}</p></div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Assigned Teachers</p>
              {teachers.filter(t=>(sel.assignedTeacherIds||[]).includes(t.id)).map(t=>(
                <div key={t.id} className="flex items-center gap-2 mb-1.5"><Avatar name={t.name} size="sm"/><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.name}</span><span className="text-xs text-gray-400">{t.empId}</span></div>
              ))}
              {!(sel.assignedTeacherIds?.length) && <p className="text-sm text-gray-400 italic">No teachers assigned yet</p>}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={()=>setConfirm(null)} onConfirm={()=>{setData(data.filter(e=>e.id!==confirm));setConfirm(null);toast.success('Event deleted')}} title="Delete Event" message="Delete this event permanently?"/>
    </div>
  )
}
