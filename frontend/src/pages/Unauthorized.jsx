import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { EmptyState } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    // If user is not loaded yet, do nothing.
    if (loading) return
    if (!user) navigate('/login', { replace: true })
  }, [loading, user, navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <EmptyState
          icon={AlertTriangle}
          title="Unauthorized"
          message="You do not have permission to access this page."
          action={
            <button className="btn-primary w-full" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Go Back
            </button>
          }
        />
      </div>
    </div>
  )
}

