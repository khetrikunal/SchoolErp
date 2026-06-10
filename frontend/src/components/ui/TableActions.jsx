import { Eye, Edit, Trash2 } from 'lucide-react'
export default function TableActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      {onView   && <button onClick={onView}   className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"><Eye   size={14}/></button>}
      {onEdit   && <button onClick={onEdit}   className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition"><Edit  size={14}/></button>}
      {onDelete && <button onClick={onDelete} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><Trash2 size={14}/></button>}
    </div>
  )
}
