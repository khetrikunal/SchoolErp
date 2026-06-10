import { X } from 'lucide-react'
const SIZES = {sm:'max-w-sm',md:'max-w-lg',lg:'max-w-2xl',xl:'max-w-4xl'}
export default function Modal({ open, onClose, title, children, size='md' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm fade-in" onClick={onClose}/>
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full fade-up ${SIZES[size]}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"><X size={18} className="text-gray-500"/></button>
        </div>
        <div className="p-5 max-h-[78vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
