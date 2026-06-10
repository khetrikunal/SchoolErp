import { useEffect, useMemo, useState } from 'react'
import { Plus, GraduationCap } from 'lucide-react'
import { Avatar, StatusBadge, Modal, SearchInput, Pagination, TableActions, ConfirmDialog, EmptyState, FormField } from '../../components/ui'
import { fmt, search, paginate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { studentService } from '../../services/api/studentService'
import { classService } from '../../services/api/classService'

const BLANK = {
  name: '',
  email: '',
  phone: '',
  class: '',
  section: 'A',
  gender: 'Male',
  dob: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  address: '',
  admissionDate: '',
  academicYear: '',
  division: 'A',
  bloodGroup: '',
  emergencyContact: '',
  previousSchool: '',
  profilePhoto: '',
  admissionYear: new Date().getFullYear(),
  status: 'Active',
  password: '',
  confirmPassword: '',
}

function toFormFromApi(s) {
  return {
    id: s?.id,
    name: s?.name ?? s?.fullName ?? '',
    email: s?.email ?? '',
    phone: s?.phone ?? '',
    address: s?.address ?? '',
    parentName: s?.parentName ?? '',
    parentPhone: s?.parentPhone ?? '',
    parentEmail: s?.parentEmail ?? '',
    class: s?.className ?? s?.class ?? '',
    section: s?.section ?? s?.division ?? 'A',
    division: s?.division ?? s?.section ?? 'A',
    gender: s?.gender ?? 'Male',
    dob: s?.dateOfBirth ?? s?.dob ?? '',
    admissionYear: s?.admissionYear ?? new Date().getFullYear(),
    academicYear: s?.academicYear ?? '',
    admissionDate: s?.admissionDate ?? '',
    bloodGroup: s?.bloodGroup ?? '',
    emergencyContact: s?.emergencyContact ?? '',
    previousSchool: s?.previousSchool ?? '',
    profilePhoto: s?.profilePhoto ?? '',
    status: s?.status ?? 'Active',
  }
}

function toPayloadFromForm(form, mode) {
  const base = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
    parentName: form.parentName,
    parentPhone: form.parentPhone,
    parentEmail: form.parentEmail,
    className: form.class,
    section: form.section,
    gender: form.gender,
    dateOfBirth: form.dob || undefined,
    admissionYear: form.admissionYear,
    academicYear: form.academicYear || undefined,
    admissionDate: form.admissionDate || undefined,
    bloodGroup: form.bloodGroup || undefined,
    emergencyContact: form.emergencyContact || undefined,
    previousSchool: form.previousSchool || undefined,
    profilePhoto: form.profilePhoto || undefined,
    status: form.status || 'Active',
  }

  if (mode === 'add') {
    return {
      ...base,
      password: form.password || undefined,
      confirmPassword: form.confirmPassword || undefined,
    }
  }

  // edit: do not send passwords unless the backend explicitly expects it
  return base
}

