import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AdminAuthState } from '../hooks/useAdminAuth'
import { HOSTED_DOMAIN } from '../lib/admin'

interface ShellProps {
  auth: AdminAuthState
  /** Page content to render once auth + authorization pass */
  children: ReactNode
}

// Wraps admin pages with the sign-in gate + unauthorized gate. When the user
// is signed in and allowlisted, renders `children`.
export default function AdminShell({ auth, children }: ShellProps) {
  if (!auth.user) return <SignInGate auth={auth} />
  if (!auth.isAuthorized) return <NotAuthorized auth={auth} />
  return <>{children}</>
}

function SignInGate({ auth }: { auth: AdminAuthState }) {
  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]">
      <section className="relative py-20 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">
              Internal Tool
            </span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
          >
            Administrator<br /><span className="text-[#d81300]">Portal</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Restricted access. Sign in with your authorized Anderson District One account to review applications.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 text-center">
            <div className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase mb-4">
              Verify Identity
            </div>
            <h2 className="text-3xl font-black mb-4">Admin Sign-In</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Use an authorized <span className="text-white font-bold">@{HOSTED_DOMAIN}</span> account to continue.
            </p>
            <div className="flex justify-center mb-4 min-h-[44px]">
              <div ref={auth.signInBtnRef}></div>
            </div>
            {auth.authError && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                {auth.authError}
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-white/5">
              <Link to="/" className="text-gray-500 text-xs hover:text-white transition-colors">
                ← Return to public site
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function NotAuthorized({ auth }: { auth: AdminAuthState }) {
  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 bg-[#d81300] flex items-center justify-center font-black text-white text-3xl mx-auto mb-8">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-0.5 bg-[#d81300]"></div>
          <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">
            Access Denied
          </span>
          <div className="w-8 h-0.5 bg-[#d81300]"></div>
        </div>
        <h1
          className="text-5xl font-black mb-4 leading-none"
          style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
        >
          Not<br /><span className="text-[#d81300]">Authorized</span>
        </h1>
        <p className="text-gray-400 leading-relaxed mb-3">
          You're signed in as <span className="text-white font-bold">{auth.user?.email}</span>, but this account isn't on the administrator allowlist.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          If you should have access, contact the site administrator. Otherwise, sign out and return to the public site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={auth.signOut}
            className="px-8 py-4 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-colors"
          >
            Sign Out
          </button>
          <Link
            to="/"
            className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.1em] uppercase hover:border-white/40 transition-colors"
          >
            Return to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
