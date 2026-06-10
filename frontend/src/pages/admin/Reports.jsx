import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { chartAttendance, chartPerformance, chartEnrollment, students, teachers, classes, exams, events } from '../../utils/data'
import Card from '../../components/ui/Card'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Reports() {
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Reports & Analytics</h1><p className="text-sm text-gray-500 dark:text-gray-400">School performance overview</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[['Students', students.length, 'text-primary-600'], ['Teachers', teachers.length, 'text-emerald-600'], ['Classes', classes.length, 'text-amber-600'], ['Exams', exams.length, 'text-purple-600'], ['Events', events.length, 'text-rose-600'], ['Avg Attend.', '91.4%', 'text-blue-600']].map(([k, v, c]) => (
          <div key={k} className="card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${c}`}>{v}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartPerformance} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="avg" fill="#6366f1" name="Average" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highest" fill="#10b981" name="Highest" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Enrollment Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartEnrollment} cx="50%" cy="50%" outerRadius={80} dataKey="students" label={({ grade, students }) => `${grade}: ${students}`} labelLine={false}>
                {chartEnrollment.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Line type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Present %" />
              <Line type="monotone" dataKey="absent" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171', r: 3 }} name="Absent %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartPerformance} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="highest" fill="#10b981" name="Highest" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg" fill="#6366f1" name="Average" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowest" fill="#f87171" name="Lowest" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
