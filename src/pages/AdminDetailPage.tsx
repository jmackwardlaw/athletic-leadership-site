import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { AdminAuthState, useAdminAuth } from '../hooks/useAdminAuth'
import {
  Status,
  STATUS_COLORS,
  STATUS_OPTIONS,
  Submission,
  fetchSubmissions,
  formatSubmittedAt,
  updateSubmission,
} from '../lib/admin'

export default function AdminDetailPage() {
  const auth = useAdminAuth()
  return (
    <AdminShell auth={auth}>
      <Detail auth={auth} />
    </AdminShell>
  )
}

function Detail({ auth }: { auth: AdminAuthState }) {
  const { sub } = useParams<{ sub: string }>()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // ── Editing state ─────────────────────────────────────────────────────────────
  const [editingStatus, setEditingStatus] = useState<Status>('Pending')
  const [editingNotes, setEditingNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  // ── PDF state ─────────────────────────────────────────────────────────────────
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

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
          setEditingStatus(match.status)
          setEditingNotes(match.notes || '')
        }
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [sub])

  const isDirty =
    !!submission &&
    (editingStatus !== submission.status || editingNotes !== (submission.notes || ''))

  const handleSave = async () => {
    if (!submission || !auth.user) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateSubmission({
        google_sub: submission.google_sub,
        status: editingStatus,
        notes: editingNotes,
        reviewed_by: auth.user.name,
      })
      const reviewed_at = new Date().toISOString()
      setSubmission({
        ...submission,
        status: editingStatus,
        notes: editingNotes,
        reviewed_by: auth.user.name,
        reviewed_at,
      })
      setSavedAt(reviewed_at)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!submission) return
    setGeneratingPdf(true)
    setPdfError(null)
    try {
      // Dynamic import keeps the ~280KB PDF library out of the main bundle.
      // Only loads when an admin actually clicks Download.
      const { generateApplicationPdf } = await import('../pdf/ApplicationPdf')
      await generateApplicationPdf(submission, auth.user?.name)
    } catch (err: unknown) {
      setPdfError(err instanceof Error ? err.message : String(err))
    } finally {
      setGeneratingPdf(false)
    }
  }

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

        {/* Sidebar: editable review panel */}
        <aside className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 p-5 sticky top-[120px]">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase">
                Review
              </div>
              {isDirty && (
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.1em]">
                  Unsaved
                </span>
              )}
            </div>

            {/* Status dropdown */}
            <label className="block mb-5">
              <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">
                Decision Status
              </span>
              <select
                value={editingStatus}
                onChange={e => setEditingStatus(e.target.value as Status)}
                disabled={saving}
                className="on-white w-full bg-[#2a2a2a] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#d81300] disabled:opacity-50"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            {/* Notes textarea */}
            <label className="block mb-5">
              <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">
                Reviewer Notes
              </span>
              <textarea
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                disabled={saving}
                rows={5}
                placeholder="Private notes — visible to admins only and will print on the PDF."
                className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm px-3 py-2 resize-y focus:outline-none focus:border-[#d81300] placeholder:text-gray-600 disabled:opacity-50"
              />
            </label>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`w-full py-3 text-xs font-black tracking-[0.15em] uppercase transition-colors ${
                !isDirty || saving
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-[#d81300] text-white hover:bg-[#ff1a00]'
              }`}
            >
              {saving ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </span>
              ) : isDirty ? (
                'Save Review'
              ) : (
                'No Changes'
              )}
            </button>

            {/* Save feedback */}
            {saveError && (
              <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs leading-snug">
                <strong className="block mb-1">Save failed</strong>
                <span className="font-mono text-[11px]">{saveError}</span>
              </div>
            )}
            {savedAt && !isDirty && !saveError && (
              <div className="mt-3 p-2.5 bg-green-500/10 border border-green-500/30 text-green-300 text-xs leading-snug inline-flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved {formatSubmittedAt(savedAt)}
              </div>
            )}

            {/* Last reviewer info */}
            {(s.reviewed_by || s.reviewed_at) && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">
                  Last Reviewed
                </div>
                {s.reviewed_by && (
                  <div className="text-white text-sm">{s.reviewed_by}</div>
                )}
                {s.reviewed_at && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    {formatSubmittedAt(s.reviewed_at)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PDF download */}
          <div className="bg-[#1a1a1a] border border-white/10 p-5">
            <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-4">
              Export
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className={`w-full py-3 text-xs font-black tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2 ${
                generatingPdf
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white text-[#0d0d0d] hover:bg-gray-100'
              }`}
            >
              {generatingPdf ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating PDF…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            <p className="text-gray-500 text-[11px] leading-relaxed mt-3">
              Branded letter-size PDF with Palmetto letterhead, full responses,
              current decision status, signature lines, and commitment
              acknowledgements. Uses the current saved review state — save any
              pending edits first.
            </p>
            {pdfError && (
              <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs leading-snug">
                <strong className="block mb-1">PDF generation failed</strong>
                <span className="font-mono text-[11px]">{pdfError}</span>
              </div>
            )}
            {isDirty && (
              <div className="mt-3 p-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] leading-snug">
                You have unsaved changes. The PDF will use the last saved values, not what's currently in the form above.
              </div>
            )}
          </div>

          {/* Metadata */}
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
