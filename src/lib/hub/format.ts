import type { Timestamp } from 'firebase/firestore'
import type { InternshipStatus } from './types'

export function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts) return '—'
  return ts.toDate().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  })
}

export function formatDateInput(ts: Timestamp | null | undefined): string {
  // yyyy-mm-dd for <input type="date">
  if (!ts) return ''
  const d = ts.toDate()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const STATUS_META: Record<
  InternshipStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  },
  supervisor_approved: {
    label: 'Supervisor OK',
    className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  },
  teacher_approved: {
    label: 'Approved',
    className: 'bg-green-500/15 text-green-300 border-green-500/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-300 border-red-500/30',
  },
}

export function hoursLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
