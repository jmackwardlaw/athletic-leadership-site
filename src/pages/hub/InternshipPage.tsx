// /hub/internship — student internship hours log + history.
import { useEffect, useState, type FormEvent } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import {
  approvedHours,
  createInternshipLog,
  getStudentLogs,
} from '../../lib/hub/db'
import type { InternshipLog, WithId } from '../../lib/hub/types'
import { formatDate, hoursLabel } from '../../lib/hub/format'
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

interface FormState {
  date: string
  hours: string
  site: string
  supervisorName: string
  supervisorEmail: string
  description: string
}

const emptyForm: FormState = {
  date: '',
  hours: '',
  site: '',
  supervisorName: '',
  supervisorEmail: '',
  description: '',
}

export default function InternshipPage() {
  const { user } = useAuth()
  const { settings } = useHubData()
  const [logs, setLogs] = useState<WithId<InternshipLog>[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    if (!user) return
    setLogs(await getStudentLogs(user.uid))
  }

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const l = await getStudentLogs(user.uid)
      if (!cancelled) {
        setLogs(l)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleChange = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSuccess(false)

    const hoursNum = Number(form.hours)
    if (!form.date) return setError('Please pick the date you worked.')
    if (!hoursNum || hoursNum <= 0) return setError('Enter a valid number of hours.')
    if (!form.site.trim()) return setError('Where did you work? (site)')
    if (!form.supervisorName.trim()) return setError('Supervisor name is required.')
    if (!form.supervisorEmail.trim()) return setError('Supervisor email is required.')

    setSubmitting(true)
    try {
      // Parse the yyyy-mm-dd as a local date (noon) to avoid TZ rollbacks.
      const [y, m, d] = form.date.split('-').map(Number)
      const worked = new Date(y, m - 1, d, 12, 0, 0)
      await createInternshipLog({
        studentUid: user.uid,
        date: Timestamp.fromDate(worked),
        hours: hoursNum,
        site: form.site.trim(),
        supervisorName: form.supervisorName.trim(),
        supervisorEmail: form.supervisorEmail.trim().toLowerCase(),
        description: form.description.trim(),
      })
      setForm(emptyForm)
      setSuccess(true)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] log hours failed:', err)
      setError('Could not save your hours. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <HubLoading />

  const required = settings?.internshipHoursRequired ?? 0
  const approved = approvedHours(logs)
  const pending = logs
    .filter((l) => l.status === 'pending' || l.status === 'supervisor_approved')
    .reduce((s, l) => s + (Number(l.hours) || 0), 0)

  return (
    <div>
      <PageHeading eyebrow="Internship" title="Internship Hours" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Log form */}
        <div className="lg:col-span-2">
          <SectionTitle>Log Hours</SectionTitle>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Date worked" required>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Hours" required>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  inputMode="decimal"
                  value={form.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2.5"
                />
              </Field>
              <Field label="Site / location" required>
                <input
                  type="text"
                  value={form.site}
                  onChange={(e) => handleChange('site', e.target.value)}
                  className={inputClass}
                  placeholder="Where you worked"
                />
              </Field>
              <Field label="Supervisor name" required>
                <input
                  type="text"
                  value={form.supervisorName}
                  onChange={(e) => handleChange('supervisorName', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Supervisor email" required>
                <input
                  type="email"
                  value={form.supervisorEmail}
                  onChange={(e) => handleChange('supervisorEmail', e.target.value)}
                  className={inputClass}
                  placeholder="name@organization.org"
                />
              </Field>
              <Field label="What did you do?">
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="Briefly describe your work"
                />
              </Field>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-token">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-token">
                  Hours submitted — pending teacher approval.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Hours'}
              </button>
            </form>
          </Card>
        </div>

        {/* History */}
        <div className="lg:col-span-3">
          <SectionTitle>Your History</SectionTitle>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <Stat label="Approved" value={`${hoursLabel(approved)}`} />
            <Stat label="Pending" value={`${hoursLabel(pending)}`} />
            <Stat label="Required" value={`${hoursLabel(required)}`} />
          </div>

          {logs.length === 0 ? (
            <EmptyState>No hours logged yet. Use the form to add your first entry.</EmptyState>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Card key={log.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold">
                        {hoursLabel(log.hours)} hrs · {log.site}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {formatDate(log.date)} · Supervisor: {log.supervisorName}
                      </div>
                      {log.description && (
                        <p className="mt-2 text-sm text-ink-secondary">{log.description}</p>
                      )}
                      {log.teacherReview?.note && (
                        <p className="mt-2 text-xs text-ink-muted italic">
                          Teacher note: {log.teacherReview.note}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-dark p-3 text-center">
      <div className="text-xl font-black">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
    </div>
  )
}
