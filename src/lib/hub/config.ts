// Client-side Hub config. The authoritative copies of the domain
// allowlist and teacher emails live in Cloud Functions config + Firestore
// rules; the values here are for UX (sign-in hint, friendly rejection)
// only and are not a security boundary.

export const HUB_PREFIX = '/hub'

export const ALLOWED_AUTH_DOMAINS: string[] = (
  import.meta.env.VITE_ALLOWED_AUTH_DOMAINS || ''
)
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export function emailDomain(email: string | null | undefined): string | null {
  if (!email) return null
  const at = email.lastIndexOf('@')
  if (at === -1) return null
  return email.slice(at + 1).toLowerCase()
}

export function isAllowedDomain(email: string | null | undefined): boolean {
  const domain = emailDomain(email)
  if (!domain) return false
  // If no allowlist is configured client-side, don't block here — let the
  // server (ensureProfile) be the authority.
  if (ALLOWED_AUTH_DOMAINS.length === 0) return true
  return ALLOWED_AUTH_DOMAINS.includes(domain)
}
