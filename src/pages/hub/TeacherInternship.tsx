// /hub/teacher/internship — approval queue. Phase 1 lets the teacher
// directly approve/reject (the supervisor magic-link flow arrives in Phase 3).
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  bulkCreateApprovedLogs,
  getApprovalQueue,
  getStudents,
  teacherApproveLog,
  teacherRejectLog,
} from '../../lib/hub/db'
import type { InternshipLog, UserProfile, WithId } from '../../lib/hub/types'
import {
  dateInputToTimestamp,
  formatDate,
  hoursLabel,
  todayInput,
} from '../../lib/hub/format'
import {
  Card,
  EmptyState,
  Field,
  PageHeading,
  SectionTitle,
  StatusBadge,
  inputClass,
} from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

/**
 * Logs one class work day to many students at once, already approved. Everyone
 * is selected by default because the common case is "the whole class was
 * here" — absences are the exception, so unticking two is less work than
 * ticking nineteen.
 */
function WorkDayPanel({
  students,
  onDone,
}: {
  students: WithId<UserProfile>[]
  onDone: () => Promise<void>
}) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(todayInput())
  const [hours, setHours] = useState('1.5')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  // Default to everyone whenever the roster loads or the panel reopens.
  useEffect(() => {
    setSelected(new Set(students.map((s) => s.id)))
  }, [students, open])

  const toggle = (uid: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(uid)) next.delete(uid)
      else next.add(uid)
      return next
    })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const hoursNum = Number(hours)
    if (!date) return setError('Pick the date of the work day.')
    if (!hoursNum || hoursNum <= 0) return setError('Enter how many hours it was.')
    if (selected.size === 0) return setError('Select at least one student.')

    setSaving(true)
    setError(null)
    try {
      const count = await bulkCreateApprovedLogs(
        [...selected],
        {
          date: dateInputToTimestamp(date),
          hours: hoursNum,
          site: 'Palmetto High School — class work day',
          supervisorName: user.displayName || 'Coach Wardlaw',
          supervisorEmail: (user.email || '').toLowerCase(),
          description: description.trim() || 'In-class work day',
        },
        user.uid
      )
      setDone(
        `Logged ${hoursLabel(hoursNum)} hrs to ${count} student${count === 1 ? '' : 's'}.`
      )
      setDescription('')
      setOpen(false)
      await onDone()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] bulk work day failed:', err)
      setError('Could not log the work day. Nothing was saved — try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SectionTitle>Class Work Day</SectionTitle>
        {!open && (
          <button
            onClick={() => {
              setOpen(true)
              setDone(null)
            }}
            className="btn btn-primary !py-2 !px-4 !text-xs"
          >
            <CalendarPlus className="w-4 h-4" /> Log Work Day
          </button>
        )}
      </div>

      {done && !open && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-token">
          {done}
        </div>
      )}

      {open && (
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date" required>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Hours each" required>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  inputMode="decimal"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="What the class did">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
                placeholder="e.g. Set up and ran the JV volleyball gate"
              />
            </Field>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary">
                  Students ({selected.size} of {students.length})
                </span>
                <div className="flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelected(new Set(students.map((s) => s.id)))}
                    className="text-ink-muted hover:text-white underline"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(new Set())}
                    className="text-ink-muted hover:text-white underline"
                  >
                    None
                  </button>
                </div>
              </div>
              {students.length === 0 ? (
                <p className="text-xs text-ink-muted">No students have signed in yet.</p>
              ) : (
                <div className="max-h-56 overflow-y-auto rounded-token border border-white/10 bg-surface-sunken p-2 grid sm:grid-cols-2 gap-1">
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggle(s.id)}
                        className="accent-[#d81300]"
                      />
                      <span className="truncate">{s.displayName || s.email}</span>
                    </label>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-ink-muted">
                These land already approved — untick anyone who was absent.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-token">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary !text-xs disabled:opacity-60"
              >
                {saving ? 'Logging…' : `Log to ${selected.size} student${selected.size === 1 ? '' : 's'}`}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-outline !text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

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

      <WorkDayPanel students={students} onDone={load} />

      <SectionTitle>Awaiting Approval</SectionTitle>

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
