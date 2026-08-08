// ─────────────────────────────────────────────────────────────
// Palmetto AL Hub — Cloud Functions
//
// Phase 1: ensureProfile — the only privileged server logic. It is the
// sole writer of the `role` custom claim and the authority for the
// allowed-domain gate. Runs on first sign-in (and is idempotent).
//
// Config (NOT in client code) via functions/.env:
//   ALLOWED_AUTH_DOMAINS = comma-separated list, e.g. "apps.anderson1.org"
//   TEACHER_EMAILS       = comma-separated staff emails that get 'teacher'
// ─────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'

initializeApp()

// getFirestore() must NOT run at module scope. On deploy, the CLI imports this
// file to discover its exports with a 10s budget; resolving credentials there
// stalls on a machine with no application-default credentials and fails the
// whole deploy with "Cannot determine backend specification. Timeout after
// 10000." Resolve it lazily, inside the handler, where credentials exist.
let firestore: ReturnType<typeof getFirestore> | undefined
function db() {
  return (firestore ??= getFirestore())
}

function parseList(raw: string | undefined): string[] {
  return (raw || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

const ALLOWED_AUTH_DOMAINS = parseList(process.env.ALLOWED_AUTH_DOMAINS)
const TEACHER_EMAILS = parseList(process.env.TEACHER_EMAILS)

function domainOf(email: string): string | null {
  const at = email.lastIndexOf('@')
  return at === -1 ? null : email.slice(at + 1).toLowerCase()
}

type Role = 'student' | 'teacher'

/**
 * Verifies the caller's email domain, assigns the role custom claim, and
 * upserts users/{uid}. Idempotent — safe to call on every sign-in.
 * The client must force-refresh its ID token afterward to see the claim.
 */
export const ensureProfile = onCall(
  {
    region: 'us-central1',
    // The browser calls this cross-origin (www.phsal.org -> cloudfunctions.net).
    // Without an explicit allowlist the preflight is refused and the client only
    // ever sees an opaque "FirebaseError: internal", which is what hid the fact
    // that this function had never succeeded from the browser at all.
    cors: [
      'https://www.phsal.org',
      'https://phsal.org',
      /athletic-leadership-site.*\.vercel\.app$/, // preview deploys
      'http://localhost:5173', // vite dev
    ],
  },
  async (request): Promise<{ role: Role }> => {
    const auth = request.auth
    if (!auth) {
      throw new HttpsError('unauthenticated', 'Sign in first.')
    }

    const email = (auth.token.email as string | undefined)?.toLowerCase()
    if (!email) {
      throw new HttpsError('failed-precondition', 'No email on the account.')
    }

    const domain = domainOf(email)
    if (
      ALLOWED_AUTH_DOMAINS.length > 0 &&
      (!domain || !ALLOWED_AUTH_DOMAINS.includes(domain))
    ) {
      logger.warn('ensureProfile rejected non-allowed domain', { email })
      throw new HttpsError(
        'permission-denied',
        'Your account domain is not permitted for this hub.'
      )
    }

    const uid = auth.uid
    const isTeacher = TEACHER_EMAILS.includes(email)

    // Enrollment gate. The list lives in Firestore (settings/roster) rather
    // than in .env so it can be edited from the teacher Roster page without a
    // function deploy. Teachers bypass it — staff are not on a student roster.
    //
    // Fail-open when the list is empty: an empty roster means "not configured
    // yet", and failing closed there would lock out the whole class the moment
    // this deploys. The teacher UI states loudly when the gate is off.
    if (!isTeacher) {
      const rosterSnap = await db().doc('settings/roster').get()
      const enrolled = (rosterSnap.data()?.studentEmails as string[] | undefined) ?? []
      // Normalised here too, because the list is hand-editable in the console.
      const onRoster = enrolled.some((e) => e.trim().toLowerCase() === email)

      if (enrolled.length > 0 && !onRoster) {
        // Revoke any claim from a previous sign-in, so someone provisioned
        // before the gate existed loses access rather than keeping it forever.
        if (auth.token.role) {
          await getAuth().setCustomUserClaims(uid, {})
        }
        logger.warn('ensureProfile rejected unenrolled account', { email })
        throw new HttpsError(
          'permission-denied',
          'Your account is not on the roster for this course. If you think that is wrong, ask Coach Wardlaw to add you.'
        )
      }
    }

    const role: Role = isTeacher ? 'teacher' : 'student'

    // Set the custom claim only when it would change, to avoid needless writes.
    const existing = (auth.token.role as Role | undefined) ?? undefined
    if (existing !== role) {
      await getAuth().setCustomUserClaims(uid, { role })
    }

    // Upsert the profile doc (mirror of the claim, plus display fields).
    // Only stamp createdAt on first creation.
    const ref = db().collection('users').doc(uid)
    const snap = await ref.get()
    await ref.set(
      {
        email,
        displayName: (auth.token.name as string | undefined) ?? '',
        photoURL: (auth.token.picture as string | undefined) ?? '',
        role,
        lastLogin: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        ...(snap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true }
    )

    logger.info('ensureProfile ok', { uid, role })
    return { role }
  }
)
