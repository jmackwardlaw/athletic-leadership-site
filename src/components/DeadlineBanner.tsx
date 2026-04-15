// ─────────────────────────────────────────────
// Application deadline
// ─────────────────────────────────────────────
// Applications close at midnight Eastern at the END of Friday, April 24, 2026
// (i.e. the instant Saturday April 25 begins).
// April 2026 is during EDT (Eastern Daylight Time), UTC-4.
export const APPLICATION_DEADLINE = new Date('2026-04-25T00:00:00-04:00')

export function isDeadlinePassed(): boolean {
  return Date.now() >= APPLICATION_DEADLINE.getTime()
}

function formatTimeRemaining(): string {
  const diff = APPLICATION_DEADLINE.getTime() - Date.now()
  if (diff <= 0) return ''

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)

  if (days >= 2) return `${days} days left`
  if (days === 1) return '1 day left'
  if (hours >= 2) return `${hours} hours left`
  if (hours === 1) return '1 hour left'
  if (minutes >= 2) return `${minutes} minutes left`
  return 'Closing soon'
}

export default function DeadlineBanner() {
  if (isDeadlinePassed()) return null
  const remaining = formatTimeRemaining()

  return (
    <div className="bg-[#d81300] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 sm:gap-3">
        {/* Pinging alert dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-center leading-tight">
          Applications Close Friday April 24 at Midnight
          {remaining && (
            <>
              <span className="mx-1.5 sm:mx-2 opacity-60">•</span>
              <span className="whitespace-nowrap">{remaining}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
