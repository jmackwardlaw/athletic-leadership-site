// Authenticated Hub shell: branded header (course title, term, user +
// sign-out) + role-aware nav, wrapping all gated Hub pages via <Outlet>.
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { HubDataProvider, useHubData } from '../../context/HubDataContext'
import { HorseshoeLogo } from '../Logos'
import { RequireAuth } from './guards'

const studentNav = [
  { label: 'Dashboard', to: '/hub', end: true },
  { label: 'Internship Hours', to: '/hub/internship', end: false },
]
const teacherNav = [
  { label: 'Overview', to: '/hub/teacher', end: true },
  { label: 'Content', to: '/hub/teacher/content', end: false },
  { label: 'Roster', to: '/hub/teacher/roster', end: false },
  { label: 'Approvals', to: '/hub/teacher/internship', end: false },
  { label: 'To-Dos', to: '/hub/teacher/todos', end: false },
]
// Teachers are students' teachers, not students — but they still need to see
// what the class sees. Without this the only way to reach the student view is
// to edit the URL by hand.
const teacherExtraNav = { label: 'Student View', to: '/hub', end: true }

function HubHeader() {
  const { user, role, signOut } = useAuth()
  const { settings, course } = useHubData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = role === 'teacher' ? [...teacherNav, teacherExtraNav] : studentNav
  const courseTitle = course?.title || 'Athletic Leadership'

  const handleSignOut = async () => {
    await signOut()
    navigate('/hub/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 red-textured-band border-b border-black/20 shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link to="/hub" className="flex items-center gap-3 min-w-0 group">
            <HorseshoeLogo className="w-8 h-8 object-contain shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
            <div className="leading-tight min-w-0">
              <div
                className="text-white text-sm tracking-[0.14em] uppercase truncate"
                style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
              >
                {courseTitle}
              </div>
              <div className="text-white/75 text-[10px] font-headline font-bold tracking-[0.2em] uppercase truncate">
                {settings?.termLabel ? `Course Hub · ${settings.termLabel}` : 'Course Hub'}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative px-3 py-2 font-headline text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User cluster */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full border border-white/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="leading-tight text-right max-w-[140px]">
              <div className="text-white text-xs font-bold truncate">
                {user?.displayName || user?.email}
              </div>
              {role && (
                <div className="text-white/70 text-[10px] uppercase tracking-[0.16em]">
                  {role}
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-white/80 hover:text-white p-1.5 rounded-token hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden relative z-10 bg-[#1a0a08]/95 border-t border-black/30 px-4 py-3 space-y-1">
          {links.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 font-headline text-xs font-bold tracking-[0.12em] uppercase rounded-token transition-colors ${
                  isActive ? 'text-white bg-white/10' : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2.5 font-headline text-xs font-bold tracking-[0.12em] uppercase text-white/80 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Sign out
            <span className="ml-auto normal-case tracking-normal text-white/50 font-normal">
              {user?.email}
            </span>
          </button>
        </div>
      )}
    </header>
  )
}

/** Surfaces a failed role provisioning instead of quietly showing student UI. */
function ProvisioningWarning() {
  const { authError } = useAuth()
  if (!authError) return null
  return (
    <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-xs rounded-token">
      {authError}
    </div>
  )
}

export default function HubLayout() {
  return (
    <RequireAuth>
      <HubDataProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
          <HubHeader />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <ProvisioningWarning />
            <Outlet />
          </main>
        </div>
      </HubDataProvider>
    </RequireAuth>
  )
}
