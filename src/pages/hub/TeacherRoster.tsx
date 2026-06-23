// /hub/teacher/roster — all students + approved internship hours, CSV export.
import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import { getAllLogs, getStudents } from '../../lib/hub/db'
import type { InternshipLog, UserProfile, WithId } from '../../lib/hub/types'
import { hoursLabel } from '../../lib/hub/format'
import { EmptyState, PageHeading } from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

interface Row {
  uid: string
  name: string
  email: string
  approved: number
  pending: number
}

export default function TeacherRoster() {
  const { settings } = useHubData()
  const [students, setStudents] = useState<WithId<UserProfile>[]>([])
  const [logs, setLogs] = useState<WithId<InternshipLog>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const [s, l] = await Promise.all([getStudents(), getAllLogs()])
      if (!cancelled) {
        setStudents(s)
        setLogs(l)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const required = settings?.internshipHoursRequired ?? 0

  const rows = useMemo<Row[]>(() => {
    const byStudent = new Map<string, { approved: number; pending: number }>()
    for (const log of logs) {
      const agg = byStudent.get(log.studentUid) ?? { approved: 0, pending: 0 }
      const h = Number(log.hours) || 0
      if (log.status === 'teacher_approved') agg.approved += h
      else if (log.status === 'pending' || log.status === 'supervisor_approved')
        agg.pending += h
      byStudent.set(log.studentUid, agg)
    }
    return students.map((s) => {
      const agg = byStudent.get(s.id) ?? { approved: 0, pending: 0 }
      return {
        uid: s.id,
        name: s.displayName || s.email,
        email: s.email,
        approved: agg.approved,
        pending: agg.pending,
      }
    })
  }, [students, logs])

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Approved Hours', 'Pending Hours', 'Required']
    const lines = rows.map((r) =>
      [r.name, r.email, r.approved, r.pending, required].map(csvCell).join(',')
    )
    const csv = [header.join(','), ...lines].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `internship-hours-${settings?.termLabel || 'export'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <HubLoading />

  return (
    <div>
      <PageHeading eyebrow="Teacher" title="Roster">
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="btn btn-outline !py-2 !px-4 !text-xs disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </PageHeading>

      {rows.length === 0 ? (
        <EmptyState>No students have signed in yet.</EmptyState>
      ) : (
        <div className="card-dark overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-muted text-xs uppercase tracking-[0.1em] border-b border-white/10">
                <th className="px-4 py-3 font-bold">Student</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold text-right">Approved</th>
                <th className="px-4 py-3 font-bold text-right">Pending</th>
                <th className="px-4 py-3 font-bold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pct =
                  required > 0 ? Math.min(100, Math.round((r.approved / required) * 100)) : 0
                return (
                  <tr key={r.uid} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{r.email}</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {hoursLabel(r.approved)}
                      <span className="text-ink-faint font-normal"> / {hoursLabel(required)}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-ink-secondary">
                      {hoursLabel(r.pending)}
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="h-2 w-full rounded-full bg-surface-sunken overflow-hidden">
                        <div className="h-full bg-brand-red" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function csvCell(v: string | number): string {
  const s = String(v)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
