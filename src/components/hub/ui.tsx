// Small shared UI primitives for Hub pages — reuse the repo's design
// tokens / global .card-dark, .btn classes from index.css.
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { STATUS_META } from '../../lib/hub/format'
import type { InternshipStatus } from '../../lib/hub/types'

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow-accent mb-2">{eyebrow}</div>}
        <h1
          className="text-3xl sm:text-4xl font-black leading-none"
          style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-headline text-lg font-black uppercase tracking-[0.08em] text-ink-primary mb-4">
      {children}
    </h2>
  )
}

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn('card-dark red-card-edge p-5', className)}>{children}</div>
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="card-dark p-8 text-center text-ink-muted text-sm">{children}</div>
  )
}

export function StatusBadge({ status }: { status: InternshipStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]',
        meta.className
      )}
    >
      {meta.label}
    </span>
  )
}

/** Completion bar. Pass a Tally from lib/hub/progress, or any n/total. */
export function ProgressBar({
  complete,
  total,
  pct,
  label = 'complete',
  showCount = true,
}: {
  complete: number
  total: number
  pct: number
  label?: string
  showCount?: boolean
}) {
  return (
    <div>
      {showCount && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary">
            {complete} of {total} {label}
          </span>
          <span className="text-xs font-bold text-ink-muted">{pct}%</span>
        </div>
      )}
      <div
        className="h-2 w-full rounded-full bg-surface-sunken overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${complete} of ${total} ${label}`}
      >
        <div className="h-full bg-brand-red transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Field({
  label,
  children,
  required,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary mb-1.5">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-token bg-surface-sunken border border-white/10 px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-faint focus:border-brand-red focus:outline-none transition-colors'
