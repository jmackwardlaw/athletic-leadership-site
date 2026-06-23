// /hub/teacher/internship — approval queue. Phase 1 lets the teacher
// directly approve/reject (the supervisor magic-link flow arrives in Phase 3).
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getApprovalQueue,
  getStudents,
  teacherApproveLog,
  teacherRejectLog,
} from '../../lib/hub/db'
import type { InternshipLog, UserProfile, WithId } from '../../lib/hub/types'
import { formatDate, hoursLabel } from '../../lib/hub/format'
import { Card, EmptyState, PageHeading, StatusBadge, inputClass } from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

export default function TeacherInternship() {
  const { user } = useAuth()
  const [queue, setQueue] = useState<WithId<InternshipLog>[]>([])
  const [students, setStudents] = useState<WithId<UserProfile>[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const load = async () => {
    const [q, s] = await Promise.all([getApprovalQueue(), getStudents()])
    setQueue(q)
    setStudents(s)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await load()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const nameByUid = useMemo(() => {
    const m = new Map<string, string>()
    students.forEach((s) => m.set(s.id, s.displayName || s.email))
    return m
  }, [students])

  const act = async (id: string, approve: boolean) => {
    if (!user) return
    setBusyId(id)
    try {
      const note = notes[id]?.trim() || undefined
      if (approve) await teacherApproveLog(id, user.uid, note)
      else await teacherRejectLog(id, user.uid, note)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] approval action failed:', err)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <HubLoading />

  return (
    <div>
      <PageHeading eyebrow="Teacher" title="Internship Approvals" />

      {queue.length === 0 ? (
        <EmptyState>Nothing awaiting approval. Nice and clear.</EmptyState>
      ) : (
        <div className="space-y-4">
          {queue.map((log) => (
            <Card key={log.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-lg">
                    {nameByUid.get(log.studentUid) || 'Unknown student'}
                  </div>
                  <div className="text-sm text-ink-secondary mt-0.5">
                    {hoursLabel(log.hours)} hrs · {formatDate(log.date)} · {log.site}
                  </div>
                  <div className="text-xs text-ink-muted mt-1">
                    Supervisor: {log.supervisorName} ({log.supervisorEmail})
                  </div>
                  {log.description && (
                    <p className="mt-2 text-sm text-ink-secondary max-w-2xl">
                      {log.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={log.status} />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  type="text"
                  placeholder="Optional note to student…"
                  value={notes[log.id] || ''}
                  onChange={(e) =>
                    setNotes((n) => ({ ...n, [log.id]: e.target.value }))
                  }
                  className={`${inputClass} flex-1`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => act(log.id, true)}
                    disabled={busyId === log.id}
                    className="btn btn-primary !py-2 !px-4 !text-xs disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act(log.id, false)}
                    disabled={busyId === log.id}
                    className="btn btn-outline !py-2 !px-4 !text-xs disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
