import { useEffect, useRef, useState } from 'react'
import {
  AdminGoogleUser,
  GOOGLE_CLIENT_ID,
  HOSTED_DOMAIN,
  decodeJwt,
  isAdminEmail,
} from '../lib/admin'

// Persist the signed-in admin user across admin route navigations so we don't
// flash the sign-in gate each time. Stored in sessionStorage (cleared when tab
// closes) keyed by Google sub, to avoid leaking across accounts on shared
// computers.
const SESSION_KEY = 'al-admin-session-v1'

function loadSession(): AdminGoogleUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdminGoogleUser
    if (!parsed?.email || !parsed?.sub) return null
    return parsed
  } catch {
    return null
  }
}

function saveSession(user: AdminGoogleUser) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    /* quota exceeded etc — fine */
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export interface AdminAuthState {
  user: AdminGoogleUser | null
  authError: string | null
  isAuthorized: boolean
  signInBtnRef: React.RefObject<HTMLDivElement>
  signOut: () => void
}

export function useAdminAuth(): AdminAuthState {
  const [user, setUser] = useState<AdminGoogleUser | null>(() => loadSession())
  const [authError, setAuthError] = useState<string | null>(null)
  const signInBtnRef = useRef<HTMLDivElement>(null)

  const isAuthorized = !!user && isAdminEmail(user.email)

  useEffect(() => {
    if (user) return // already signed in from sessionStorage

    const handleCredentialResponse = (response: { credential: string }) => {
      const payload = decodeJwt(response.credential)
      if (!payload) {
        setAuthError('Could not read your Google account.')
        return
      }
      if (payload.hd !== HOSTED_DOMAIN) {
        setAuthError(`You must sign in with your @${HOSTED_DOMAIN} account.`)
        return
      }
      const next: AdminGoogleUser = {
        email: (payload.email as string).toLowerCase(),
        name: payload.name as string,
        sub: payload.sub as string,
        picture: payload.picture as string | undefined,
        credential: response.credential,
      }
      saveSession(next)
      setUser(next)
      setAuthError(null)
    }

    const initializeGoogleAuth = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        hosted_domain: HOSTED_DOMAIN,
        auto_select: false,
        ux_mode: 'popup',
      })
      if (signInBtnRef.current) {
        signInBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(signInBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        })
      }
    }

    if (window.google?.accounts?.id) {
      initializeGoogleAuth()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    )
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogleAuth)
      return () => existingScript.removeEventListener('load', initializeGoogleAuth)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleAuth
    script.onerror = () =>
      setAuthError('Failed to load Google Sign-In. Check your connection and refresh.')
    document.head.appendChild(script)
  }, [user])

  const signOut = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    clearSession()
    setUser(null)
    setAuthError(null)
  }

  return { user, authError, isAuthorized, signInBtnRef, signOut }
}
