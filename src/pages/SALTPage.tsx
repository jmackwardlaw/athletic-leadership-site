import { Page } from '../App'
import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import Footer from '../components/Footer'

interface Props {
  navigate: (page: Page) => void
}

export default function SALTPage({ navigate }: Props) {
  const roles = [
    { title: 'Operations Lead', icon: '—', desc: 'Oversees game-day logistics, facility setup, event coordination, and day-of operations for athletic events.', responsibilities: ['Game day setup & breakdown', 'Facility coordination', 'Staff communication', 'Event timeline management'] },
    { title: 'Media & Content Lead', icon: '—', desc: 'Manages photography, videography, social media content, and all digital promotion of Palmetto Athletics.', responsibilities: ['Game day photography/film', 'Social media content', 'Highlight production', 'Athlete spotlights'] },
    { title: 'Equipment Manager', icon: '—', desc: 'Tracks, maintains, and organizes all athletic equipment and uniform inventory across programs.', responsibilities: ['Inventory tracking', 'Equipment distribution', 'Uniform management', 'Safety inspections'] },
    { title: 'Spirit & Engagement Lead', icon: '—', desc: 'Designs and runs school spirit initiatives, student section themes, and fan engagement at events.', responsibilities: ['Theme night planning', 'Student section coordination', 'Promotional campaigns', 'Fan experience activities'] },
    { title: 'Athletic Development Asst.', icon: '—', desc: 'Supports weight room and conditioning programs, tracks athlete progress, and assists with training operations.', responsibilities: ['Weight room setup', 'Athlete monitoring', 'Training logs', 'Performance data collection'] },
    { title: 'Community Relations Coord.', icon: '—', desc: 'Connects athletic programs with the community through outreach, partnerships, and engagement initiatives.', responsibilities: ['Youth camp planning', 'Sponsor coordination', 'Community outreach', 'Partnership development'] },
  ]

  const habits = [
    { num: '1', title: 'Be Proactive', desc: 'Take initiative in supporting athletic programs and proposing solutions without being asked.' },
    { num: '2', title: 'Begin with the End in Mind', desc: 'Set clear goals for internship experiences, leadership growth, and capstone impact.' },
    { num: '3', title: 'Put First Things First', desc: 'Manage time between academics, internships, and project deadlines — no excuses.' },
    { num: '4', title: 'Think Win-Win', desc: 'Develop solutions that benefit both athletic programs and the broader school community.' },
    { num: '5', title: 'Seek First to Understand', desc: 'Listen before acting. Practice real communication with coaches, staff, and peers.' },
    { num: '6', title: 'Synergize', desc: 'Work as a team to plan events, develop media, and build the culture of Palmetto Athletics.' },
    { num: '7', title: 'Sharpen the Saw', desc: 'Reflect continuously on leadership growth, professional skills, and personal responsibility.' },
  ]

  return (
    <div className="pt-16">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#0f0f0f]">
        <div className="absolute inset-0 bg-[#d81300]/5"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.06]">
          <HorseshoeLogo className="w-full h-full object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Student Organization</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
            The <span className="text-[#d81300]">SALT</span><br />Team
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Students enrolled in Athletic Leadership form the <strong className="text-white">Student Athletic Leadership Team</strong> — 
            the operational backbone of Palmetto Athletics. SALT isn't a club. It's a workforce.
          </p>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#d81300]"></div>
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">Built to Serve.<br />Trained to Lead.</h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              SALT members aren't observers — they're contributors. They show up before 
              games start, stay after they end, and spend the weeks between building the 
              systems that make programs successful.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Membership through Athletic Leadership is selective. Every SALT member is 
              chosen for character, work ethic, and commitment to the Palmetto athletic culture. 
              This isn't a resume builder — it's a responsibility.
            </p>
          </div>
          <div className="md:col-span-2 space-y-2">
            {[
              'Develop student leadership within athletics',
              'Increase student involvement in programs',
              'Strengthen school spirit and pride',
              'Provide real operational support to coaches',
              'Promote positive sportsmanship and culture',
            ].map(item => (
              <div key={item} className="flex gap-3 items-start bg-[#0f0f0f] border border-white/5 p-4 hover:border-[#d81300]/20 transition-colors">
                <span className="text-[#d81300] font-black text-base leading-tight flex-shrink-0">✓</span>
                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Team Structure</span>
          </div>
          <h2 className="text-4xl font-black mb-12">SALT Leadership Roles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {roles.map(({ title, icon, desc, responsibilities }) => (
              <div key={title} className="bg-[#111] p-6 hover:bg-[#161616] transition-colors group">
                <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2 group-hover:text-[#d81300] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{desc}</p>
                <div className="border-t border-white/5 pt-4 space-y-1">
                  {responsibilities.map(r => (
                    <div key={r} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#d81300]/50">—</span>{r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP PLACEMENTS ────────────────────────────────────────── */}
      <section className="bg-[#111] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Internship Program</span>
          </div>
          <h2 className="text-4xl font-black mb-4">Where SALT Members Work</h2>
          <p className="text-gray-400 mb-10 max-w-2xl text-sm leading-relaxed">
            Every SALT member is placed in a real internship role within Palmetto's athletic programs — 
            working directly alongside coaches, athletic trainers, and event staff.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: '—', label: 'Team Student\nAssistant' },
              { icon: '—', label: 'Athletic Media\nAssistant' },
              { icon: '—', label: 'Event Operations\nAssistant' },
              { icon: '—', label: 'Equipment\nAssistant' },
              { icon: '—', label: 'Strength & Conditioning\nAssistant' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-[#0f0f0f] border border-white/5 p-5 text-center hover:border-[#d81300]/30 transition-colors">
                <div className="text-white text-xs font-bold uppercase tracking-wide whitespace-pre-line leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADER IN ME / 7 HABITS ──────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#d81300]"></div>
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Our Foundation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                7 Habits.<br />Athletic Application.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Every SALT member starts with the 7 Habits of Highly Effective People through 
                the Leader in Me framework. These habits aren't classroom theory — they're 
                the operating principles SALT members apply every day in their roles.
              </p>
              <div className="flex justify-start">
                <LeaderInMeLogo className="w-36 h-36 object-contain opacity-90" />
              </div>
            </div>
            <div className="space-y-2">
              {habits.map(({ num, title, desc }) => (
                <div key={num} className="flex gap-4 items-start bg-[#111] border border-white/5 p-4 hover:border-[#d81300]/20 transition-colors">
                  <div className="w-8 h-8 bg-[#d81300] flex items-center justify-center font-black text-white text-xs flex-shrink-0">
                    {num}
                  </div>
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

      {/* ── INSTRUCTOR ──────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f0f0f] border border-[#d81300]/20 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]"></div>
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Instructor</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-black mb-1">Mr. Jack Wardlaw</h3>
                <div className="text-[#d81300] text-sm font-bold tracking-wide mb-4">
                  Health/PE Teacher · Football Coach · Palmetto High School
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Coach Wardlaw brings experience as a Health/PE educator, football coach, 
                  and doctoral student in Educational Leadership to this course. Athletic 
                  Leadership is built from real knowledge of what it takes to run high school 
                  athletic programs at a high level — and a commitment to developing the 
                  student leaders who support them.
                </p>
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

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#d81300] py-16 px-6 text-center">
        <HorseshoeLogo className="w-20 h-20 object-contain mx-auto mb-6 opacity-30" />
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Think You Have What It Takes?
        </h2>
        <p className="text-white/70 mb-8">SALT membership is earned. Applications open for 2026–2027.</p>
        <button onClick={() => navigate('apply')}
          className="px-10 py-4 bg-white text-[#d81300] font-black text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-colors">
          Apply for SALT
        </button>
      </section>

      <Footer navigate={navigate} />

    </div>
  )
}
