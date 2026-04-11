import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

// Monochrome SVG icons
const Icons = {
  operations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  equipment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  spirit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  development: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
}

export default function SALTPage() {
  const navigate = useNavigate()
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()
  const s3 = useScrollReveal()
  const s4 = useScrollReveal()

  const roles = [
    { key: 'operations', title: 'Operations Lead', desc: 'Oversees game-day logistics, facility setup, event coordination, and day-of operations for athletic events.', responsibilities: ['Game day setup & breakdown', 'Facility coordination', 'Staff communication', 'Event timeline management'] },
    { key: 'media', title: 'Media & Content Lead', desc: 'Manages photography, videography, social media content, and all digital promotion of Palmetto Athletics.', responsibilities: ['Game day photography/film', 'Social media content', 'Highlight production', 'Athlete spotlights'] },
    { key: 'equipment', title: 'Equipment Manager', desc: 'Tracks, maintains, and organizes all athletic equipment and uniform inventory across programs.', responsibilities: ['Inventory tracking', 'Equipment distribution', 'Uniform management', 'Safety inspections'] },
    { key: 'spirit', title: 'Spirit & Engagement Lead', desc: 'Designs and runs school spirit initiatives, student section themes, and fan engagement at events.', responsibilities: ['Theme night planning', 'Student section coordination', 'Promotional campaigns', 'Fan experience activities'] },
    { key: 'development', title: 'Athletic Development Asst.', desc: 'Supports weight room and conditioning programs, tracks athlete progress, and assists with training operations.', responsibilities: ['Weight room setup', 'Athlete monitoring', 'Training logs', 'Performance data collection'] },
    { key: 'community', title: 'Community Relations Coord.', desc: 'Connects athletic programs with the community through outreach, partnerships, and engagement initiatives.', responsibilities: ['Youth camp planning', 'Sponsor coordination', 'Community outreach', 'Partnership development'] },
  ]

  const habits = [
    { num: '1', title: 'Be Proactive', desc: 'Take initiative in supporting athletic programs and proposing solutions without being asked.' },
    { num: '2', title: 'Begin with the End in Mind', desc: 'Set clear goals for internship experiences, leadership growth, and capstone impact.' },
    { num: '3', title: 'Put First Things First', desc: 'Manage time between academics, internships, and project deadlines.' },
    { num: '4', title: 'Think Win-Win', desc: 'Develop solutions that benefit both athletic programs and the broader school community.' },
    { num: '5', title: 'Seek First to Understand', desc: 'Listen before acting. Practice real communication with coaches, staff, and peers.' },
    { num: '6', title: 'Synergize', desc: 'Work as a team to plan events, develop media, and build the culture of Palmetto Athletics.' },
    { num: '7', title: 'Sharpen the Saw', desc: 'Reflect continuously on leadership growth, professional skills, and personal responsibility.' },
  ]

  const placements = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>, label: 'Team Student\nAssistant' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, label: 'Athletic Media\nAssistant' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Event Operations\nAssistant' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>, label: 'Equipment\nAssistant' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>, label: 'Strength & Conditioning\nAssistant' },
  ]

  return (
    <div className="pt-16">
      {/* HEADER */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#0f0f0f]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d81300]" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d81300]" />
        <div className="absolute inset-0 bg-[#d81300]/5" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(216,19,0,0.18) 0%, transparent 65%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.06]">
          <HorseshoeLogo className="w-full h-full object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto pl-6">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Student Organization</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-6"
            style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
            The <span className="text-[#d81300]">SALT</span><br />Team
          </h1>
          <p className="reveal delay-1 text-gray-400 text-lg max-w-2xl leading-relaxed">
            Students enrolled in Athletic Leadership form the <strong className="text-white">Student Athletic Leadership Team</strong> —
            the operational backbone of Palmetto Athletics.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#111] py-20 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <div className="io-slide-right" data-delay="0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#d81300]" />
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">Built to Serve.<br />Trained to Lead.</h2>
            </div>
            <div className="io-reveal" data-delay="80">
              <p className="text-gray-400 leading-relaxed mb-5">
                SALT members aren't observers — they're contributors. They show up before
                games start, stay after they end, and spend the weeks between building the
                systems that make programs successful.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Membership through Athletic Leadership is selective. Every SALT member is
                chosen for character, work ethic, and commitment to the Palmetto athletic culture.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            {[
              'Develop student leadership within athletics',
              'Increase student involvement in programs',
              'Strengthen school spirit and pride',
              'Provide real operational support to coaches',
              'Promote positive sportsmanship and culture',
            ].map((item, i) => (
              <div key={item}
                className="io-reveal flex gap-3 items-start bg-[#0f0f0f] border-l-2 border-[#d81300]/50 pl-4 py-3 pr-3"
                data-delay={String(i * 60)}>
                <span className="text-[#d81300] font-black text-base leading-tight flex-shrink-0">✓</span>
                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="bg-[#0f0f0f] py-20 px-6" ref={s2}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-3" data-delay="0">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Team Structure</span>
          </div>
          <h2 className="io-reveal text-4xl font-black mb-12" data-delay="40">SALT Leadership Roles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#d81300]/15">
            {roles.map(({ key, title, desc, responsibilities }, i) => (
              <div key={key}
                className="io-reveal bg-[#111] p-6 hover:bg-[#181818] transition-all duration-300 group"
                data-delay={String(i * 60)}>
                <div className="text-[#d81300] mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">
                  {Icons[key as keyof typeof Icons]}
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2 group-hover:text-[#d81300] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">{desc}</p>
                <div className="border-t border-white/5 pt-3 space-y-1">
                  {responsibilities.map(r => (
                    <div key={r} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#d81300]/50 flex-shrink-0">—</span>{r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIP PLACEMENTS */}
      <section className="bg-[#111] py-20 px-6" ref={s3}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-3" data-delay="0">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Internship Program</span>
          </div>
          <h2 className="io-reveal text-4xl font-black mb-4" data-delay="40">Where SALT Members Work</h2>
          <p className="io-reveal text-gray-400 mb-10 max-w-2xl text-sm leading-relaxed" data-delay="80">
            Every SALT member is placed in a real internship role within Palmetto's athletic programs — working directly alongside coaches, athletic trainers, and event staff from Week 3 through finals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {placements.map(({ icon, label }, i) => (
              <div key={label}
                className="io-reveal bg-[#0f0f0f] border border-white/5 p-5 text-center hover:border-[#d81300]/40 transition-all duration-300 group card-lift"
                data-delay={String(i * 60)}>
                <div className="text-[#d81300] flex justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </div>
                <div className="text-white text-xs font-bold uppercase tracking-wide whitespace-pre-line leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 HABITS */}
      <section className="bg-[#0f0f0f] py-20 px-6" ref={s4}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="io-slide-right" data-delay="0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#d81300]" />
                  <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Our Foundation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">7 Habits.<br />Athletic Application.</h2>
              </div>
              <div className="io-reveal" data-delay="80">
                <p className="text-gray-400 leading-relaxed mb-6">
                  Every SALT member starts with the 7 Habits of Highly Effective People through
                  the Leader in Me framework. These habits aren't classroom theory — they're
                  the operating principles SALT members apply every day in their roles.
                </p>
                <LeaderInMeLogo className="w-36 h-36 object-contain opacity-90" />
              </div>
            </div>
            <div className="space-y-2">
              {habits.map(({ num, title, desc }, i) => (
                <div key={num}
                  className="io-reveal flex gap-4 items-start bg-[#111] border border-white/5 p-4 hover:border-[#d81300]/20 transition-colors"
                  data-delay={String(i * 50)}>
                  <div className="w-8 h-8 bg-[#d81300] flex items-center justify-center font-black text-white text-xs flex-shrink-0">{num}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{title}</div>
                    <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="bg-[#111] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f0f0f] border border-[#d81300]/20 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Instructor</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-black mb-1">Mr. Jack Wardlaw</h3>
                <div className="text-[#d81300] text-sm font-bold tracking-wide mb-4">Health/PE Teacher · Football Coach · Palmetto High School</div>
                <p className="text-gray-400 leading-relaxed text-sm mb-4">
                  Coach Wardlaw brings experience as a Health/PE educator, football coach, and doctoral student in Educational Leadership to this course. Athletic Leadership is built from real knowledge of what it takes to run high school athletic programs at a high level.
                </p>
                <button onClick={() => navigate('/instructor')}
                  className="px-5 py-2 border border-[#d81300]/50 text-[#d81300] font-black text-xs tracking-[0.1em] uppercase hover:bg-[#d81300] hover:text-white transition-all duration-200">
                  Full Instructor Profile →
                </button>
              </div>
              <div className="space-y-3">
                {['Anderson School District One', 'Palmetto High School', 'Health / PE Educator', 'Football Coach', 'Doctoral Student — Ed. Leadership'].map(t => (
                  <div key={t} className="text-gray-400 text-xs border-l-2 border-[#d81300]/40 pl-3">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#d81300] py-16 px-6 overflow-hidden text-center">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <HorseshoeLogo className="w-20 h-20 object-contain mx-auto mb-6 opacity-20 relative" />
        <h2 className="relative text-3xl md:text-4xl font-black text-white mb-4">Think You Have What It Takes?</h2>
        <p className="relative text-white/70 mb-8">SALT membership is earned. Applications open for 2026–2027.</p>
        <button onClick={() => navigate('/apply')}
          className="relative px-10 py-4 bg-white text-[#d81300] font-black text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-all duration-200">
          Apply for SALT
        </button>
      </section>

      <Footer />
    </div>
  )
}
