import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatusBadge } from '../../components/ui/Badge'
import { fmt } from '../../utils/helpers'
import { apiGet } from '../../services/api/apiClient'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StudentHomework() {
  const { user } = useAuth()
  const myClass = user?.class || ''
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(() => {
    try {
      const saved = localStorage.getItem(`submitted_hw_${user?.id || 'default'}`)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
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
    if (user) {
      loadHomework()
    }
  }, [user])

  const submit = (id) => {
    const nextSubmitted = { ...submitted, [id]: true }
    setSubmitted(nextSubmitted)
    localStorage.setItem(`submitted_hw_${user?.id || 'default'}`, JSON.stringify(nextSubmitted))
    toast.success('Assignment submitted successfully!')
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Homework & Assignments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data.length} assignments for Class {myClass || '—'}
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center"><p className="text-gray-400">Loading assignments...</p></div>
      ) : data.length === 0 ? (
        <div className="card p-8 text-center"><p className="text-gray-400">No homework assigned</p></div>
      ) : (
        <div className="space-y-3">
          {data.map(hw => (
            <div key={hw.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="badge badge-primary">{hw.subject}</span>
                    <span className="text-xs text-gray-400">Due: {fmt(hw.dueDate)}</span>
                    {submitted[hw.id] && <span className="badge badge-success">✓ Submitted</span>}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white break-words">{hw.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{hw.description}</p>
                  
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

                  <p className="text-xs text-gray-400 mt-2">Assigned by {hw.createdBy} · {fmt(hw.createdAt)}</p>
                </div>
                {!submitted[hw.id] && (
                  <button onClick={() => submit(hw.id)} className="btn-primary shrink-0">Submit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
