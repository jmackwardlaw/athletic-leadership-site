// /hub/teacher/roster — all students + approved internship hours, CSV export.
import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import {
  getAllLogs,
  getEnrolledEmails,
  getStudents,
  setEnrolledEmails,
  updateStudentCredentials,
} from '../../lib/hub/db'
import { parseEmailList } from '../../lib/hub/roster'
import type { InternshipLog, UserProfile, WithId } from '../../lib/hub/types'
import { hoursLabel } from '../../lib/hub/format'
import { EmptyState, PageHeading, inputClass } from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

interface Row {
  uid: string
  name: string
  email: string
  approved: number
  pending: number
  nfhs: number
  lrl: number
}

export default function TeacherRoster() {
  const { settings } = useHubData()
  const [students, setStudents] = useState<WithId<UserProfile>[]>([])
  const [logs, setLogs] = useState<WithId<InternshipLog>[]>([])
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [enrolled, setEnrolled] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const [s, l, e] = await Promise.all([
        getStudents(),
        getAllLogs(),
        getEnrolledEmails(),
      ])
      if (!cancelled) {
        setStudents(s)
        setLogs(l)
        setEnrolled(e)
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
        nfhs: s.nfhsModulesComplete ?? 0,
        lrl: s.lrlCredentialsEarned ?? 0,
      }
    })
  }, [students, logs])

  // Writes the count immediately and patches local state, so the cell does not
  // snap back to the old value while the roster refetch is in flight.
  const saveCount = async (
    uid: string,
    field: 'nfhsModulesComplete' | 'lrlCredentialsEarned',
    raw: string
  ) => {
    const value = Math.max(0, Math.floor(Number(raw) || 0))
    setStudents((prev) =>
      prev.map((s) => (s.id === uid ? { ...s, [field]: value } : s))
    )
    try {
      await updateStudentCredentials(uid, { [field]: value })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] could not save credential count:', err)
      setSaveError('Could not save that count. Check your connection and try again.')
    }
  }

  const exportCsv = () => {
    const header = [
      'Name',
      'Email',
      'Approved Hours',
      'Pending Hours',
      'Required',
      'NFHS Modules',
      'LiM Credentials',
    ]
    const lines = rows.map((r) =>
      [r.name, r.email, r.approved, r.pending, required, r.nfhs, r.lrl]
        .map(csvCell)
        .join(',')
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

      {saveError && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-token">
          {saveError}
        </div>
      )}

      <EnrollmentPanel
        enrolled={enrolled}
        signedIn={rows.map((r) => r.email)}
        onSave={async (emails) => {
          setEnrolled(emails)
          await setEnrolledEmails(emails)
        }}
      />

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
                <th className="px-4 py-3 font-bold text-center">NFHS</th>
                <th className="px-4 py-3 font-bold text-center">LiM</th>
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
                    <td className="px-4 py-3 text-center">
                      <CountInput
                        value={r.nfhs}
                        max={settings?.nfhsModulesRequired}
                        onSave={(v) => saveCount(r.uid, 'nfhsModulesComplete', v)}
                        label={`NFHS modules for ${r.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CountInput
                        value={r.lrl}
                        max={settings?.lrlCredentialsRequired}
                        onSave={(v) => saveCount(r.uid, 'lrlCredentialsEarned', v)}
                        label={`Leader in Me credentials for ${r.name}`}
                      />
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

/**
 * The enrollment gate. An empty list means the gate is OFF and any account on
 * the school domain can sign in — that state is stated plainly rather than
 * left to be discovered.
 */
export function EnrollmentPanel({
  enrolled,
  signedIn,
  onSave,
}: {
  enrolled: string[]
  signedIn: string[]
  onSave: (emails: string[]) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(enrolled.join('\n'))
  }, [enrolled])

  const parsed = parseEmailList(draft)
  const on = enrolled.length > 0

  // Someone who signed in before the gate went up, and is not on the list.
  const strays = signedIn.filter(
    (e) => on && !enrolled.some((x) => x.trim().toLowerCase() === e.toLowerCase())
  )

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(parsed)
      setOpen(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] could not save enrollment list:', err)
      setError('Could not save the roster. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className={`mb-6 rounded-token border p-4 ${
        on
          ? 'border-white/10 bg-surface-sunken/50'
          : 'border-yellow-500/30 bg-yellow-500/10'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          {on ? (
            <>
              <span className="font-bold text-ink-primary">
                Enrollment restricted
              </span>
              <span className="text-ink-muted">
                {' '}
                — {enrolled.length} student{enrolled.length === 1 ? '' : 's'} may
                sign in.
              </span>
            </>
          ) : (
            <>
              <span className="font-bold text-yellow-200">
                Enrollment is not restricted
              </span>
              <span className="text-yellow-200/80">
                {' '}
                — anyone with a school Google account can sign in and see course
                content. Add your students to lock it down.
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn btn-outline !py-1.5 !px-3.5 !text-xs shrink-0"
        >
          {open ? 'Cancel' : on ? 'Edit list' : 'Add students'}
        </button>
      </div>

      {strays.length > 0 && (
        <p className="mt-3 text-xs text-yellow-200">
          {strays.length} account{strays.length === 1 ? '' : 's'} already signed in
          before being enrolled and {strays.length === 1 ? 'is' : 'are'} not on the
          list: {strays.join(', ')}. They lose access next time they sign in.
        </p>
      )}

      {open && (
        <div className="mt-4 space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={'student1@apps.anderson1.org\nstudent2@apps.anderson1.org'}
            className={`${inputClass} min-h-[180px] resize-y font-mono !text-[13px]`}
          />
          <p className="text-xs text-ink-muted">
            One per line or comma-separated — paste straight from a spreadsheet.
            Duplicates and stray text are cleaned up on save. You do not need to
            add yourself; staff bypass this list.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="btn btn-primary !text-xs disabled:opacity-60"
            >
              {saving
                ? 'Saving…'
                : `Save ${parsed.length} student${parsed.length === 1 ? '' : 's'}`}
            </button>
            {parsed.length === 0 && draft.trim().length > 0 && (
              <span className="text-xs text-yellow-200">
                No valid emails found — every line needs an @.
              </span>
            )}
            {parsed.length === 0 && draft.trim().length === 0 && enrolled.length > 0 && (
              <span className="text-xs text-yellow-200">
                Saving an empty list turns the restriction off.
              </span>
            )}
          </div>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      )}
    </div>
  )
}

/** Saves on blur rather than per keystroke, so typing "12" is one write. */
function CountInput({
  value,
  max,
  onSave,
  label,
}: {
  value: number
  max?: number
  onSave: (raw: string) => void
  label: string
}) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  return (
    <div className="flex items-center justify-center gap-1">
      <input
        type="number"
        min={0}
        max={max}
        inputMode="numeric"
        aria-label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== String(value)) onSave(draft)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
        className={`${inputClass} !w-16 !px-2 !py-1.5 text-center`}
      />
      {max ? <span className="text-xs text-ink-faint">/{max}</span> : null}
    </div>
  )
}

function csvCell(v: string | number): string {
  const s = String(v)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
