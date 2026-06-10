export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="text-center py-10 px-4">
      <div className="inline-flex w-14 h-14 rounded-2xl bg-gray-100/80 dark:bg-gray-700/60 items-center justify-center mb-3">

        <Icon size={24} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {desc && <p className="text-sm text-gray-400 mt-0.5">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}


