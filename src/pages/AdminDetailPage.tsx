import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { useAdminAuth } from '../hooks/useAdminAuth'
import {
  STATUS_COLORS,
  Submission,
  fetchSubmissions,
  formatSubmittedAt,
} from '../lib/admin'

export default function AdminDetailPage() {
  const auth = useAdminAuth()
  return (
    <AdminShell auth={auth}>
      <Detail />
    </AdminShell>
  )
}

function Detail() {
  const { sub } = useParams<{ sub: string }>()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const rows = await fetchSubmissions()
        const match = rows.find(r => r.google_sub === decodeURIComponent(sub || ''))
        if (!match) {
          setLoadError('Application not found.')
        } else {
          setSubmission(match)
        }
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [sub])

  if (loading) {
    return (
      <div className="pt-[100px] min-h-screen bg-[#0d0d0d] text-center text-gray-500 py-20 text-sm">
        Loading application…
      </div>
    )
  }

  if (loadError || !submission) {
    return (
      <div className="pt-[100px] min-h-screen bg-[#0d0d0d] px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-black mb-4">Unable to load</h1>
          <p className="text-gray-400 text-sm mb-6">{loadError || 'Unknown error'}</p>
          <Link
            to="/admin"
            className="inline-block px-6 py-3 border border-white/20 text-white font-black text-xs tracking-[0.1em] uppercase hover:border-[#d81300] transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const s = submission
  const statusColor = STATUS_COLORS[s.status] || STATUS_COLORS.Pending
  const fullName = `${s.first_name} ${s.last_name}`.trim()

  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
      {/* Breadcrumb + header */}
      <section className="relative py-10 px-6 bg-gradient-to-br from-[#242424] to-[#383838] border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/admin"
            className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-[0.15em] inline-flex items-center gap-2 mb-4"
          >
            ← Applications Dashboard
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-black leading-none"
                style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
              >
                {fullName || 'Unnamed Applicant'}
              </h1>
              <p className="text-gray-400 text-sm mt-3">
                {s.grade ? `${s.grade}th Grade · ` : ''}Submitted {formatSubmittedAt(s.timestamp)}
              </p>
            </div>
            <span
              className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-[0.15em] ${statusColor.bg} ${statusColor.text}`}
            >
              {statusColor.label}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-6 py-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main application content */}
        <div className="space-y-6">
          <Card title="Student Information">
            <Field label="Full Name" value={fullName || '—'} />
            <Field label="Grade" value={s.grade ? `${s.grade}th Grade` : '—'} />
            <Field label="Email (Google-verified)" value={s.google_email} mono />
            <Field label="Phone" value={s.phone || '—'} />
          </Card>

          <Card title="Athletic & Activity Background">
            <Field label="Sports / Programs" value={s.sports || '—'} />
            <Field label="Other Activities" value={s.other_activities || '—'} />
          </Card>

          <Card title="Short Answer Responses">
            <Response num="1" prompt="Describe a time you took responsibility for something that went wrong — in school, sports, or life. What did you do?" answer={s.q1} />
            <Response num="2" prompt="Why do you want to be part of the Athletic Leadership program? What do you hope to contribute — not just gain?" answer={s.q2} />
            <Response num="3" prompt="Describe someone you consider a great leader in athletics. It doesn't have to be a famous person. What makes them effective?" answer={s.q3} />
            <Response num="4" prompt="Have you ever received criticism or feedback that was hard to hear? How did you respond?" answer={s.q4} />
            <Response num="5" prompt="Athletic programs need people in many roles — marketing, operations, management, media, and more. Which area interests you most and why?" answer={s.q5} />
            <Response num="6" prompt="What does respect look like in an athletic environment — toward coaches, teammates, opponents, and officials?" answer={s.q6} />
            <Response num="7" prompt="Is there anything in your background — behavior, grades, or attendance — we should know about? If so, how have you addressed it?" answer={s.q7} />
          </Card>
        </div>

        {/* Sidebar: review panel (editing + PDF land in next commits) */}
        <aside className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 p-5">
            <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-4">
              Review Status
            </div>
            <div className="mb-4">
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                Current
              </div>
              <span
                className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${statusColor.bg} ${statusColor.text}`}
              >
                {statusColor.label}
              </span>
            </div>
            {s.reviewed_by && (
              <div className="mb-4">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                  Reviewed By
                </div>
                <div className="text-white text-sm">{s.reviewed_by}</div>
                {s.reviewed_at && (
                  <div className="text-gray-500 text-xs">{formatSubmittedAt(s.reviewed_at)}</div>
                )}
              </div>
            )}
            {s.notes && (
              <div className="mb-4">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                  Reviewer Notes
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {s.notes}
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-300 block mb-1">Editing + PDF export coming next</strong>
              Status, notes, and "Download PDF" actions land in the next commits. For now this page is read-only so you can verify sign-in, allowlist, and data fetching work end-to-end.
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 p-5 text-xs text-gray-500 leading-relaxed">
            <div className="text-gray-400 font-bold mb-2">Metadata</div>
            <dl className="space-y-1">
              <div className="flex justify-between gap-3">
                <dt>Google Sub</dt>
                <dd className="font-mono text-gray-400 truncate">{s.google_sub}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Google Name</dt>
                <dd className="text-gray-400 truncate">{s.google_name}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  )
}

// ── UI atoms ───────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 p-6">
      <h2 className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-5">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
        {label}
      </div>
      <div className={`text-white text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

function Response({ num, prompt, answer }: { num: string; prompt: string; answer: string }) {
  return (
    <div className="border-l-2 border-[#d81300]/40 pl-4">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-[#d81300] font-black text-sm flex-shrink-0">Q{num}.</span>
        <p className="text-gray-400 text-xs leading-relaxed italic">{prompt}</p>
      </div>
      <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
        {answer || <span className="text-gray-600 italic">No response</span>}
      </div>
      <div className="text-gray-600 text-[10px] mt-2 tabular-nums">
        {answer?.length || 0} characters
      </div>
    </div>
  )
}
