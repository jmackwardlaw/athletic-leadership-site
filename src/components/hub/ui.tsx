// Small shared UI primitives for Hub pages — reuse the repo's design
// tokens / global .card-dark, .btn classes from index.css.
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { STATUS_META, hoursLabel } from '../../lib/hub/format'
import { DEFAULT_EMBED_RATIO, toEmbedUrl } from '../../lib/hub/embed'
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

/**
 * Inline embed for teacher-authored slide decks, docs and video.
 *
 * The src is normalised by lib/hub/embed, which refuses anything that is not
 * https — so javascript:/data: URLs can never reach the frame. Content is
 * still third-party, so it gets a sandbox: scripts and popups yes (decks need
 * them), form submission and top-level navigation no, which stops an embed
 * from redirecting the hub out from under a student.
 */
export function Embed({
  url,
  title,
  ratio = DEFAULT_EMBED_RATIO,
}: {
  url: string | null | undefined
  title: string
  ratio?: string
}) {
  const src = toEmbedUrl(url)
  if (!src) return null
  return (
    <div className="mb-5 overflow-hidden rounded-token border border-white/10 bg-surface-sunken">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        // NOT no-referrer: YouTube (and other players) validate the embedding
        // origin and fail with "Error 153" without it. This sends the origin
        // only, never the full hub URL.
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        className="block w-full border-0"
        style={{ aspectRatio: ratio }}
      />
    </div>
  )
}

/**
 * Circular progress ring. Complete rings turn green so "done" is readable at a
 * glance without counting. Pure SVG — no chart dependency for three donuts.
 */
export function ProgressRing({
  value,
  total,
  label,
  caption,
  size = 148,
  stroke = 12,
}: {
  value: number
  total: number
  label: string
  caption?: string
  size?: number
  stroke?: number
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  const done = total > 0 && value >= total
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (pct / 100) * circumference
  const center = size / 2

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${hoursLabel(value)} of ${hoursLabel(total)}, ${pct}% complete`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          {/* Skipped entirely at 0% — a round linecap still paints a dot on a
              zero-length dash, which reads as "you have some progress". */}
          {filled > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={done ? '#4ade80' : 'var(--brand-red)'}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference - filled}`}
              transform={`rotate(-90 ${center} ${center})`}
              style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.22,1,0.36,1)' }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black leading-none text-ink-primary">
            {hoursLabel(value)}
          </div>
          <div className="mt-1 text-xs font-bold text-ink-muted">
            of {hoursLabel(total)}
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-headline text-sm font-black uppercase tracking-[0.08em] text-ink-primary">
          {label}
        </div>
        {caption && <div className="mt-0.5 text-xs text-ink-muted">{caption}</div>}
      </div>
    </div>
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
