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
import { isAllowedDomain } from '../lib/hub/config'
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

      // Client-side domain gate (UX). The server rejects too.
      if (!isAllowedDomain(u.email)) {
        setAuthError(
          `You must sign in with your school account. ${u.email ?? ''} is not an allowed domain.`
        )
        await fbSignOut(auth)
        return
      }

      setUser(u)

      // Provision once: set role claim + upsert profile, then refresh token.
      if (provisionedFor.current !== u.uid) {
        provisionedFor.current = u.uid
        try {
          await ensureProfileFn()
          setRole(await readRole(u, true)) // force refresh to pick up claim
        } catch (err) {
          // ensureProfile is the ONLY thing that assigns the role claim, so a
          // failure here silently demotes staff to the student view. That is
          // indistinguishable from "you are a student" unless we say so — this
          // went unnoticed for weeks once, because the error was console-only.
          // eslint-disable-next-line no-console
          console.error('[AL Hub] ensureProfile failed:', err)
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
