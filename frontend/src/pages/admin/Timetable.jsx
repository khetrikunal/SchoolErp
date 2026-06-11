import { useCallback, useEffect, useMemo, useState } from 'react'
import { classService } from '../../services/api/classService'
import { apiGet, apiPost, apiPut, apiDelete } from '../../services/api/apiClient'


const PERIOD_TIMES = ['8:00–8:45', '8:45–9:30', '9:45–10:30', '10:30–11:15', '11:30–12:15', '12:15–1:00']
const SUBJ_COLORS = {
  'Mathematics': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Physics': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Chemistry': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'English': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Comp Sci': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Hindi': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Biology': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  'History': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function normalizeApiTimetable(payload) {
  const days = payload?.days
  if (!Array.isArray(days)) return []

  return days
    .map(d => ({
      day: d?.day,
      periods: Array.isArray(d?.periods) ? d.periods : [],
    }))
    .filter(d => d.day)
}

function toTimetableRequest(daysGrid) {
  // UI grid daysGrid: [{day, periods: [6]}]
  return {
    days: (daysGrid || []).map(d => ({
      day: d.day,
      periods: (d.periods || []).slice(0, 6),
    })),
  }
}

function defaultGridForDays() {
  return DAYS.map(day => ({
    day,
    periods: Array.from({ length: 6 }, () => ''),
  }))
}

export default function Timetable() {
  const [classes, setClasses] = useState([])
  const [classesLoading, setClassesLoading] = useState(true)
  const [classesError, setClassesError] = useState(null)

  const [selectedClassId, setSelectedClassId] = useState(null)
  const [ttLoading, setTtLoading] = useState(false)
  const [ttError, setTtError] = useState(null)

  const [grid, setGrid] = useState(defaultGridForDays())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const selectedClass = useMemo(() => {
    return classes.find(c => String(c.id) === String(selectedClassId)) || null
  }, [classes, selectedClassId])

  const loadClasses = useCallback(async () => {
    setClassesLoading(true)
    setClassesError(null)
    try {
      const res = await classService.getAllAdminClasses()
      setClasses(Array.isArray(res) ? res : [])

      // Select first class by default for backward UX
      const first = Array.isArray(res) && res.length ? res[0] : null
      if (first && selectedClassId == null) setSelectedClassId(first.id)
    } catch (e) {
      setClassesError(e?.message || 'Failed to load classes')
    } finally {
      setClassesLoading(false)
    }
  }, [selectedClassId])

  const loadTimetable = useCallback(async (classId) => {
    if (classId == null) return

    setTtLoading(true)
    setTtError(null)
    try {
      const payload = await apiGet(`/api/admin/timetables/classes/${classId}`)
      // Controller returns ApiResponse.ok(empty or payload)
      const data = payload?.data ?? payload
      const days = normalizeApiTimetable(data)

      if (days.length === 0) {
        setGrid(defaultGridForDays())
      } else {
        // Ensure exactly 5 days in UI, and 6 periods
        const dayMap = new Map(days.map(d => [d.day, d]))
        setGrid(
          DAYS.map(day => {
            const row = dayMap.get(day)
            const periods = Array.isArray(row?.periods) ? row.periods : []
            const normalized = Array.from({ length: 6 }, (_, i) => periods[i] || '')
            return { day, periods: normalized }
          })
        )
      }
    } catch (e) {
      setTtError(e?.response?.data?.message || e?.message || 'Failed to load timetable')
    } finally {
      setTtLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedClassId != null) loadTimetable(selectedClassId)
  }, [selectedClassId, loadTimetable])

  const handleSave = useCallback(async () => {
    if (selectedClassId == null) return

    setSaving(true)
    setSaveError(null)
    try {
      const req = toTimetableRequest(grid)

      // Use POST as create/upsert per backend controller
      await apiPost(`/api/admin/timetables/classes/${selectedClassId}`, req)
      // Refresh
      await loadTimetable(selectedClassId)
    } catch (e) {
      setSaveError(e?.response?.data?.message || e?.message || 'Failed to save timetable')
    } finally {
      setSaving(false)
    }
  }, [grid, loadTimetable, selectedClassId])

  const handleDelete = useCallback(async () => {
    if (selectedClassId == null) return

    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await apiDelete(`/api/admin/timetables/classes/${selectedClassId}`)
      setGrid(defaultGridForDays())
    } catch (e) {
      setDeleteError(e?.response?.data?.message || e?.message || 'Failed to delete timetable')
    } finally {
      setDeleteLoading(false)
    }
  }, [selectedClassId])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Class Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Weekly schedule view</p>
        </div>

        <div className="flex items-center gap-3">
          <div>
            {classesLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading classes…</div>
            ) : classesError ? (
              <div className="text-sm text-red-500">{classesError}</div>
            ) : (
              <select
                value={selectedClassId ?? ''}
                onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : null)}
                className="input w-60"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.className} - {c.division}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || selectedClassId == null}
            className="btn btn-primary"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteLoading || selectedClassId == null}
            className="btn btn-outline-danger"
          >
            {deleteLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {ttError ? <div className="text-sm text-red-500">{ttError}</div> : null}
      {saveError ? <div className="text-sm text-red-500">{saveError}</div> : null}
      {deleteError ? <div className="text-sm text-red-500">{deleteError}</div> : null}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          {ttLoading ? (
            <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading timetable…</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="th w-28">Day</th>
                  {PERIOD_TIMES.map((t, i) => (
                    <th key={i} className="th text-center">
                      <div>P{i + 1}</div>
                      <div className="text-[10px] font-normal text-gray-400 normal-case tracking-normal">{t}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
                {grid.map(row => (
                  <tr key={row.day} className="tr-hover">
                    <td className="td font-bold text-gray-800 dark:text-gray-200">{row.day}</td>
                    {row.periods.map((subj, i) => (
                      <td key={i} className="td text-center py-2">
                        <input
                          value={subj}
                          onChange={(e) => {
                            const v = e.target.value
                            setGrid(prev =>
                              prev.map(r =>
                                r.day !== row.day
                                  ? r
                                  : { ...r, periods: r.periods.map((p, idx) => (idx === i ? v : p)) }
                              )
                            )
                          }}
                          placeholder="Subject"
                          className="w-40 input input-sm text-center"
                        />
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${SUBJ_COLORS[subj] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                          >
                            {subj || '—'}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!classesLoading && classes.length === 0 ? (
        <div className="p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">No classes found. Create a class first.</div>
        </div>
      ) : null}
    </div>
  )
}

