import { useState } from 'react'
import { Menu, Bell, X, Search } from 'lucide-react'
import Sidebar from './Sidebar'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 fade-in" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50 slide-in">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <Menu size={20} className="text-gray-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-400 text-sm cursor-text">
              <Search size={15} />
              <span>Quick search...</span>
            </div>
          </div>
          <div className="hidden lg:block text-sm text-gray-500 dark:text-gray-400 absolute left-1/2 -translate-x-1/2">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name?.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Avatar name={user?.name} size="sm" />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-6">
          <div className="fade-up max-w-screen-2xl mx-auto min-w-0">{children}</div>
        </main>

      </div>
    </div>
  )
}
