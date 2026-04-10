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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Bold red strip at very top */}
      <div className="h-1 bg-[#d81300] w-full" />

      <div className="bg-[#0f0f0f]/96 backdrop-blur-md border-b border-[#d81300]/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

          {/* Logo + wordmark */}
          <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
            {/* Red left accent on logo */}
            <div className="relative">
              <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-[#d81300]" />
              <HorseshoeLogo className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <div
                className="text-white text-sm leading-tight tracking-[0.18em] uppercase"
                style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
              >
                Athletic Leadership
              </div>
              <div className="text-[#d81300] text-[10px] font-black tracking-[0.25em] uppercase">
                Palmetto High School
              </div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {/* Red left border on nav link group */}
            <div className="flex items-center border-l border-[#d81300]/30 pl-6 gap-1">
              {links.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className={`relative px-4 py-2 text-xs font-black tracking-[0.1em] uppercase transition-all duration-200 group ${
                    currentPage === page
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {/* Active: full red bg pill */}
                  {currentPage === page && (
                    <span className="absolute inset-0 bg-[#d81300]/15 border-b-2 border-[#d81300]" />
                  )}
                  <span className="relative">{label}</span>
                  {/* Hover underline */}
                  {currentPage !== page && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#d81300] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('apply')}
              className="ml-5 px-5 py-2 bg-[#d81300] text-white text-xs font-black tracking-[0.12em] uppercase hover:bg-[#ff1a00] transition-all duration-200 hover:shadow-lg hover:shadow-[#d81300]/40 hover:-translate-y-px"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#111] border-b border-[#d81300]/20 px-6 py-4 space-y-1">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMenuOpen(false) }}
              className={`block w-full text-left px-3 py-3 text-xs font-black tracking-[0.12em] uppercase border-b border-white/5 transition-colors ${
                currentPage === page ? 'text-[#d81300]' : 'text-gray-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { navigate('apply'); setMenuOpen(false) }}
            className="block w-full text-center px-4 py-3 bg-[#d81300] text-white font-black text-xs tracking-[0.12em] uppercase mt-3 hover:bg-[#ff1a00] transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </nav>
  )
}
