import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import ClemsonALWordmark from '../components/ClemsonALWordmark'

export default function AboutPage() {
  const navigate = useNavigate()

  const units = [
    {
      num: '01',
      title: '7 Habits & Leader in Me',
      highlight: true,
      topics: ['What is Leadership?', 'Habit 1 — Be Proactive', 'Habit 2 — Begin with the End in Mind', 'Habit 3 — Put First Things First', 'Habit 4 — Think Win-Win', 'Habit 5 — Seek First to Understand', 'Habit 6 — Synergize', 'Habit 7 — Sharpen the Saw', 'Your Personal Leadership Philosophy'],
      tag: 'Foundation Unit',
    },
    {
      num: '02',
      title: 'Foundations of Athletic Leadership',
      highlight: false,
      topics: ['Leadership Styles in Athletics', 'Communication & Team Leadership', 'Building Positive Team Culture', 'Conflict Resolution', 'Ethics & Sportsmanship'],
      tag: 'Leadership',
    },
    {
      num: '03',
      title: 'Athletic Department Structure',
      highlight: false,
      topics: ['Athletic Department Roles', 'Budgeting Basics', 'Scheduling Competitions', 'SCHSL Policies & Compliance', 'Booster Clubs & Partnerships'],
      tag: 'Administration',
    },
    {
      num: '04',
      title: 'Event & Game Operations',
      highlight: false,
      topics: ['Event Planning Fundamentals', 'Game Day Logistics', 'Ticketing & Admissions', 'Crowd Management', 'Sportsmanship & Safety'],
      tag: 'Operations',
    },
    {
      num: '05',
      title: 'Equipment & Facility Operations',
      highlight: false,
      topics: ['Equipment Inventory Systems', 'Facility Preparation & Scheduling', 'Locker Room Operations', 'Safety & Risk Management', 'Equipment Budgeting'],
      tag: 'Operations',
    },
    {
      num: '06',
      title: 'Sports Marketing & Media',
      highlight: false,
      topics: ['Social Media for Athletics', 'Photography & Videography', 'Branding & Promotions', 'Athlete Storytelling', 'Digital Content Planning'],
      tag: 'Media',
    },
    {
      num: '07',
      title: 'Capstone Project',
      highlight: false,
      topics: ['Athletic Program Evaluation', 'Research & Best Practices', 'Improvement Proposal Development', 'Implementation Planning', 'Final Presentation to Coaches & Staff'],
      tag: 'Capstone',
    },
  ]

  const careers = [
    'Athletic Administration', 'Coaching', 'Sports Performance / S&C', 'Sports Medicine',
    'Sports Media & Broadcasting', 'Event Management', 'Equipment Management',
    'Athletic Operations', 'Sports Marketing', 'Sports Analytics', 'Recruiting',
  ]

  return (
    <div className="pt-[100px]">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-28 px-6 bg-surface-base overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(216,19,0,0.22) 0%, rgba(216,19,0,0.05) 35%, transparent 65%)" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.04] pointer-events-none">
          <HorseshoeLogo className="w-[600px] h-[600px] object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="red-grad-rule w-12"></div>
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Overview</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-7">
            Athletic<br />
            <span className="red-grad-text">Leader</span>ship
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl leading-relaxed">
            A career-focused, honors-weighted elective built around real athletic programs —
            real internships, real leadership, and real skills that translate to careers in sports.
          </p>
        </div>
      </section>

      {/* ── QUICK FACTS ──────────────────────────────────────────────────── */}
      <div className="red-textured-band">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Course Type', value: 'Honors Weighted Elective' },
            { label: 'Credit', value: '1.0 (HW)' },
            { label: 'Grade Levels', value: '9–12' },
            { label: 'Length', value: '1 Semester' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-headline text-white font-black text-lg leading-tight drop-shadow-sm">{value}</div>
              <div className="font-headline text-white/70 text-[10px] uppercase tracking-[0.18em] font-bold mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RATIONALE + ACADEMIC PARTNERSHIP ─────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Left: course rationale */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="red-grad-rule w-10"></div>
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Rationale</span>
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-black mb-6 text-ink-primary leading-tight">
              Built around real programs.<br /><span className="red-grad-text">Real experience.</span>
            </h2>
            <div className="space-y-5 text-ink-secondary leading-relaxed">
              <p>
                Athletics can define school culture, yet most students never see what it takes
                to make them run. Athletic Leadership bridges that gap.
              </p>
              <p>
                AL students get direct access to the people, systems, and decisions that
                power a high school athletic department. From managing equipment to producing
                game-day content to planning events — AL students do real work that makes a
                real difference for Palmetto Athletics.
              </p>
              <p>
                The course begins with the 7 Habits of Highly Effective People through the
                <strong className="text-ink-primary"> Leader in Me</strong> framework — establishing
                the character and leadership foundation that everything else builds on.
              </p>
            </div>
          </div>

          {/* Right: featured Academic Partnership */}
          <div className="md:col-span-5">
            <div className="card-dark red-card-edge p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="red-grad-rule w-10"></div>
                <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Academic Partnership</span>
              </div>
              <div className="flex justify-center py-4 mb-7">
                <ClemsonALWordmark
                  variant="light"
                  size="feature"
                  href="https://www.clemson.edu/education/academics/undergraduate/athletic-leadership-minor.html"
                  className="!w-full"
                />
              </div>
              <p className="text-ink-secondary leading-relaxed mb-7">
                Palmetto Athletic Leadership is proud to partner with Clemson
                University's Athletic Leadership program. As one of the few
                undergraduate athletic leadership degrees in the country, Clemson's
                program serves as both a model and a pathway — connecting Palmetto
                students to the people, ideas, and opportunities shaping the future
                of the field.
              </p>
              <a
                href="https://www.clemson.edu/education/academics/undergraduate/athletic-leadership-minor.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                Learn More About Clemson Athletic Leadership →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS YOU'LL BUILD ──────────────────────────────────────────── */}
      <section className="bg-surface-raised py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-grad-rule w-10"></div>
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Outcomes</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-black mb-10 text-ink-primary leading-tight">
            Skills You'll <span className="red-grad-text">Build</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Communication', 'Presentations, written plans, event messaging'],
              ['Collaboration', 'Group projects, peer feedback, shared decision-making'],
              ['Critical Thinking', 'Real-world challenges, strategic proposals, problem solving'],
              ['Creativity', 'Marketing campaigns, engagement strategies, media production'],
              ['Leadership', 'Philosophy development, project management, accountability'],
              ['Career Readiness', 'Professional proposals, industry exploration, workforce skills'],
            ].map(([skill, desc]) => (
              <div key={skill} className="flex gap-4 items-start card-dark p-5">
                <div className="w-1.5 h-1.5 bg-brand-red rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-ink-primary font-bold text-sm">{skill}</div>
                  <div className="text-ink-muted text-xs mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADER IN ME CALLOUT ──────────────────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-dark red-card-edge p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="flex justify-center">
                <LeaderInMeLogo className="w-56 h-56 md:w-64 md:h-64 object-contain" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="red-grad-rule w-10"></div>
                  <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Unit 1 — The Foundation</span>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl font-black mb-5 leading-tight">
                  We start with the <span className="red-grad-text">7 Habits</span>
                </h2>
                <p className="text-ink-secondary leading-relaxed mb-7">
                  Before students touch operations, media, or equipment — they build the
                  leadership foundation. Unit 1 is dedicated entirely to the
                  <strong className="text-ink-primary"> 7 Habits of Highly Effective People</strong> through the
                  Leader in Me framework. Students don't just read the habits — they apply
                  them to the athletic environment and build their personal leadership philosophy.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['1', 'Be Proactive'],
                    ['2', 'Begin with the End in Mind'],
                    ['3', 'Put First Things First'],
                    ['4', 'Think Win-Win'],
                    ['5', 'Seek First to Understand'],
                    ['6', 'Synergize'],
                    ['7', 'Sharpen the Saw'],
                  ].map(([num, habit]) => (
                    <div key={num} className="flex items-center gap-3 bg-surface-raised border border-white/[0.06] px-3 py-2.5 rounded-token">
                      <div className="w-6 h-6 bg-brand-red flex items-center justify-center font-black text-white text-xs flex-shrink-0 rounded-sm">{num}</div>
                      <span className="text-ink-secondary text-xs font-bold">{habit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNITS ────────────────────────────────────────────────────────── */}
      <section className="bg-surface-raised py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-grad-rule w-10"></div>
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Curriculum</span>
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-black mb-12 leading-tight"><span className="red-grad-text">7 Units</span> of Study</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map(({ num, title, topics, tag, highlight }) => (
              <div
                key={num}
                className={`p-7 rounded-token transition-colors ${
                  highlight
                    ? 'bg-brand-red/[0.06] border border-brand-red/30'
                    : 'card-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-headline text-[11px] font-bold tracking-[0.22em] text-brand-red">
                    UNIT {num}
                  </div>
                  <span className={`font-headline text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${
                    highlight ? 'bg-brand-red text-white' : 'bg-white/[0.06] text-ink-muted'
                  }`}>{tag}</span>
                </div>
                <h3 className="font-headline text-ink-primary font-black text-lg mb-4 leading-tight">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {topics.map(t => (
                    <li key={t} className="text-ink-secondary text-sm leading-relaxed flex gap-2.5">
                      <span className="text-brand-red flex-shrink-0 font-bold">›</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPSTONE + INTERNSHIP ────────────────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="card-dark red-card-edge p-8 md:p-10">
            <div className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-brand-red mb-3">Capstone Assessment</div>
            <h3 className="font-headline text-2xl md:text-3xl font-black mb-5 leading-tight">Athletic Improvement<br />Project</h3>
            <p className="text-ink-secondary text-sm leading-relaxed mb-6">
              Students identify a real improvement opportunity within Palmetto's athletic programs,
              conduct research, develop a proposal, and present to coaches and athletic leadership.
            </p>
            <div className="space-y-2.5">
              {['Program evaluation & observation', 'Research & best practices analysis', 'Structured proposal development', 'Professional presentation to stakeholders'].map(s => (
                <div key={s} className="flex gap-3 text-sm text-ink-secondary">
                  <span className="text-brand-red font-black flex-shrink-0">→</span>{s}
                </div>
              ))}
            </div>
          </div>
          <div className="card-dark p-8 md:p-10">
            <div className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary mb-3">Runs All Semester</div>
            <h3 className="font-headline text-2xl md:text-3xl font-black mb-5 leading-tight">Athletic Leadership<br />Internship</h3>
            <p className="text-ink-secondary text-sm leading-relaxed mb-6">
              The internship is not a unit — it runs the entire semester alongside coursework.
              Every AL student is placed with a coach, team, or athletic program from Week 3
              through the final week. Hours are logged and reflected on continuously.
            </p>
            <div className="space-y-2.5">
              {['Practice setup & equipment management', 'Game-day event operations', 'Scorekeeping, stats, or film review', 'Hour logs, reflections & final portfolio'].map(s => (
                <div key={s} className="flex gap-3 text-sm text-ink-secondary">
                  <span className="text-brand-red font-black flex-shrink-0">→</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GRADING ──────────────────────────────────────────────────────── */}
      <section className="bg-surface-raised py-24 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-grad-rule w-10"></div>
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Assessment</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-black mb-10 text-ink-primary leading-tight">Grading Structure</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-dark red-card-edge p-7">
              <div className="font-headline red-grad-text text-5xl font-black mb-1 leading-none">60%</div>
              <div className="font-headline text-ink-primary font-black text-sm uppercase tracking-[0.15em] mb-5 mt-1">Major Grades</div>
              <ul className="space-y-2 text-ink-secondary text-sm">
                {['Capstone Athletic Improvement Project', 'Athletic Leadership Internship', 'Athletic Program Analysis', 'Event Operations Plan', 'Equipment & Facility Project'].map(a => (
                  <li key={a} className="flex gap-2"><span className="text-brand-red">—</span>{a}</li>
                ))}
              </ul>
            </div>
            <div className="card-dark p-7">
              <div className="font-headline text-ink-primary text-5xl font-black mb-1 leading-none">40%</div>
              <div className="font-headline text-ink-primary font-black text-sm uppercase tracking-[0.15em] mb-5 mt-1">Minor Grades</div>
              <ul className="space-y-2 text-ink-secondary text-sm">
                {['Leadership Reflection Journals', 'Athletic Event Observation Reports', 'Class Activities & Simulations', 'Knowledge Checks', 'Internship Progress Checkpoints'].map(a => (
                  <li key={a} className="flex gap-2"><span className="text-ink-muted">—</span>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREERS ──────────────────────────────────────────────────────── */}
      <section className="bg-surface-base py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-grad-rule w-10"></div>
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Future Pathways</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-black mb-10 leading-tight">Career <span className="red-grad-text">Exploration</span> Areas</h2>
          <div className="flex flex-wrap gap-3">
            {careers.map(c => (
              <span key={c} className="px-4 py-2 border border-white/10 text-ink-secondary text-sm font-bold rounded-token hover:border-brand-red/40 hover:text-brand-red transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}
