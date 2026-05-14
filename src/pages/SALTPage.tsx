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
    <div className="pt-[100px]">
      {/* HEADER */}
      <section className="relative py-24 md:py-28 px-6 overflow-hidden bg-surface-base">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(216,19,0,0.22) 0%, rgba(216,19,0,0.05) 35%, transparent 65%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.05]">
          <HorseshoeLogo className="w-full h-full object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="red-grad-rule w-12" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Student Organization</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-4">
            The <span className="red-grad-text">SALT</span>
          </h1>
          <p className="font-headline text-2xl md:text-3xl font-black text-ink-secondary mb-6 tracking-wide">
            We season the program.
          </p>
          <p className="reveal delay-1 text-ink-secondary text-lg max-w-2xl leading-relaxed">
            Students in Athletic Leadership have the opportunity to earn a role on the <strong className="text-ink-primary">Student Athletic Leadership Team</strong>, where they take on real leadership responsibilities that keep Palmetto Athletics running at every level.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-surface-raised py-24 md:py-28 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <div className="io-slide-right" data-delay="0">
              <div className="flex items-center gap-3 mb-5">
                <div className="red-grad-rule w-10" />
                <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Mission</span>
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-black mb-6 text-ink-primary leading-tight">Built to serve.<br /><span className="red-grad-text">Trained to lead.</span></h2>
            </div>
            <div className="io-reveal space-y-5 text-ink-secondary leading-relaxed" data-delay="80">
              <p>
                SALT members aren't observers — they're contributors. They show up before
                games start, stay after they end, and spend the weeks between building the
                systems that make programs successful.
              </p>
              <p>
                Membership through Athletic Leadership is selective. Every SALT member is
                chosen for character, work ethic, and commitment to the Palmetto athletic culture.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            {[
              'Develop student leadership within athletics',
              'Increase student involvement in programs',
              'Strengthen school spirit and pride',
              'Provide real operational support to coaches',
              'Promote positive sportsmanship and culture',
            ].map((item, i) => (
              <div key={item}
                className="io-reveal flex gap-3 items-start card-dark p-4"
                data-delay={String(i * 60)}>
                <span className="text-brand-red font-black text-base leading-tight flex-shrink-0">✓</span>
                <span className="text-ink-secondary text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="bg-surface-base py-24 md:py-28 px-6" ref={s2}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-4" data-delay="0">
            <div className="red-grad-rule w-10" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Team Structure</span>
          </div>
          <h2 className="io-reveal font-headline text-4xl md:text-5xl font-black mb-12 leading-tight" data-delay="40">SALT <span className="red-grad-text">Leadership</span> Roles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(({ key, title, desc, responsibilities }, i) => (
              <div key={key}
                className="io-reveal card-dark red-card-edge p-7 group"
                data-delay={String(i * 60)}>
                <div className="text-brand-red mb-5 transition-transform duration-300 group-hover:scale-110 origin-left">
                  {Icons[key as keyof typeof Icons]}
                </div>
                <h3 className="font-headline text-ink-primary text-lg font-black mb-2 group-hover:text-brand-red transition-colors leading-tight">
                  {title}
                </h3>
                <p className="text-ink-muted text-sm mb-4 leading-relaxed">{desc}</p>
                <div className="border-t border-white/[0.06] pt-4 space-y-1.5">
                  {responsibilities.map(r => (
                    <div key={r} className="text-xs text-ink-secondary flex gap-2">
                      <span className="text-brand-red/60 flex-shrink-0">—</span>{r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIP PLACEMENTS */}
      <section className="bg-surface-raised py-24 md:py-28 px-6" ref={s3}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-4" data-delay="0">
            <div className="red-grad-rule w-10" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Internship Program</span>
          </div>
          <h2 className="io-reveal font-headline text-4xl md:text-5xl font-black mb-5 leading-tight" data-delay="40">Where SALT <span className="red-grad-text">Members Work</span></h2>
          <p className="io-reveal text-ink-secondary mb-12 max-w-2xl leading-relaxed" data-delay="80">
            Every SALT member is placed in a real internship role within Palmetto's athletic programs — working directly alongside coaches, athletic trainers, and event staff from Week 3 through finals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {placements.map(({ icon, label }, i) => (
              <div key={label}
                className="io-reveal card-dark card-lift p-5 text-center group"
                data-delay={String(i * 60)}>
                <div className="text-brand-red flex justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </div>
                <div className="font-headline text-ink-primary text-xs font-bold uppercase tracking-[0.12em] whitespace-pre-line leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 HABITS */}
      <section className="bg-surface-base py-24 md:py-28 px-6" ref={s4}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="io-slide-right" data-delay="0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="red-grad-rule w-10" />
                  <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Our Foundation</span>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl font-black mb-6 leading-tight"><span className="red-grad-text">7 Habits.</span><br />Athletic application.</h2>
              </div>
              <div className="io-reveal" data-delay="80">
                <p className="text-ink-secondary leading-relaxed mb-6">
                  Every SALT member starts with the 7 Habits of Highly Effective People through
                  the Leader in Me framework. These habits aren't classroom theory — they're
                  the operating principles SALT members apply every day in their roles.
                </p>
                <LeaderInMeLogo className="w-56 h-56 object-contain opacity-90" />
              </div>
            </div>
            <div className="space-y-2.5">
              {habits.map(({ num, title, desc }, i) => (
                <div key={num}
                  className="io-reveal flex gap-4 items-start card-dark p-4"
                  data-delay={String(i * 50)}>
                  <div className="w-8 h-8 bg-brand-red flex items-center justify-center font-black text-white text-xs flex-shrink-0 rounded-sm">{num}</div>
                  <div>
                    <div className="text-ink-primary font-bold text-sm">{title}</div>
                    <div className="text-ink-muted text-xs mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="bg-surface-raised py-24 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-dark red-card-edge p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="red-grad-rule w-10" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Instructor</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h3 className="font-headline text-3xl font-black mb-1 leading-tight">Mr. Jack Wardlaw</h3>
                <div className="text-brand-red text-sm font-bold tracking-wide mb-4">Health/PE Teacher · Football Coach · Palmetto High School</div>
                <p className="text-ink-secondary leading-relaxed text-sm mb-6">
                  Coach Wardlaw brings experience as a Health/PE educator, football coach, and doctoral student in Educational Leadership to this course. Athletic Leadership is built from real knowledge of what it takes to run high school athletic programs at a high level.
                </p>
                <button onClick={() => navigate('/instructor')} className="btn btn-outline">
                  Full Instructor Profile →
                </button>
              </div>
              <div className="space-y-3">
                {['Anderson School District One', 'Palmetto High School', 'Health / PE Educator', 'Football Coach', 'Doctoral Student — Ed. Leadership'].map(t => (
                  <div key={t} className="text-ink-secondary text-xs border-l-2 border-brand-red/40 pl-3 py-0.5">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-surface-base py-24 md:py-28 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 0%, rgba(216,19,0,0.22) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 100%, rgba(216,19,0,0.18) 0%, transparent 60%)' }} />
        <HorseshoeLogo className="relative w-16 h-16 object-contain mx-auto mb-6 opacity-30" />
        <h2 className="relative font-headline text-3xl md:text-5xl font-black text-ink-primary mb-4 leading-tight">Think you have <span className="red-grad-text">what it takes?</span></h2>
        <p className="relative text-ink-secondary mb-8 max-w-xl mx-auto leading-relaxed">SALT membership is earned. Applications open for 2026–2027.</p>
        <button onClick={() => navigate('/apply')} className="relative btn btn-primary">
          Apply for SALT
        </button>
      </section>

      <Footer />
    </div>
  )
}
