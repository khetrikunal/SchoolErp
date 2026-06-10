import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { homework } from '../../utils/data'
import { StatusBadge } from '../../components/ui/Badge'
import { fmt } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function StudentHomework() {
  const { user } = useAuth()
  const myClass = user?.class || '10-A'
  const myHomework = homework.filter(h => h.class === myClass)
  const [submitted, setSubmitted] = useState({})

  const submit = (id) => {
    setSubmitted(s => ({ ...s, [id]: true }))
    toast.success('Assignment submitted!')
  }

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Homework & Assignments</h1><p className="text-sm text-gray-500 dark:text-gray-400">{myHomework.length} assignments for Class {myClass}</p></div>
      {myHomework.length === 0
        ? <div className="card p-8 text-center"><p className="text-gray-400">No homework assigned</p></div>
        : <div className="space-y-3">{myHomework.map(hw => (
          <div key={hw.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge badge-primary">{hw.subject}</span>
                  <span className="text-xs text-gray-400">Due: {fmt(hw.dueDate)}</span>
                  {submitted[hw.id] && <span className="badge badge-success">✓ Submitted</span>}
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white">{hw.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{hw.description}</p>
                <p className="text-xs text-gray-400 mt-1">Assigned by {hw.createdBy} · {fmt(hw.createdAt)}</p>
              </div>
              {!submitted[hw.id] && (
                <button onClick={() => submit(hw.id)} className="btn-primary shrink-0">Submit</button>
              )}
            </div>
          </div>
        ))}</div>
      }
    </div>
  )
}
