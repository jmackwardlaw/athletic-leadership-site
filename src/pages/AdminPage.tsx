import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { useAdminAuth } from '../hooks/useAdminAuth'
import {
  Status,
  STATUS_OPTIONS,
  STATUS_COLORS,
  Submission,
  fetchSubmissions,
  formatSubmittedAt,
} from '../lib/admin'

type FilterValue = 'all' | Status
type SortKey = 'submitted' | 'name' | 'grade' | 'status'
type SortDir = 'asc' | 'desc'

export default function AdminPage() {
  const auth = useAdminAuth()

  return (
    <AdminShell auth={auth}>
      <Dashboard
        adminName={auth.user?.name || ''}
        adminEmail={auth.user?.email || ''}
        onSignOut={auth.signOut}
      />
    </AdminShell>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function Dashboard({
  adminName,
  adminEmail,
  onSignOut,
}: {
  adminName: string
  adminEmail: string
  onSignOut: () => void
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [filter, setFilter] = useState<FilterValue>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('submitted')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const rows = await fetchSubmissions()
      setSubmissions(rows)
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  // ── Counts by status for the filter chips
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: submissions.length }
    for (const s of submissions) {
      const key = s.status || 'Pending'
      c[key] = (c[key] || 0) + 1
    }
    return c
  }, [submissions])

  // ── Filter + search + sort pipeline
  const rows = useMemo(() => {
    let result = submissions.slice()

    if (filter !== 'all') {
      result = result.filter(s => (s.status || 'Pending') === filter)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(s => {
        const name = `${s.first_name} ${s.last_name}`.toLowerCase()
        const email = s.google_email.toLowerCase()
        return (
          name.includes(q) ||
          email.includes(q) ||
          String(s.grade).includes(q)
        )
      })
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name':
          cmp = `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`)
          break
        case 'grade':
          cmp = Number(a.grade) - Number(b.grade)
          break
        case 'status':
          cmp = (a.status || 'Pending').localeCompare(b.status || 'Pending')
          break
        case 'submitted':
        default: {
          const aT = new Date(a.timestamp).getTime() || 0
          const bT = new Date(b.timestamp).getTime() || 0
          cmp = aT - bT
          break
        }
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [submissions, filter, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'submitted' ? 'desc' : 'asc')
    }
  }

  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#141414] to-[#1a1a1a]">
      {/* Header */}
      <section className="relative py-12 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-[#d81300]"></div>
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">
                Administrator Portal
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
            >
              Applications<br /><span className="text-[#d81300]">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm mt-4">
              Athletic Leadership · 2026–2027 cycle
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-400">Signed in as</span>
              <span className="text-white font-bold">{adminName}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{adminEmail}</div>
            <button
              onClick={onSignOut}
              className="text-gray-400 hover:text-white text-xs underline mt-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <div className="bg-[#d81300] py-5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <Stat label="Total" value={counts.all ?? 0} />
          <Stat label="Pending" value={counts.Pending ?? 0} />
          <Stat label="Reviewed" value={counts.Reviewed ?? 0} />
          <Stat label="Admitted" value={counts.Admitted ?? 0} />
          <Stat label="Waitlist" value={counts.Waitlisted ?? 0} />
          <Stat label="Rejected" value={counts.Rejected ?? 0} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#1a1a1a] border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              label={`All (${counts.all ?? 0})`}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {STATUS_OPTIONS.map(s => (
              <FilterChip
                key={s}
                label={`${s} (${counts[s] ?? 0})`}
                active={filter === s}
                onClick={() => setFilter(s)}
              />
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, grade…"
            className="bg-[#2a2a2a] border border-white/10 text-white text-sm px-3 py-2 w-64 focus:outline-none focus:border-[#d81300] placeholder:text-gray-500"
          />

          <button
            onClick={() => void load()}
            disabled={loading}
            className="px-4 py-2 border border-white/10 text-gray-300 text-xs font-black uppercase tracking-[0.1em] hover:border-[#d81300] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reload from sheet"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {loadError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-4 mb-6">
            <div className="font-bold mb-1">Failed to load applications</div>
            <div className="font-mono text-xs">{loadError}</div>
            <div className="text-xs text-red-200/70 mt-2">
              This usually means the Apps Script deployment hasn't been updated to v2 yet,
              or the admin secret in <code>src/lib/admin.ts</code> doesn't match the
              script's <code>ADMIN_SECRET</code>.
            </div>
          </div>
        )}

        {loading && submissions.length === 0 && (
          <div className="text-center text-gray-500 py-20 text-sm">
            Loading applications…
          </div>
        )}

        {!loading && !loadError && submissions.length === 0 && (
          <EmptyState />
        )}

        {submissions.length > 0 && (
          <div className="border border-white/10 bg-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-[0.1em]">
                    <Th onClick={() => toggleSort('name')} active={sortKey === 'name'} dir={sortDir}>
                      Name
                    </Th>
                    <Th onClick={() => toggleSort('grade')} active={sortKey === 'grade'} dir={sortDir}>
                      Grade
                    </Th>
                    <th className="text-left font-black px-4 py-3">Email</th>
                    <Th onClick={() => toggleSort('submitted')} active={sortKey === 'submitted'} dir={sortDir}>
                      Submitted
                    </Th>
                    <Th onClick={() => toggleSort('status')} active={sortKey === 'status'} dir={sortDir}>
                      Status
                    </Th>
                    <th className="text-left font-black px-4 py-3">Reviewed By</th>
                    <th className="text-right font-black px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s, i) => (
                    <tr
                      key={s.google_sub || s.timestamp || i}
                      className="border-t border-white/5 hover:bg-[#242424] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/${encodeURIComponent(s.google_sub)}`}
                          className="text-white font-bold hover:text-[#d81300] transition-colors"
                        >
                          {s.first_name} {s.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{s.grade ? `${s.grade}th` : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs truncate max-w-xs">
                        {s.google_email}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {formatSubmittedAt(s.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status || 'Pending'} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {s.reviewed_by || <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/${encodeURIComponent(s.google_sub)}`}
                          className="text-[#d81300] hover:text-[#ff1a00] text-xs font-black uppercase tracking-[0.1em]"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && submissions.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">
                        No applications match the current filter / search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-gray-600 text-xs mt-6 text-center">
          Data fetched live from the linked Google Sheet. Click a row to open the full application.
        </p>
      </section>
    </div>
  )
}

// ── Small UI atoms ─────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-white text-2xl md:text-3xl font-black leading-none tabular-nums">
        {value}
      </div>
      <div className="text-white/70 text-[10px] md:text-xs font-black tracking-[0.15em] uppercase mt-1">
        {label}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] border transition-colors ${
        active
          ? 'bg-[#d81300] border-[#d81300] text-white'
          : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode
  onClick: () => void
  active: boolean
  dir: SortDir
}) {
  return (
    <th
      onClick={onClick}
      className="text-left font-black px-4 py-3 cursor-pointer select-none hover:text-white"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <span className="text-[#d81300]">{dir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const c = STATUS_COLORS[status]
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 mb-5">
        <svg
          className="w-8 h-8 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-black mb-2">No applications yet</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">
        Submissions will appear here as students complete the application at{' '}
        <span className="text-white font-mono">phsal.org/apply</span>.
      </p>
    </div>
  )
}
