import { useEffect, useRef } from 'react'
import { Page } from '../App'
import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

interface Props { navigate: (page: Page) => void }

export default function HomePage({ navigate }: Props) {
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()
  const s3 = useScrollReveal()
  const s4 = useScrollReveal()
  const s5 = useScrollReveal()

  // Animated counter
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

  const pillars = [
    { num: '01', icon: '🧠', title: '7 Habits & Leader in Me', desc: 'Every AL student begins with the leadership foundation — the 7 Habits applied directly to athletics.' },
    { num: '02', icon: '🏛️', title: 'Athletic Department Structure', desc: 'How programs are built, funded, governed, and organized at every level.' },
    { num: '03', icon: '🏟️', title: 'Event & Game Operations', desc: 'Students assist with live athletic events — this is not a simulation.' },
    { num: '04', icon: '🎽', title: 'Equipment & Facilities', desc: 'Inventory systems, facility prep, safety protocols, and behind-the-scenes ops.' },
    { num: '05', icon: '📸', title: 'Sports Media & Marketing', desc: 'Photography, videography, social media, branding — telling the Palmetto story.' },
    { num: '06', icon: '🤝', title: 'Internship Experience', desc: 'Real hours. Real programs. Every student is placed with a coach or athletic organization.' },
  ]

  const ticker = [
    'Athletic Leadership', 'Leader in Me', 'Sports Media', 'Event Operations',
    'Equipment Management', 'Team Culture', 'Athletic Administration', 'Game Day Ops',
    'Sports Marketing', 'Internship Experience', 'Strength & Conditioning', 'Career Exploration',
  ]

  return (
    <div className="pt-16">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0f0f0f]">
        {/* Grid bg */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(216,19,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(216,19,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* Red diagonal sweep */}
        <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(216,19,0,0.07) 100%)' }} />
        {/* Vertical red accent line */}
        <div className="absolute left-[calc(50%-2px)] top-0 bottom-0 w-px bg-[#d81300]/10 hidden lg:block" />

        {/* Watermark horseshoe */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none select-none opacity-[0.04]">
          <HorseshoeLogo className="w-[700px] h-[700px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="reveal delay-0 flex items-center gap-3 mb-6">
              <div className="h-0.5 w-10 bg-[#d81300] origin-left" style={{ animation: 'lineGrow 0.5s ease forwards' }} />
              <span className="text-[#d81300] text-xs font-black tracking-[0.35em] uppercase">
                Palmetto High School · Anderson District One
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-black leading-[0.88] tracking-tight mb-8">
              <span className="reveal delay-1 block text-[clamp(3.5rem,10vw,7.5rem)] text-white">ATHLETIC</span>
              <span className="reveal delay-2 block text-[clamp(3.5rem,10vw,7.5rem)]">
                <span className="text-[#d81300]">LEADER</span>
                <span className="text-white">SHIP</span>
              </span>
            </h1>

            <p className="reveal delay-3 text-gray-400 text-lg md:text-xl max-w-xl mb-3 leading-relaxed font-light">
              An honors-weighted career course for students who want to lead, operate, 
              and shape Palmetto athletics from the inside out.
            </p>
            <p className="reveal delay-4 text-gray-600 text-sm mb-10 tracking-wide font-bold uppercase">
              1.0 Honors Credit &nbsp;·&nbsp; Grades 9–12 &nbsp;·&nbsp; Fall Semester
            </p>

            <div className="reveal delay-5 flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('apply')}
                className="px-8 py-4 bg-[#d81300] text-white font-black text-sm tracking-[0.15em] uppercase hover:bg-[#ff1a00] transition-all duration-200 hover:shadow-xl hover:shadow-[#d81300]/30 hover:-translate-y-0.5">
                Apply for Selection
              </button>
              <button onClick={() => navigate('about')}
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.15em] uppercase hover:border-white/50 hover:bg-white/5 transition-all duration-200">
                Course Overview →
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="reveal-fade delay-7 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ─── MARQUEE TICKER ───────────────────────────────────────────────── */}
      <div className="bg-[#d81300] py-3 overflow-hidden">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4 text-white/90 font-black text-xs tracking-[0.2em] uppercase">
              {item}
              <span className="text-white/40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── WHAT IS AL ────────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-24 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="io-slide-right mb-6" data-delay="0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#d81300]" />
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">About the Course</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                More Than A Class.
                <br /><span className="text-[#d81300]">A Career Path.</span>
              </h2>
            </div>
            <div className="io-reveal" data-delay="80">
              <p className="text-gray-400 leading-relaxed mb-5">
                Athletic Leadership is Palmetto's career-focused elective built around one question:
                <em className="text-white"> What does it actually take to run a championship program?</em>
              </p>
              <p className="text-gray-400 leading-relaxed mb-5">
                Students don't just learn about athletics — they work inside them. Through hands-on 
                internships, real event operations, media production, and project-based leadership, 
                AL students are the backbone of Palmetto Athletics.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The course begins with the 7 Habits of Highly Effective People through the Leader 
                in Me framework — building the leadership foundation everything else is built on.
              </p>
            </div>
          </div>

          {/* Animated stat counters */}
          <div ref={counterRef} className="grid grid-cols-2 gap-4">
            {[
              { count: '18', label: 'Weeks of Training', sub: 'Full semester' },
              { count: '1.0', label: 'Honors Credit', sub: 'Weighted elective (HW)' },
              { count: '7', label: 'Course Units', sub: 'Start with 7 Habits' },
              { count: '11', label: 'Career Pathways', sub: 'Explored in-course' },
            ].map(({ count, label, sub }, i) => (
              <div key={label}
                className={`io-reveal bg-[#0f0f0f] border border-[#d81300]/20 p-6 card-lift glow-red-hover`}
                data-delay={String(i * 80)}>
                <div className="text-4xl font-black text-[#d81300] mb-1 tabular-nums" data-count={count}>
                  {count}
                </div>
                <div className="text-white font-bold text-sm uppercase tracking-wide">{label}</div>
                <div className="text-gray-500 text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSE PILLARS ───────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-24 px-6" ref={s2}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal text-center mb-16" data-delay="0">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Outline</span>
              <div className="w-8 h-0.5 bg-[#d81300]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black">What You'll Cover</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
              Seven units across a full semester — starting with the leadership foundation, 
              moving through operations, media, and a real internship.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {pillars.map(({ num, icon, title, desc }, i) => (
              <div key={num}
                className="io-reveal bg-[#111] p-8 hover:bg-[#161616] transition-all duration-300 group cursor-default card-lift"
                data-delay={String(i * 60)}>
                <div className="text-[#d81300] text-xs font-black tracking-[0.2em] mb-3">UNIT {num}</div>
                <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">{icon}</div>
                <h3 className="font-black text-white text-base mb-3 uppercase tracking-wide group-hover:text-[#d81300] transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 h-0.5 w-0 bg-[#d81300]/40 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
          <div className="io-reveal text-center mt-10" data-delay="200">
            <button onClick={() => navigate('about')}
              className="px-8 py-3 border border-white/15 text-white font-bold text-sm tracking-[0.12em] uppercase hover:border-[#d81300]/60 hover:text-[#d81300] hover:bg-[#d81300]/5 transition-all duration-200">
              Full Course Details →
            </button>
          </div>
        </div>
      </section>

      {/* ─── SALT CALLOUT ─────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-20 px-6" ref={s3}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="io-reveal flex-shrink-0" data-delay="0">
            <HorseshoeLogo className="w-44 h-44 object-contain transition-transform duration-500 hover:scale-105" />
          </div>
          <div>
            <div className="io-slide-right mb-4" data-delay="80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#d81300]" />
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Student Organization</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                AL students form the <span className="text-[#d81300]">SALT</span> Team
              </h2>
            </div>
            <div className="io-reveal" data-delay="160">
              <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
                The Student Athletic Leadership Team is the organization that brings this 
                course to life. SALT members hold real roles — Operations, Media, Equipment, 
                Spirit, Development, Community — and contribute to Palmetto Athletics every week.
              </p>
              <button onClick={() => navigate('salt')}
                className="px-6 py-3 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-all duration-200 hover:shadow-lg hover:shadow-[#d81300]/30 hover:-translate-y-0.5">
                Meet the SALT Team →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEADER IN ME STRIP ───────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-16 px-6" ref={s4}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal bg-gradient-to-r from-[#d81300]/10 to-transparent border border-[#d81300]/20 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8" data-delay="0">
            <LeaderInMeLogo className="w-28 h-28 object-contain flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase mb-3">Foundation — Unit 01</div>
              <h3 className="text-2xl md:text-3xl font-black mb-3">Every student starts with the 7 Habits</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Before operations, media, or equipment — every AL student builds a leadership 
                foundation through the <strong className="text-white">Leader in Me</strong> framework. 
                The 7 Habits aren't a worksheet. They become the operating principles of everything 
                SALT members do all semester.
              </p>
            </div>
            <button onClick={() => navigate('about')}
              className="flex-shrink-0 px-6 py-3 border border-[#d81300]/40 text-[#d81300] font-black text-xs tracking-[0.12em] uppercase hover:bg-[#d81300] hover:text-white transition-all duration-200">
              See Unit 01 →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CAREERS CALLOUT ──────────────────────────────────────────────── */}
      <section className="bg-[#111] py-16 px-6" ref={s5}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-1">
            {[
              { emoji: '🎙️', title: 'Sports Media & Broadcasting', desc: 'From game-day content to full broadcast careers.' },
              { emoji: '🏛️', title: 'Athletic Administration', desc: 'AD pipelines start with program-level experience.' },
              { emoji: '💼', title: 'Sports Business & Events', desc: 'Marketing, operations, and event management at every level.' },
            ].map(({ emoji, title, desc }, i) => (
              <div key={title}
                className="io-reveal bg-[#0f0f0f] border border-white/5 p-8 hover:border-[#d81300]/30 transition-colors duration-300 group card-lift"
                data-delay={String(i * 80)}>
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2 group-hover:text-[#d81300] transition-colors">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="io-reveal text-center mt-8" data-delay="200">
            <button onClick={() => navigate('careers')}
              className="px-8 py-3 border border-white/15 text-white font-bold text-sm tracking-[0.12em] uppercase hover:border-[#d81300]/60 hover:text-[#d81300] transition-all duration-200">
              Explore All Career Pathways →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#d81300] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none">
          <HorseshoeLogo className="w-96 h-96 object-contain" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="reveal text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Ready to Be Part of Palmetto Athletics?
          </h2>
          <p className="reveal delay-1 text-white/70 text-lg mb-10">
            Athletic Leadership is selective. Submit your application — Mr. Wardlaw reviews every one personally.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('apply')}
              className="px-10 py-4 bg-white text-[#d81300] font-black text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              Submit Application
            </button>
            <button onClick={() => navigate('salt')}
              className="px-10 py-4 border-2 border-white/60 text-white font-black text-sm tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white transition-all duration-200">
              Meet the Team
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
