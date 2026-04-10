import { useState } from 'react'
import { Page } from '../App'
import { HorseshoeLogo } from './Logos'

interface NavProps {
  currentPage: Page
  navigate: (page: Page) => void
}

export default function Nav({ currentPage, navigate }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'The SALT', page: 'salt' },
    { label: 'Careers', page: 'careers' },
    { label: 'Apply', page: 'apply' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#d81300]/20">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
          <HorseshoeLogo className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110" />
          <div className="hidden sm:block">
            <div className="text-white font-black text-sm tracking-[0.12em] uppercase leading-tight">
              Athletic Leadership
            </div>
            <div className="text-[#d81300] text-[10px] font-bold tracking-[0.2em] uppercase">
              Palmetto High School
            </div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`relative px-4 py-2 text-sm font-bold tracking-[0.08em] uppercase transition-all duration-200 group ${
                currentPage === page ? 'text-[#d81300]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#d81300] transition-all duration-300 ${
                currentPage === page ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
          <button
            onClick={() => navigate('apply')}
            className="ml-4 px-5 py-2 bg-[#d81300] text-white text-sm font-black tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-all duration-200 hover:shadow-lg hover:shadow-[#d81300]/30 hover:-translate-y-px"
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

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#111] border-t border-[#d81300]/20 px-6 py-4 space-y-1">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMenuOpen(false) }}
              className={`block w-full text-left px-3 py-3 text-sm font-bold tracking-[0.1em] uppercase border-b border-white/5 transition-colors ${
                currentPage === page ? 'text-[#d81300]' : 'text-gray-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { navigate('apply'); setMenuOpen(false) }}
            className="block w-full text-center px-4 py-3 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase mt-3 hover:bg-[#ff1a00] transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </nav>
  )
}
