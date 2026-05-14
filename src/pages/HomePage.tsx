import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

export default function HomePage() {
  const navigate = useNavigate()
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()
  const s4 = useScrollReveal()
  const s5 = useScrollReveal()

  const counterRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = counterRef.current
    if (!el) return
    const counters = el.querySelectorAll<HTMLElement>('[data-count]')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const target = entry.target as HTMLElement
        const end = parseFloat(target.dataset.count || '0')
        const decimals = target.dataset.count?.includes('.') ? 1 : 0
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          target.textContent = (end * ease).toFixed(decimals)
          if (p < 1) requestAnimationFrame(tick)
          else target.textContent = end.toFixed(decimals)
        }
        requestAnimationFrame(tick)
        obs.unobserve(target)
      })
    }, { threshold: 0.5 })
    counters.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  const units = [
    { num: '01', title: '7 Habits & Leader in Me', desc: 'The leadership foundation. Every AL student starts here before anything else.', tag: 'Foundation', useLogo: true },
    { num: '02', title: 'Foundations of Athletic Leadership', desc: 'Leadership styles, team culture, communication, and ethics in athletics.', tag: null, useLogo: false },
    { num: '03', title: 'Athletic Department Structure', desc: 'How programs are built, funded, governed — from SCHSL compliance to booster clubs.', tag: null, useLogo: false },
    { num: '04', title: 'Event & Game Operations', desc: 'Plan, staff, and execute live athletic events all semester.', tag: null, useLogo: false },
    { num: '05', title: 'Equipment & Facility Management', desc: 'Inventory, facility prep, safety protocols, and behind-the-scenes ops.', tag: null, useLogo: false },
    { num: '06', title: 'Sports Media & Marketing', desc: 'Photography, videography, social media, branding — telling the Palmetto story.', tag: null, useLogo: false },
    { num: '07', title: 'Capstone Project', desc: 'Identify a real improvement opportunity, build a proposal, present to coaches and admin.', tag: 'Capstone', useLogo: false },
    { num: '↻', title: 'Semester-Long Internship', desc: 'Runs alongside all units from Week 3 through finals. Every student placed with a real program.', tag: 'Ongoing', useLogo: false },
  ]

  const ticker = [
    'Athletic Leadership', 'Leader in Me', 'Sports Media', 'Event Operations',
    'Equipment Management', 'Team Culture', 'Athletic Administration', 'Game Day Ops',
    'Sports Marketing', 'Internship Experience', 'Strength & Conditioning', 'Career Exploration',
  ]

  const careerCards = [
    {
      title: 'Sports Media & Broadcasting',
      desc: 'From game-day content to full broadcast careers.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#d81300]">
          <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
    },
    {
      title: 'Athletic Administration',
      desc: 'AD pipelines start with program-level experience.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#d81300]">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      title: 'Sports Business & Events',
      desc: 'Marketing, operations, and event management at every level.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#d81300]">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="pt-[100px]">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-base">
        {/* Soft red ambient glow — top-left */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(216,19,0,0.22) 0%, rgba(216,19,0,0.05) 35%, transparent 65%)' }} />
        {/* Secondary red glow — bottom-right counter-balance */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 100%, rgba(216,19,0,0.16) 0%, transparent 60%)' }} />
        {/* Horseshoe watermark — quieter, lower-right */}
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-[0.04]">
          <HorseshoeLogo className="w-[760px] h-[760px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28 w-full">
          <div className="max-w-3xl">
            <div className="reveal delay-0 flex items-center gap-3 mb-8">
              <div className="red-grad-rule w-12" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">
                Palmetto High School
              </span>
            </div>
            <h1 className="font-display leading-[0.9] tracking-tight mb-10">
              <span className="reveal delay-1 block text-[clamp(3.5rem,10vw,7.5rem)] text-ink-primary">athletic</span>
              <span className="reveal delay-2 block text-[clamp(3.5rem,10vw,7.5rem)]">
                <span className="red-grad-text">LEADER</span>
                <span className="text-ink-primary">ship</span>
              </span>
            </h1>
            <p className="reveal delay-3 font-body text-ink-secondary text-lg md:text-xl max-w-xl mb-5 leading-relaxed">
              An honors-weighted career course for students who want to lead, operate,
              and shape Palmetto athletics from the inside out.
            </p>
            <div className="reveal delay-4 font-headline text-ink-muted text-xs mb-12 tracking-[0.16em] uppercase font-bold flex flex-wrap gap-x-4 gap-y-1">
              <span>1.0 Honors Weighted Credit</span>
              <span className="text-ink-faint">·</span>
              <span>Grades 9–12</span>
              <span className="text-ink-faint">·</span>
              <span>Fall / Spring</span>
            </div>
            <div className="reveal delay-5 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/apply')} className="btn btn-primary">
                Apply for Selection
              </button>
              <button onClick={() => navigate('/about')} className="btn btn-outline">
                Course Overview →
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-headline text-[10px] tracking-[0.25em] uppercase text-ink-muted">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-ink-muted to-transparent" />
        </div>
      </section>

      {/* ─── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="red-textured-band py-4 overflow-hidden">
        <div className="marquee-track relative z-10">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-5 font-headline text-white text-xs tracking-[0.22em] uppercase font-black">
              {item}<span className="text-white/60">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── WHAT IS AL ───────────────────────────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6 relative overflow-hidden" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="io-slide-right mb-6" data-delay="0">
              <div className="flex items-center gap-3 mb-6">
                <div className="red-grad-rule w-10" />
                <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">About the Course</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-black leading-tight mb-6 text-ink-primary">
                More than a class.<br /><span className="red-grad-text">A career path.</span>
              </h2>
            </div>
            <div className="io-reveal space-y-5 text-ink-secondary leading-relaxed" data-delay="80">
              <p>
                Athletic Leadership is Palmetto's career-focused elective built around one question:
                <em className="text-ink-primary font-medium"> what does it actually take to run a championship program?</em>
              </p>
              <p>
                Students don't just learn about athletics — they work inside them. Through a semester-long
                internship, real event operations, media production, and project-based leadership,
                AL students get hands-on experience inside Palmetto Athletics.
              </p>
              <p>
                The course begins with the 7 Habits of Highly Effective People through the Leader
                in Me framework — building the leadership foundation everything else is built on.
              </p>
            </div>
          </div>
          <div ref={counterRef} className="grid grid-cols-2 gap-4">
            {[
              { count: '18', label: 'Weeks of Training', sub: 'Full semester' },
              { count: '1.0', label: 'HW Elective Credit', sub: 'Honors Weighted' },
              { count: '7', label: 'Course Units', sub: 'Starts with 7 Habits' },
              { count: '11', label: 'Career Pathways', sub: 'Explored in-course' },
            ].map(({ count, label, sub }, i) => (
              <div key={label}
                className="io-reveal card-dark red-card-edge p-7"
                data-delay={String(i * 80)}>
                <div className="font-headline text-5xl font-black red-grad-text mb-2 tabular-nums leading-none" data-count={count}>{count}</div>
                <div className="text-ink-primary font-bold text-sm">{label}</div>
                <div className="text-ink-muted text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UNITS GRID 2×4 ───────────────────────────────────────────────── */}
      <section className="bg-surface-raised py-24 md:py-28 px-6 relative" ref={s2}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal text-center mb-14 max-w-2xl mx-auto" data-delay="0">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="red-grad-rule-center w-12" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Outline</span>
              <div className="red-grad-rule-center w-12" />
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black mb-4">What You'll Cover</h2>
            <p className="text-ink-muted text-sm md:text-base leading-relaxed">
              Seven units plus a semester-long internship — starting with the 7 Habits, ending with the Capstone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {units.map(({ num, title, desc, tag, useLogo }, i) => (
              <div key={num}
                className={`io-reveal card-dark p-6 group cursor-default flex flex-col ${
                  num === '↻' ? 'border-brand-red/30' : ''
                }`}
                data-delay={String(i * 50)}>
                <div className="flex items-start justify-between mb-5">
                  {num !== '↻' ? (
                    <div className="font-headline text-2xl font-black text-brand-red leading-none">{num}</div>
                  ) : (
                    <div className="font-headline text-2xl font-black text-brand-red leading-none">↻</div>
                  )}
                  {tag && (
                    <span className="font-headline text-[9px] font-bold text-ink-secondary border border-white/10 px-2 py-0.5 uppercase tracking-[0.15em] rounded-sm">
                      {tag}
                    </span>
                  )}
                </div>
                {useLogo && (
                  <div className="mb-3">
                    <LeaderInMeLogo className="w-16 h-16 object-contain" />
                  </div>
                )}
                <h3 className="font-headline text-ink-primary text-sm font-black mb-2 leading-tight group-hover:text-brand-red transition-colors">
                  {title}
                </h3>
                <p className="text-ink-muted text-xs leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>

          <div className="io-reveal text-center mt-14" data-delay="200">
            <button onClick={() => navigate('/about')} className="btn btn-outline">
              Full Course Details →
            </button>
          </div>
        </div>
      </section>

      {/* ─── LEADER IN ME STRIP ───────────────────────────────────────────── */}
      <section className="bg-surface-raised py-20 md:py-24 px-6 relative" ref={s4}>
        <div className="max-w-6xl mx-auto">
          <div className="io-reveal card-dark red-card-edge p-8 md:p-10 flex flex-col md:flex-row items-center gap-8" data-delay="0">
            <LeaderInMeLogo className="w-28 h-28 object-contain flex-shrink-0" />
            <div className="flex-1">
              <div className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary mb-3">Foundation — Unit 01</div>
              <h3 className="font-headline text-2xl md:text-3xl font-black mb-3 text-ink-primary leading-tight">Every student starts with the 7 Habits</h3>
              <p className="text-ink-secondary text-sm leading-relaxed max-w-2xl">
                Before operations, media, or equipment — every AL student builds a leadership
                foundation through the <strong className="text-ink-primary">Leader in Me</strong> framework.
                The 7 Habits become the operating principles AL students apply across their internships, projects, and leadership work all semester.
              </p>
            </div>
            <button onClick={() => navigate('/about')} className="btn btn-outline flex-shrink-0">
              See Unit 01 →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CAREERS CALLOUT ──────────────────────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6 relative" ref={s5}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-10" data-delay="0">
            <div className="red-grad-rule w-10" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Where This Takes You</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {careerCards.map(({ title, desc, icon }, i) => (
              <div key={title}
                className="io-reveal card-dark card-lift p-8 group"
                data-delay={String(i * 80)}>
                <div className="mb-5">
                  {icon}
                </div>
                <h3 className="font-headline text-ink-primary text-lg font-black mb-2 group-hover:text-brand-red transition-colors leading-tight">{title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="io-reveal text-center mt-12" data-delay="200">
            <button onClick={() => navigate('/careers')} className="btn btn-outline">
              Explore All Career Pathways →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-surface-raised py-28 md:py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 30% 0%, rgba(216,19,0,0.22) 0%, rgba(216,19,0,0.04) 40%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 100%, rgba(216,19,0,0.18) 0%, transparent 60%)' }} />
        <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/4 opacity-[0.04] pointer-events-none">
          <HorseshoeLogo className="w-[600px] h-[600px] object-contain" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="reveal delay-0 flex items-center justify-center gap-3 mb-6">
            <div className="red-grad-rule-center w-12" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Apply Now</span>
            <div className="red-grad-rule-center w-12" />
          </div>
          <h2 className="reveal delay-1 font-headline text-4xl md:text-6xl font-black text-ink-primary leading-[1.05] mb-6">
            Ready to be part of<br /><span className="red-grad-text">Palmetto Athletics?</span>
          </h2>
          <p className="reveal delay-2 text-ink-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Athletic Leadership is selective. Submit your application — Coach Wardlaw reviews every one personally.
          </p>
          <div className="reveal delay-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/apply')} className="btn btn-primary">
              Submit Application
            </button>
            <button onClick={() => navigate('/salt')} className="btn btn-outline">
              Meet the Team
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
