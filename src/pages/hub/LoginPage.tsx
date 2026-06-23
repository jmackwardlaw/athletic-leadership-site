// /hub/login — public "Student Access" sign-in for the Hub.
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { HorseshoeLogo } from '../../components/Logos'
import HubLoading from '../../components/hub/HubLoading'

export default function LoginPage() {
  const { user, role, loading, authError, signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate(role === 'teacher' ? '/hub/teacher' : '/hub', { replace: true })
    }
  }, [user, role, loading, navigate])

  if (loading) return <HubLoading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white flex flex-col">
      <section className="relative py-16 px-6 red-textured-band border-b border-black/20 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto flex items-center gap-4">
          <HorseshoeLogo className="w-12 h-12 object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
          <div>
            <div className="text-white/80 text-[11px] font-headline font-black tracking-[0.28em] uppercase">
              Palmetto High School
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black leading-none text-white"
              style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
            >
              Athletic Leadership Hub
            </h1>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full">
          <div className="card-dark red-card-edge p-8 sm:p-10 text-center">
            <div className="eyebrow-accent mb-3">Student Access</div>
            <h2 className="text-2xl font-black mb-3">Sign in to your course</h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-8">
              Use your school Google account to access modules, weekly to-dos,
              and your internship hours.
            </p>

            <button
              onClick={signIn}
              className="w-full inline-flex items-center justify-center gap-3 rounded-token bg-white text-[#1a1a1a] font-bold text-sm py-3 px-5 hover:bg-white/90 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <GoogleGlyph />
              Sign in with Google
            </button>

            {authError && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left rounded-token">
                {authError}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5">
              <Link
                to="/"
                className="text-ink-faint text-xs hover:text-white transition-colors"
              >
                ← Return to public site
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}
