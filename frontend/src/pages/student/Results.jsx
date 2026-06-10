import { useAuth } from '../../context/AuthContext'
import { results } from '../../utils/data'
import Card from '../../components/ui/Card'

export default function StudentResults() {
  const { user } = useAuth()
  const myResults = results.filter(r => r.studentId === user?.id)
  const avg = myResults.length ? (myResults.reduce((s, r) => s + (r.marksObtained / r.maxMarks * 100), 0) / myResults.length).toFixed(1) : 0

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Exam Results</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center py-4"><p className="text-3xl font-display font-bold text-primary-600">{myResults.length}</p><p className="text-sm text-gray-500">Exams Taken</p></Card>
        <Card className="text-center py-4"><p className="text-3xl font-display font-bold text-emerald-600">{avg}%</p><p className="text-sm text-gray-500">Average Score</p></Card>
        <Card className="text-center py-4"><p className="text-3xl font-display font-bold text-amber-600">{myResults.filter(r => r.grade === 'A+' || r.grade === 'A').length}</p><p className="text-sm text-gray-500">A / A+ Grades</p></Card>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead><tr>{['Exam', 'Subject', 'Marks', 'Grade', 'Remarks'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {myResults.length === 0
                ? <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No results available yet</td></tr>
                : myResults.map(r => (
                  <tr key={r.id} className="tr-hover">
                    <td className="td font-semibold text-gray-900 dark:text-white">{r.examName}</td>
                    <td className="td">{r.subject}</td>
                    <td className="td">
                      <span className="font-bold">{r.marksObtained}</span>
                      <span className="text-gray-400">/{r.maxMarks}</span>
                      <span className="text-xs text-gray-400 ml-1">({((r.marksObtained / r.maxMarks) * 100).toFixed(0)}%)</span>
                    </td>
                    <td className="td"><span className="badge badge-success">{r.grade}</span></td>
                    <td className="td text-gray-500">{r.remarks}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
