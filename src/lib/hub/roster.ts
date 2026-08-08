// ─────────────────────────────────────────────────────────────
// Enrollment list parsing. Pure — no imports — so it can be exercised by
// scripts/check-roster.mjs and reused verbatim by the Cloud Function.
// ─────────────────────────────────────────────────────────────

/**
 * Turns whatever a teacher pastes into a clean email list.
 *
 * Handles the realistic cases: one per line, comma-separated out of a
 * spreadsheet, trailing commas, stray whitespace, mixed case, and duplicates.
 * Order is preserved so the textarea does not reshuffle on every save.
 */
export function parseEmailList(raw: string): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const token of (raw || '').split(/[\s,;]+/)) {
    const email = token.trim().toLowerCase()
    // A bare token without "@" is a paste artifact (a name, a header row),
    // not an address — dropping it beats enrolling something unmatchable.
    if (!email || !email.includes('@')) continue
    if (seen.has(email)) continue
    seen.add(email)
    out.push(email)
  }
  return out
}

/** True when the enrollment gate is switched on at all. */
export function enrollmentEnabled(emails: string[] | null | undefined): boolean {
  return Array.isArray(emails) && emails.length > 0
}

/**
 * Enrolled check. Case-insensitive; assumes the stored list came from
 * parseEmailList (already lowercased) but normalises anyway, because the list
 * is editable by hand in the Firestore console.
 */
export function isEnrolled(email: string, emails: string[] | null | undefined): boolean {
  if (!enrollmentEnabled(emails)) return false
  const needle = email.trim().toLowerCase()
  return emails!.some((e) => e.trim().toLowerCase() === needle)
}
