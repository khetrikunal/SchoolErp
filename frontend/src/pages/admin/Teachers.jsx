import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { teachers as init } from '../../utils/data'
import { Avatar,StatusBadge,Modal,SearchInput,Pagination,TableActions,ConfirmDialog,EmptyState,FormField } from '../../components/ui'
import { fmt,search,paginate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { apiPost } from '../../services/api/apiClient'

const BLANK = {
  name: '',
  email: '',
  phone: '',
  gender: 'Female',
  subjects: '',
  classes: '',
  qualification: '',
  experience: '',
  joinDate: '',
  address: '',
  status: 'Active',
  // admin provisioning for login users
  role: 'TEACHER',
  password: '',
  confirmPassword: '',
}

export default function Teachers() {
  const [data, setData] = useState(init)

  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)
  const filtered = search(data, q, ['name','email','empId'])
  const { rows, total, pages } = paginate(filtered, page, 7)
  const f = (k,v) => setForm(p=>({...p,[k]:v}))

  const save = async () => {
    if (!form.name || !form.email) return toast.error('Name and email required')
    if (!form.password || form.password.length < 8) return toast.error('Password is required (min 8 chars)')
    if (!form.confirmPassword) return toast.error('Confirm password is required')
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')

    // payload must match backend TeacherRequest
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      role: form.role || 'TEACHER',
      password: form.password,
      confirmPassword: form.confirmPassword,

      qualification: form.qualification,
      experience: form.experience,
      joinDate: form.joinDate,
      address: form.address,
      status: form.status,
      subjects:
        typeof form.subjects === 'string'
          ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean)
          : form.subjects,
      classes:
        typeof form.classes === 'string'
          ? form.classes.split(',').map((s) => s.trim()).filter(Boolean)
          : form.classes,

      // optional fields used in DTO
      dateOfBirth: undefined,
      profilePhoto: undefined,
      division: form.division,
      assignedSubject: form.assignedSubject,
      assignedClass: form.assignedClass,
    }

    try {
      if (modal === 'add') {
        const res = await apiPost('/api/admin/teachers', payload)
        const created = res?.data ?? res
        toast.success('Teacher created!')
        // NOTE: backend creates empId/teacherId; UI currently expects local fields.
        // Keeping the existing UI behavior but showing minimal safe mapping.
        setData((prev) => [
          { ...payload, ...created, id: created?.id ?? Date.now(), empId: created?.teacherId ?? payload.email, assignedEventIds: [] },
          ...prev,
        ])
      } else {
        // update flow (password handled only on create in current backend)
        toast.success('Teacher update not wired for password provisioning in this UI')
        setModal(null)
        return
      }
      setModal(null)
      setSel(null)
    } catch (e) {
      toast.error(e?.message || 'Teacher creation failed')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-title">Teacher Management</h1><p className="text-sm text-gray-500">{data.length} teachers on staff</p></div>
        <button onClick={()=>{setForm(BLANK);setModal('add')}} className="btn-primary"><Plus size={15}/>Add Teacher</button>
      </div>
      <div className="card p-4"><SearchInput value={q} onChange={v=>{setQ(v);setPage(1)}} placeholder="Search teachers..." className="max-w-sm"/></div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Teacher','Emp ID','Subjects','Classes','Experience','Status','Actions'].map(h=><th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {rows.length===0 ? <tr><td colSpan={7}><EmptyState icon={Users} title="No teachers found"/></td></tr>
              : rows.map(t=>(
                <tr key={t.id} className="tr-hover">
                  <td className="td"><div className="flex items-center gap-3"><Avatar name={t.name} size="sm"/><div><p className="font-semibold text-gray-900 dark:text-white">{t.name}</p><p className="text-xs text-gray-400">{t.email}</p></div></div></td>
                  <td className="td"><span className="font-mono text-xs badge badge-gray">{t.empId}</span></td>
                  <td className="td"><div className="flex flex-wrap gap-1">{t.subjects.slice(0,2).map(s=><span key={s} className="badge badge-primary">{s}</span>)}</div></td>
                  <td className="td text-gray-500 text-xs">{t.classes?.join(', ')}</td>
                  <td className="td text-gray-500">{t.experience}</td>
                  <td className="td"><StatusBadge status={t.status}/></td>
                  <td className="td"><TableActions onView={()=>{setSel(t);setModal('view')}} onEdit={()=>{setForm({...t,subjects:t.subjects.join(', '),classes:(t.classes||[]).join(', ')});setSel(t);setModal('edit')}} onDelete={()=>setConfirm(t.id)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-3"><Pagination page={page} pages={pages} total={total} perPage={7} onPage={setPage}/></div>
      </div>

      <Modal open={modal==='add'||modal==='edit'} onClose={()=>setModal(null)} title={modal==='add'?'Add Teacher':'Edit Teacher'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required><input className="input" value={form.name} onChange={e=>f('name',e.target.value)}/></FormField>
          <FormField label="Email" required><input className="input" type="email" value={form.email} onChange={e=>f('email',e.target.value)}/></FormField>
          <FormField label="Phone"><input className="input" value={form.phone} onChange={e=>f('phone',e.target.value)}/></FormField>
          <FormField label="Gender"><select className="input" value={form.gender} onChange={e=>f('gender',e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></FormField>
          <FormField label="Subjects (comma separated)"><input className="input" value={form.subjects} onChange={e=>f('subjects',e.target.value)} placeholder="Math, Physics"/></FormField>
          <FormField label="Classes (comma separated)"><input className="input" value={form.classes} onChange={e=>f('classes',e.target.value)} placeholder="10-A, 10-B"/></FormField>
          <FormField label="Qualification"><input className="input" value={form.qualification} onChange={e=>f('qualification',e.target.value)}/></FormField>
          <FormField label="Experience"><input className="input" value={form.experience} onChange={e=>f('experience',e.target.value)} placeholder="5 years"/></FormField>
          <FormField label="Join Date"><input className="input" type="date" value={form.joinDate} onChange={e=>f('joinDate',e.target.value)}/></FormField>
          <FormField label="Status"><select className="input" value={form.status} onChange={e=>f('status',e.target.value)}><option>Active</option><option>Inactive</option></select></FormField>
          <FormField label="Address"><textarea className="input" rows={2} value={form.address} onChange={e=>f('address',e.target.value)}/></FormField>

          {/* User provisioning */}
          <FormField label="Role" required>
            <select className="input" value={form.role || 'TEACHER'} onChange={(e)=>f('role',e.target.value)}>
              <option value="TEACHER">TEACHER</option>
            </select>
          </FormField>
          <FormField label="Password" required>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e)=>f('password',e.target.value)}
              placeholder="Set password"
            />
          </FormField>
          <FormField label="Confirm Password" required>
            <input
              className="input"
              type="password"
              value={form.confirmPassword}
              onChange={(e)=>f('confirmPassword',e.target.value)}
              placeholder="Re-enter password"
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={()=>setModal(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save Teacher</button>
        </div>
      </Modal>

      <Modal open={modal==='view'} onClose={()=>setModal(null)} title="Teacher Profile">
        {sel && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-2xl">
              <Avatar name={sel.name} size="xl"/>
              <div><h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">{sel.name}</h3><p className="text-sm text-gray-500">{sel.empId}</p><StatusBadge status={sel.status}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Email',sel.email],['Phone',sel.phone],['Qualification',sel.qualification],['Experience',sel.experience],['Join Date',fmt(sel.joinDate)],['Gender',sel.gender]].map(([k,v])=>(
                <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{v||'—'}</p></div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"><p className="text-xs text-gray-400 mb-1.5">Subjects</p><div className="flex flex-wrap gap-1.5">{sel.subjects.map(s=><span key={s} className="badge badge-primary">{s}</span>)}</div></div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"><p className="text-xs text-gray-400 mb-1.5">Assigned Classes</p><div className="flex flex-wrap gap-1.5">{(sel.classes||[]).map(c=><span key={c} className="badge badge-info">{c}</span>)}</div></div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={()=>setConfirm(null)} onConfirm={()=>{setData(data.filter(t=>t.id!==confirm));setConfirm(null);toast.success('Teacher removed')}} title="Remove Teacher" message="Remove this teacher from the system?"/>
    </div>
  )
}