export default function Students() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [cls, setCls] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [confirm, setConfirm] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [classes, setClasses] = useState([])
  const [classesLoading, setClassesLoading] = useState(false)
  const [classesError, setClassesError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await studentService.getAllAdminStudents()
        if (cancelled) return
        // StudentController returns ApiResponse.ok(studentService.getAllStudents(...))
        // so we accept either {content:...} or array. If backend is paged, we attempt to handle safely.
        if (Array.isArray(res)) {
          setData(res)
        } else if (res?.content && Array.isArray(res.content)) {
          setData(res.content)
        } else if (res?.data && Array.isArray(res.data)) {
          setData(res.data)
        } else {
          setData([])
        }
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || 'Failed to load students'
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

  useEffect(() => {
    let cancelled = false
    async function loadClasses() {
      setClassesLoading(true)
      setClassesError(null)
      try {
        const res = await classService.getAllAdminClasses()
        if (cancelled) return
        setClasses(Array.isArray(res) ? res : [])
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || 'Failed to load classes'
        setClassesError(msg)
        toast.error(msg)
      } finally {
        if (!cancelled) setClassesLoading(false)
      }
    }

    loadClasses()
    return () => {
      cancelled = true
    }
  }, [])

  const allClassOptions = useMemo(() => {
    // Preserve compatibility with existing UI which expects `className`
    // We list className values like "LKG", "10th" formats as present in backend payload.
    const options = classes
      .map((c) => c?.className ?? c?.name)
      .filter(Boolean)
    return Array.from(new Set(options)).sort()
  }, [classes])

  const divisionsForClass = useMemo(() => {
    // UI uses a single dropdown for section/division; we show A/B/C always if backend doesn't provide division.
    // This is safe and maintains backward compatibility.
    return ['A', 'B', 'C']
  }, [])

  const filtered = useMemo(() => {
    const normalized = data.map((s) => ({
      ...s,
      // compatibility with old UI keys
      class: s?.className ?? s?.class ?? '',
      rollNo: s?.rollNo ?? s?.studentId ?? '',
      fullName: s?.fullName ?? s?.name ?? '',
    }))
    return search(normalized.filter((s) => !cls || s.class === cls), q, ['name', 'email', 'rollNo', 'parentName', 'parentEmail'])
  }, [data, q, cls])

  const { rows, total, pages } = paginate(filtered, page, 8)

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.name || !form.email || !form.class) {
      toast.error('Fill required fields')
      return
    }

    if (modal === 'add') {
      if (form.password !== form.confirmPassword) {
        toast.error('Password and confirm password must match')
        return
      }
    }

    setSaving(true)
    try {
      const mode = modal === 'add' ? 'add' : 'edit'
      const payload = toPayloadFromForm(form, mode)

      if (modal === 'add') {
        const created = await studentService.createStudent(payload)
        setData((prev) => [created, ...prev])
        toast.success('Student added successfully!')
      } else {
        const updated = await studentService.updateStudent(sel?.id, payload)
        setData((prev) => prev.map((s) => (s.id === sel.id ? updated : s)))
        toast.success('Student updated!')
      }

      setModal(null)
      setSel(null)
      setForm(BLANK)
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
      await studentService.deleteStudent(confirm)
      setData((prev) => prev.filter((s) => s.id !== confirm))
      toast.success('Student deleted')
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
          <h1 className="page-title">Student Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{loading ? 'Loading...' : `${data.length} students enrolled`}</p>
        </div>
        <button
          onClick={() => {
            setForm(BLANK)
            setModal('add')
          }}
          className="btn-primary"
          disabled={loading || saving}
        >
          <Plus size={15} />Add Student
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1) }} placeholder="Search name, email, roll no..." className="flex-1" />
        <select value={cls} onChange={(e) => { setCls(e.target.value); setPage(1) }} className="input sm:w-36">
          <option value="">All Classes</option>
          {allClassOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card p-8 flex items-center justify-center">Loading students...</div>
      ) : error ? (
        <div className="card p-6">
          <EmptyState icon={GraduationCap} title="Failed to load students" desc={error} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-6">
          <EmptyState icon={GraduationCap} title="No students found" desc="Try adjusting your search or filters" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead>
                <tr>
                  {['Student', 'Student ID', 'Class', 'Parent', 'Phone', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
                {rows.map((s) => (
                  <tr key={s.id} className="tr-hover">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <span className="font-mono text-xs badge badge-info">{s.studentId ?? s.rollNo ?? '—'}</span>
                    </td>
                    <td className="td font-semibold">{s.className ?? s.class}</td>
                    <td className="td">{s.parentName}</td>
                    <td className="td text-gray-500">{s.phone}</td>
                    <td className="td"><StatusBadge status={s.status} /></td>
                    <td className="td">
                      <TableActions
                        onView={() => { setSel(s); setModal('view') }}
                        onEdit={() => { setSel(s); setForm({ ...toFormFromApi(s), password: '', confirmPassword: '' }); setModal('edit') }}
                        onDelete={() => setConfirm(s.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-3">
            <Pagination page={page} pages={pages} total={total} perPage={8} onPage={setPage} />
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Student' : 'Edit Student'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <input className="input" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Student name" />
          </FormField>
          <FormField label="Email" required>
            <input className="input" type="email" value={form.email} onChange={(e) => f('email', e.target.value)} placeholder="student@school.edu" />
          </FormField>

          <FormField label="Class" required>
            <select className="input" value={form.class} onChange={(e) => f('class', e.target.value)}>
              <option value="">Select Class</option>
              {allClassOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Division/Section">
            <select className="input" value={form.section ?? form.division} onChange={(e) => { f('section', e.target.value); f('division', e.target.value) }}>
              {divisionsForClass.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Gender">
            <select className="input" value={form.gender} onChange={(e) => f('gender', e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </FormField>

          <FormField label="Date of Birth">
            <input className="input" type="date" value={form.dob} onChange={(e) => f('dob', e.target.value)} />
          </FormField>

          <FormField label="Phone">
            <input className="input" value={form.phone} onChange={(e) => f('phone', e.target.value)} placeholder="10-digit number" />
          </FormField>

          <FormField label="Admission Year">
            <input className="input" type="number" value={form.admissionYear} onChange={(e) => f('admissionYear', e.target.value)} />
          </FormField>

          <FormField label="Parent Name">
            <input className="input" value={form.parentName} onChange={(e) => f('parentName', e.target.value)} />
          </FormField>

          <FormField label="Parent Phone">
            <input className="input" value={form.parentPhone} onChange={(e) => f('parentPhone', e.target.value)} />
          </FormField>

          <FormField label="Parent Email">
            <input className="input" type="email" value={form.parentEmail} onChange={(e) => f('parentEmail', e.target.value)} />
          </FormField>

          <FormField label="Address">
            <textarea className="input" rows={2} value={form.address} onChange={(e) => f('address', e.target.value)} />
          </FormField>

          {/* Compatibility: extra fields are included, but UI stays largely the same */}
          <FormField label="Blood Group">
            <input className="input" value={form.bloodGroup} onChange={(e) => f('bloodGroup', e.target.value)} />
          </FormField>

          <FormField label="Emergency Contact">
            <input className="input" value={form.emergencyContact} onChange={(e) => f('emergencyContact', e.target.value)} />
          </FormField>

          <FormField label="Previous School">
            <input className="input" value={form.previousSchool} onChange={(e) => f('previousSchool', e.target.value)} />
          </FormField>

          <FormField label="Academic Year">
            <input className="input" value={form.academicYear} onChange={(e) => f('academicYear', e.target.value)} />
          </FormField>

          <FormField label="Profile Photo URL">
            <input className="input" value={form.profilePhoto} onChange={(e) => f('profilePhoto', e.target.value)} placeholder="(optional)" />
          </FormField>

          {modal === 'add' && (
            <>
              <FormField label="Password" required>
                <input className="input" type="password" value={form.password} onChange={(e) => f('password', e.target.value)} />
              </FormField>
              <FormField label="Confirm Password" required>
                <input className="input" type="password" value={form.confirmPassword} onChange={(e) => f('confirmPassword', e.target.value)} />
              </FormField>
            </>
          )}

          <FormField label="Status">
            <select className="input" value={form.status} onChange={(e) => f('status', e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={() => setModal(null)} className="btn-secondary" disabled={saving}>Cancel</button>
          <button onClick={save} className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Student Profile">
        {sel && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-2xl">
              <Avatar name={sel.name} size="xl" />
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">{sel.name}</h3>
                <p className="text-sm text-gray-500">{sel.studentId ?? sel.rollNo ?? '—'} · Class {sel.className ?? sel.class}</p>
                <StatusBadge status={sel.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Email', sel.email],
                ['Phone', sel.phone],
                ['Gender', sel.gender],
                ['DOB', fmt(sel.dateOfBirth ?? sel.dob)],
                ['Admission Yr', sel.admissionYear],
                ['Parent', sel.parentName],
                ['Parent Ph', sel.parentPhone],
                ['Address', sel.address],
              ].map(([k, v]) => (
                <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 break-words">{v || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={onDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  )
}

