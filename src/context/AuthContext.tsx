// ─────────────────────────────────────────────────────────────
// AuthProvider for the AL Hub.
//
// Exposes { user, role, loading, ... }. On sign-in it:
//   1. enforces the allowed-domain check client-side (UX; rules are the
//      real boundary),
//   2. calls the ensureProfile callable, which sets the role custom claim
//      and upserts users/{uid},
//   3. force-refreshes the ID token so the new claim is available for
//      routing + Firestore rules.
// ─────────────────────────────────────────────────────────────
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { auth, functions, googleProvider } from '../lib/firebase'
import type { Role } from '../lib/hub/types'

interface AuthState {
  user: User | null
  role: Role | null
  loading: boolean
  authError: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const ensureProfileFn = httpsCallable(functions, 'ensureProfile')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  // Guards against running ensureProfile more than once per uid per session.
  const provisionedFor = useRef<string | null>(null)

  // Read the role claim off the current token.
  const readRole = useCallback(async (u: User, forceRefresh = false): Promise<Role | null> => {
    const token = await u.getIdTokenResult(forceRefresh)
    const claim = token.claims.role
    return claim === 'teacher' || claim === 'student' ? claim : null
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        provisionedFor.current = null
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      // No client-side domain gate. ensureProfile is the authority now, because
      // an enrolled address may legitimately be off-domain (transfer student,
      // aide, a test account) — blocking here would deny them before the server
      // ever sees the roster. Rejections come back as permission-denied below.
      setUser(u)

      // Provision once: set role claim + upsert profile, then refresh token.
      if (provisionedFor.current !== u.uid) {
        provisionedFor.current = u.uid
        try {
          await ensureProfileFn()
          setRole(await readRole(u, true)) // force refresh to pick up claim
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[AL Hub] ensureProfile failed:', err)

          // A rejection is a decision, not a fault: the account is off-domain
          // or not on the course roster. Sign them out and say so, rather than
          // stranding them on an empty dashboard they cannot read.
          const code = (err as { code?: string })?.code
          if (code === 'functions/permission-denied') {
            const message =
              (err as { message?: string })?.message ||
              'Your account does not have access to this course.'
            provisionedFor.current = null
            await fbSignOut(auth)
            setAuthError(message)
            return
          }

          // Anything else is a real failure. ensureProfile is the ONLY thing
          // that assigns the role claim, so failing quietly here demotes staff
          // to the student view — indistinguishable from "you are a student"
          // unless we say so. That hid a broken callable for weeks.
          setAuthError(
            'Could not confirm your account role, so you may be seeing the student view. ' +
              'If you are staff, tell Coach Wardlaw the hub could not reach ensureProfile.'
          )
          setRole(await readRole(u, true))
        }
      } else {
        setRole(await readRole(u))
      }

      setLoading(false)
    })
    return unsub
  }, [readRole])

  // Keep role in sync if the token is refreshed elsewhere.
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (u && provisionedFor.current === u.uid) {
        setRole(await readRole(u))
      }
    })
    return unsub
  }, [readRole])

  const signIn = useCallback(async () => {
    setAuthError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged handles the rest.
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return // user dismissed — not an error worth showing
      }
      setAuthError('Sign-in failed. Please try again.')
      // eslint-disable-next-line no-console
      console.error('[AL Hub] signIn error:', err)
    }
  }, [])

  const signOut = useCallback(async () => {
    await fbSignOut(auth)
    setAuthError(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({ user, role, loading, authError, signIn, signOut }),
    [user, role, loading, authError, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
