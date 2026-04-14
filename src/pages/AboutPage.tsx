import { HorseshoeLogo, LeaderInMeLogo } from '../components/Logos'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

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
    <div className="pt-16">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden">
        {/* Red top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d81300]" />
        {/* Red left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d81300]" />
        {/* Red glow bloom */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(216,19,0,0.18) 0%, transparent 65%)" }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <HorseshoeLogo className="w-72 h-72 object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Overview</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-6" style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
  Athletic<br />
  <span className="text-[#d81300]">Leader</span>ship
</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            A career-focused, honors-weighted elective built around real athletic programs — 
            real internships, real leadership, and real skills that translate to careers in sports.
          </p>
        </div>
      </section>

      {/* ── QUICK FACTS ──────────────────────────────────────────────────── */}
      <div className="bg-[#d81300]">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Course Type', value: 'Honors Elective' },
            { label: 'Credit', value: '1.0 (HW)' },
            { label: 'Grade Levels', value: '9–12' },
            { label: 'Length', value: '1 Semester' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-white font-black text-lg">{value}</div>
              <div className="text-white/60 text-xs uppercase tracking-[0.1em] font-bold">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RATIONALE ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]"></div>
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Rationale</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900">
              Built Around Real Programs.<br />Real Experience.
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Athletics define school culture — yet most students never see what it takes 
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
                <strong className="text-gray-900"> Leader in Me</strong> framework — establishing 
                the character and leadership foundation that everything else builds on.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Skills You'll Build</div>
            {[
              ['Communication', 'Presentations, written plans, event messaging'],
              ['Collaboration', 'Group projects, peer feedback, shared decision-making'],
              ['Critical Thinking', 'Real-world challenges, strategic proposals, problem solving'],
              ['Creativity', 'Marketing campaigns, engagement strategies, media production'],
              ['Leadership', 'Philosophy development, project management, accountability'],
              ['Career Readiness', 'Professional proposals, industry exploration, workforce skills'],
            ].map(([skill, desc]) => (
              <div key={skill} className="flex gap-4 items-start bg-gray-50 border border-gray-200 p-4 hover:border-[#d81300]/30 transition-colors">
                <div className="w-1.5 h-1.5 bg-[#d81300] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-gray-900 font-bold text-sm">{skill}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADER IN ME CALLOUT ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#242424] to-[#383838] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border border-[#d81300]/30 p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="flex justify-center">
                <LeaderInMeLogo className="w-72 h-72 object-contain" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#d81300]"></div>
                  <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Unit 1 — The Foundation</span>
                </div>
                <h2 className="text-3xl font-black mb-4">
                  We Start with the 7 Habits
                </h2>
                <p className="text-gray-400 leading-relaxed mb-5">
                  Before students touch operations, media, or equipment — they build the 
                  leadership foundation. Unit 1 is dedicated entirely to the 
                  <strong className="text-white"> 7 Habits of Highly Effective People</strong> through the 
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
                    <div key={num} className="flex items-center gap-3 bg-gradient-to-br from-[#242424] to-[#383838] border border-white/5 px-3 py-2">
                      <div className="w-6 h-6 bg-[#d81300] flex items-center justify-center font-black text-white text-xs flex-shrink-0">{num}</div>
                      <span className="text-gray-300 text-xs font-bold">{habit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNITS ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Curriculum</span>
          </div>
          <h2 className="text-4xl font-black mb-12">7 Units of Study</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
            {units.map(({ num, title, topics, tag, highlight }) => (
              <div
                key={num}
                className={`p-6 hover:border-[#d81300]/40 transition-colors ${
                  highlight
                    ? 'bg-[#d81300]/10 border border-[#d81300]/40 lg:col-span-1'
                    : 'bg-gradient-to-br from-[#242424] to-[#383838] border border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-xs font-black tracking-[0.2em] ${highlight ? 'text-[#d81300]' : 'text-[#d81300]'}`}>
                    UNIT {num}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 ${
                    highlight ? 'bg-[#d81300] text-white' : 'bg-white/5 text-gray-500'
                  }`}>{tag}</span>
                </div>
                <h3 className={`font-black text-base mb-4 leading-tight ${highlight ? 'text-white' : 'text-white'}`}>
                  {title}
                </h3>
                <ul className="space-y-1">
                  {topics.map(t => (
                    <li key={t} className="text-gray-500 text-xs flex gap-2">
                      <span className="text-[#d81300]/60 flex-shrink-0">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPSTONE + INTERNSHIP ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#242424] to-[#383838] py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border border-[#d81300]/30 p-8">
            <div className="text-[#d81300] text-xs font-black tracking-[0.2em] uppercase mb-3">Capstone Assessment</div>
            <h3 className="text-2xl font-black mb-4">Athletic Improvement<br />Project</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Students identify a real improvement opportunity within Palmetto's athletic programs, 
              conduct research, develop a proposal, and present to coaches and athletic leadership.
            </p>
            <div className="space-y-2">
              {['Program evaluation & observation', 'Research & best practices analysis', 'Structured proposal development', 'Professional presentation to stakeholders'].map(s => (
                <div key={s} className="flex gap-3 text-sm text-gray-400">
                  <span className="text-[#d81300] font-black">→</span>{s}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border border-white/10 p-8">
            <div className="text-gray-400 text-xs font-black tracking-[0.2em] uppercase mb-3">Runs All Semester</div>
            <h3 className="text-2xl font-black mb-4">Athletic Leadership<br />Internship</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The internship is not a unit — it runs the entire semester alongside coursework. 
              Every AL student is placed with a coach, team, or athletic program from Week 3 
              through the final week. Hours are logged and reflected on continuously.
            </p>
            <div className="space-y-2">
              {['Practice setup & equipment management', 'Game-day event operations', 'Scorekeeping, stats, or film review', 'Hour logs, reflections & final portfolio'].map(s => (
                <div key={s} className="flex gap-3 text-sm text-gray-400">
                  <span className="text-[#d81300] font-black">→</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GRADING ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Assessment</span>
          </div>
          <h2 className="text-3xl font-black mb-8 text-gray-900">Grading Structure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-[#d81300]/30 p-6">
              <div className="text-[#d81300] text-4xl font-black mb-1">60%</div>
              <div className="text-gray-900 font-black text-sm uppercase tracking-wide mb-4">Major Grades</div>
              <ul className="space-y-1.5 text-gray-600 text-sm">
                {['Capstone Athletic Improvement Project', 'Athletic Leadership Internship', 'Athletic Program Analysis', 'Event Operations Plan', 'Equipment & Facility Project'].map(a => (
                  <li key={a} className="flex gap-2"><span className="text-[#d81300]">—</span>{a}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <div className="text-gray-900 text-4xl font-black mb-1">40%</div>
              <div className="text-gray-900 font-black text-sm uppercase tracking-wide mb-4">Minor Grades</div>
              <ul className="space-y-1.5 text-gray-600 text-sm">
                {['Leadership Reflection Journals', 'Athletic Event Observation Reports', 'Class Activities & Simulations', 'Knowledge Checks', 'Internship Progress Checkpoints'].map(a => (
                  <li key={a} className="flex gap-2"><span className="text-gray-400">—</span>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREERS ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#242424] to-[#383838] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Future Pathways</span>
          </div>
          <h2 className="text-3xl font-black mb-8">Career Exploration Areas</h2>
          <div className="flex flex-wrap gap-3">
            {careers.map(c => (
              <span key={c} className="px-4 py-2 border border-white/10 text-gray-300 text-sm font-bold hover:border-[#d81300]/40 hover:text-[#d81300] transition-colors cursor-default">
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
