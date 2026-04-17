// ─────────────────────────────────────────────
// Admin portal — shared config, types, helpers
// ─────────────────────────────────────────────

// Google Sign-In (reuses the same OAuth client as the student form)
export const GOOGLE_CLIENT_ID = '936947519171-l6n44hr7qktcrl9809bcm8p5bukp7eju.apps.googleusercontent.com'
export const HOSTED_DOMAIN = 'apps.anderson1.org'

// Admin allowlist — add additional admin emails here, all lowercase.
// A Google sign-in that isn't in this list will be shown "Access Denied".
export const ADMIN_EMAILS: string[] = [
  'wardlawj@apps.anderson1.org',
]

// Apps Script deployment URL — same URL the student form posts to.
// The script must be the v2 version (with doGet + update support).
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxWOs2eSj9ZQODY-1MW6HJj6eZom0sqj-iK9dUjzlYds67WSYA541Qd2EVL1XlYSCl7Iw/exec'

// Shared secret between Apps Script and the admin frontend.
// This is a speed-bump, not real security — a determined student who
// views the bundle can extract it. The REAL protection is the
// ADMIN_EMAILS allowlist on the frontend and, in a follow-up, ID token
// verification on the Apps Script side. Rotate this if you suspect leak.
export const ADMIN_SECRET = 'palm-al-admin-k7h2j9d4a5xyz3mnp6v8q'

// ── Types ──────────────────────────────────────────────────────────────────────

export type Status =
  | 'Pending'
  | 'Reviewed'
  | 'Admitted'
  | 'Waitlisted'
  | 'Conditional'
  | 'Rejected'

export const STATUS_OPTIONS: Status[] = [
  'Pending',
  'Reviewed',
  'Admitted',
  'Waitlisted',
  'Conditional',
  'Rejected',
]

export const STATUS_COLORS: Record<Status, { bg: string; text: string; label: string }> = {
  Pending:     { bg: 'bg-gray-200',    text: 'text-gray-800',   label: 'Pending' },
  Reviewed:    { bg: 'bg-blue-100',    text: 'text-blue-900',   label: 'Reviewed' },
  Admitted:    { bg: 'bg-green-100',   text: 'text-green-900',  label: 'Admitted' },
  Waitlisted:  { bg: 'bg-yellow-100',  text: 'text-yellow-900', label: 'Waitlisted' },
  Conditional: { bg: 'bg-purple-100',  text: 'text-purple-900', label: 'Conditional' },
  Rejected:    { bg: 'bg-red-100',     text: 'text-red-900',    label: 'Rejected' },
}

export interface AdminGoogleUser {
  email: string
  name: string
  sub: string
  picture?: string
  credential: string
}

export interface Submission {
  timestamp: string
  google_email: string
  google_name: string
  google_sub: string
  first_name: string
  last_name: string
  grade: string
  phone: string
  sports: string
  other_activities: string
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  status: Status
  notes: string
  reviewed_by: string
  reviewed_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase())
}

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function formatSubmittedAt(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso // fall back to raw value if unparseable
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })
}

// ── API: fetch all submissions ─────────────────────────────────────────────────

export async function fetchSubmissions(): Promise<Submission[]> {
  const url = `${APPS_SCRIPT_URL}?key=${encodeURIComponent(ADMIN_SECRET)}`
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== 'success') throw new Error(data.message || 'Unknown server error')
  // Normalize status so a blank/missing value becomes 'Pending'
  return (data.submissions || []).map((s: Submission) => ({
    ...s,
    status: (s.status && (STATUS_OPTIONS as string[]).includes(s.status)) ? s.status : 'Pending',
  }))
}

// ── API: update a submission's review fields ───────────────────────────────────

export async function updateSubmission(payload: {
  google_sub: string
  status: Status
  notes: string
  reviewed_by: string
}): Promise<void> {
  // Use text/plain to skip CORS preflight — Apps Script still parses JSON body
  const body = JSON.stringify({
    action: 'update',
    secret: ADMIN_SECRET,
    google_sub: payload.google_sub,
    status: payload.status,
    notes: payload.notes,
    reviewed_by: payload.reviewed_by,
    reviewed_at: new Date().toISOString(),
  })
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  })
  if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== 'success') throw new Error(data.message || 'Update failed')
}

// ── Global window typing for Google Identity Services ──────────────────────────

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}
