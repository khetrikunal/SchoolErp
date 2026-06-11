import { useMemo, useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import { FormField } from '../../components/ui'
import { adminService } from '../../services/api/adminService'

export default function AdminManagement() {
  const BLANK = useMemo(
    () => ({ name: '', email: '', password: '', phone: '' }),
    []
  )

  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getErrorMessage = (err) => {
    // Axios error shapes
    const axiosMsg = err?.response?.data?.message || err?.response?.data?.error || err?.response?.data
    const networkMsg = err?.message
    return (typeof axiosMsg === 'string' && axiosMsg.trim())
      ? axiosMsg
      : (typeof networkMsg === 'string' && networkMsg.trim())
        ? networkMsg
        : 'Failed to create admin'
  }


  const [touched, setTouched] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email'

    if (!form.phone.trim()) e.phone = 'Mobile number is required'
    else if (!/^[0-9]{10,15}$/.test(form.phone.trim())) e.phone = 'Mobile must be 10 to 15 digits'

    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'

    return e
  }

  const errors = validate()

  const canSubmit = !loading && Object.keys(errors).length === 0

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setTouched({ name: true, email: true, phone: true, password: true })
    setError(null)

    const currentErrors = validate()
    if (Object.keys(currentErrors).length) {
      toast.error('Fix validation errors')
      return
    }

    setLoading(true)
    try {
      // Controller enforces ADMIN role; we do not rely on frontend-provided role.
      await adminService.createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })

      toast.success('Admin created successfully')
      setForm(BLANK)
      setTouched({})
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || 'Failed to create admin'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (key) => {
    const show = touched[key] && errors[key]
    return show ? 'border-red-500 focus:ring-red-500/20' : ''
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Admin Management</h1>
          <p className="text-sm text-gray-500">Create additional admin accounts</p>
        </div>
        <span className="badge badge-success self-start inline-flex items-center gap-2">
          <ShieldCheck size={16} /> Secure Admin Setup
        </span>
      </div>

      <Card className="p-5">
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</div> : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input
                className={`input ${fieldClass('name')}`}
                value={form.name}
                onChange={(e) => f('name', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                placeholder="e.g. Rahul Sharma"
              />
              {touched.name && errors.name ? <p className="text-xs text-red-600 mt-1">{errors.name}</p> : null}
            </FormField>

            <FormField label="Email" required>
              <input
                className={`input ${fieldClass('email')}`}
                value={form.email}
                onChange={(e) => f('email', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                placeholder="admin@example.com"
              />
              {touched.email && errors.email ? <p className="text-xs text-red-600 mt-1">{errors.email}</p> : null}
            </FormField>

            <FormField label="Mobile Number" required>
              <input
                className={`input ${fieldClass('phone')}`}
                value={form.phone}
                onChange={(e) => f('phone', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                placeholder="10-15 digits"
                inputMode="numeric"
              />
              {touched.phone && errors.phone ? <p className="text-xs text-red-600 mt-1">{errors.phone}</p> : null}
            </FormField>

            <FormField label="Password" required>
              <input
                className={`input ${fieldClass('password')}`}
                value={form.password}
                type="password"
                onChange={(e) => f('password', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                placeholder="Minimum 6 characters"
              />
              {touched.password && errors.password ? <p className="text-xs text-red-600 mt-1">{errors.password}</p> : null}
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2"
              disabled={!canSubmit}
            >
              {loading ? 'Creating...' : (
                <>
                  <Plus size={16} /> Create Admin
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

