import { Page } from '../App'
import { HorseshoeLogo } from './Logos'

interface Props {
  navigate: (page: Page) => void
}

export default function Footer({ navigate }: Props) {
  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'The SALT', page: 'salt' },
    { label: 'Careers', page: 'careers' },
    { label: 'Apply', page: 'apply' },
  ]

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <HorseshoeLogo className="w-10 h-10 object-contain" />
              <div>
                <div className="text-white font-black text-sm tracking-[0.1em] uppercase">Athletic Leadership</div>
                <div className="text-[#d81300] text-[10px] font-bold tracking-[0.2em] uppercase">Palmetto High School</div>
              </div>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              A career-focused honors elective building the next generation of athletic leaders through real experience.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-4">Navigation</div>
            <div className="space-y-2">
              {links.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className="block text-gray-500 text-sm hover:text-white transition-colors underline-grow"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-4">Course Info</div>
            <div className="space-y-2 text-gray-500 text-xs">
              {[
                ['School', 'Palmetto High School'],
                ['District', 'Anderson School District One'],
                ['Instructor', 'Mr. Jack Wardlaw'],
                ['Credit', '1.0 Honors Elective (HW)'],
                ['Year', '2026–2027'],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-700 w-20 flex-shrink-0">{label}</span>
                  <span className="text-gray-400">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-gray-700 text-xs">
            Athletic Leadership &amp; Operations · Palmetto High School · Anderson District One
          </div>
          <button
            onClick={() => navigate('apply')}
            className="px-5 py-2 bg-[#d81300] text-white font-black text-xs tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-all duration-200 hover:shadow-lg hover:shadow-[#d81300]/30"
          >
            Apply Now →
          </button>
        </div>
      </div>
    </footer>
  )
}
