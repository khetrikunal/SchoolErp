import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/ui/Avatar'
import Card from '../../components/ui/Card'
import { fmt } from '../../utils/helpers'

export default function StudentProfile() {
  const { user } = useAuth()
  return (
    <div className="space-y-5 max-w-2xl">
      <div><h1 className="page-title">My Profile</h1></div>
      <Card>
        <div className="flex items-center gap-5 mb-6">
          <Avatar name={user?.name} size="xl" />
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500">Roll No: <span className="font-semibold text-gray-700 dark:text-gray-300">{user?.rollNo}</span></p>
            <span className="badge badge-success mt-1">Active Student</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['Email', user?.email], ['Phone', user?.phone], ['Class', user?.class], ['Section', user?.section], ['Admission Year', user?.admissionYear], ['Parent / Guardian', user?.parentName]].map(([k, v]) => (
            <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <p className="text-xs text-gray-400 mb-0.5">{k}</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{v || '—'}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
