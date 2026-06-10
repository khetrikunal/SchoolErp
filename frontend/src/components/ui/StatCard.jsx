const COLORS = {
  primary:'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  emerald:'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  amber:'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  rose:'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  blue:'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  purple:'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
}
export default function StatCard({ icon:Icon, label, value, sub, color='primary' }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${COLORS[color]}`}><Icon size={22}/></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
