import { NavLink, useNavigate } from 'react-router-dom'
import { HorseshoeLogo } from './Logos'

const links: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'The SALT', to: '/salt' },
  { label: 'Careers', to: '/careers' },
  { label: 'Instructor', to: '/instructor' },
  { label: 'Apply', to: '/apply' },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-surface-raised border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <NavLink to="/" className="flex items-center gap-3 mb-5">
              <HorseshoeLogo className="w-10 h-10 object-contain" />
              <div>
                <div className="text-ink-primary font-headline font-black text-sm tracking-[0.12em] uppercase">Athletic Leadership</div>
                <div className="text-ink-muted font-headline text-[10px] font-bold tracking-[0.22em] uppercase">Palmetto High School</div>
              </div>
            </NavLink>
            <p className="text-ink-muted text-xs leading-relaxed max-w-xs">
              A career-focused honors elective building the next generation of athletic leaders through real experience.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="red-grad-rule w-6"></div>
              <span className="font-headline text-[10px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Navigation</span>
            </div>
            <div className="space-y-2">
              {links.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className="block text-ink-muted text-sm hover:text-ink-primary transition-colors"
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="red-grad-rule w-6"></div>
              <span className="font-headline text-[10px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Info</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ['School', 'Palmetto High School'],
                ['District', 'Anderson School District One'],
                ['Instructor', 'Jack Wardlaw'],
                ['Credit', '1.0 Honors Weighted Elective'],
                ['Year', '2026–2027'],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-ink-faint w-20 flex-shrink-0">{label}</span>
                  <span className="text-ink-secondary">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-ink-faint text-xs">
            Athletic Leadership · Palmetto High School
          </div>
          <button
            onClick={() => navigate('/apply')}
            className="btn btn-primary !py-2 !px-5 !text-xs"
          >
            Apply Now →
          </button>
        </div>
      </div>
    </footer>
  )
}
