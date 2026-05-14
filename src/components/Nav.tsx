import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HorseshoeLogo } from './Logos'
import DeadlineBanner from './DeadlineBanner'

const links: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'The SALT', to: '/salt' },
  { label: 'Careers', to: '/careers' },
  { label: 'Instructor', to: '/instructor' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <DeadlineBanner />
      <div className="red-textured-band border-b border-black/20 shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-3 group">
            <HorseshoeLogo className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
            <div className="hidden sm:block leading-tight">
              <div className="text-white text-sm tracking-[0.16em] uppercase font-headline drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
                Athletic Leadership
              </div>
              <div className="text-white/75 text-[10px] font-headline font-bold tracking-[0.22em] uppercase">
                Palmetto High School
              </div>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-3 py-2 font-headline text-xs font-bold tracking-[0.12em] uppercase transition-colors duration-200 group ${
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">{label}</span>
                    <span className={`absolute bottom-1 left-3 right-3 h-0.5 bg-white transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}
            <button
              onClick={() => navigate('/apply')}
              className="ml-4 inline-flex items-center justify-center gap-2 font-headline font-bold text-xs tracking-[0.12em] uppercase py-2 px-5 rounded-token bg-white text-brand-red hover:bg-white/95 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:-translate-y-px"
            >
              Apply Now
            </button>
          </div>

          <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="bg-surface-raised border-b border-white/[0.06] px-6 py-4 space-y-1">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-left px-3 py-3 font-headline text-xs font-bold tracking-[0.14em] uppercase border-b border-white/[0.04] transition-colors ${
                  isActive ? 'text-brand-red' : 'text-ink-secondary hover:text-ink-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/apply"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary w-full mt-3"
          >
            Apply Now
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
