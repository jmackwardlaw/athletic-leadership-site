import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HorseshoeLogo } from '../components/Logos'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

type CategoryKey = 'all' | 'admin' | 'media' | 'operations' | 'performance' | 'business'

const categories: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Careers' },
  { key: 'admin', label: 'Administration' },
  { key: 'media', label: 'Media & Marketing' },
  { key: 'operations', label: 'Operations & Events' },
  { key: 'performance', label: 'Performance & Health' },
  { key: 'business', label: 'Business & Analytics' },
]

const allCareers = [
  // ── ADMINISTRATION ──────────────────────────────────────────────────────
  {
    cat: 'admin',
    title: 'Athletic Director',
    salary: '$86,490 – $132,277',
    level: 'HS → College → University',
    desc: 'Oversee all athletic programs, manage budgets, coordinate staff, ensure compliance, and lead the vision of a school\'s athletic department.',
    alConnection: 'AL students learn athletic department structure, budgeting, compliance, and program management — the exact foundation of an AD career.',
    pathSteps: ['HS Assistant Coach / Ops', 'Operations Coordinator', 'Associate AD', 'Athletic Director'],
    skills: ['Program Management', 'Budget & Finance', 'Compliance', 'Staff Leadership', 'Community Relations'],
  },
  {
    cat: 'admin',
    title: 'Coaching',
    salary: '$45,920 median – $5M+ (college/pro)',
    level: 'All levels',
    desc: 'Lead teams in player development, game planning, practice design, and building winning culture — from youth leagues to Division I programs.',
    alConnection: 'Internship placements put AL students alongside head coaches — learning how to run a practice, prepare a game plan, and lead athletes.',
    pathSteps: ['Student Assistant / GA', 'Position Coach', 'Coordinator', 'Head Coach'],
    skills: ['Player Development', 'Game Planning', 'Communication', 'Film Study', 'Recruiting'],
  },
  {
    cat: 'admin',
    title: 'Sports Agent',
    salary: '$78,410 – $132,810+',
    level: 'Agency / Independent',
    desc: 'Negotiate contracts, manage client relationships, and guide athlete careers from contract negotiations to endorsement deals.',
    alConnection: 'AL\'s career exploration unit, communication skills, and understanding of athletic program operations directly support this path.',
    pathSteps: ['Sports Management Degree', 'Agency Intern', 'Associate Agent', 'Certified Agent'],
    skills: ['Negotiation', 'Contract Law', 'Communication', 'Networking', 'Sports Business'],
  },
  // ── MEDIA & MARKETING ────────────────────────────────────────────────────
  {
    cat: 'media',
    title: 'Sports Marketing Director',
    salary: '$135,000 – $144,579',
    level: 'Team / Agency / Brand',
    desc: 'Develop and execute marketing campaigns for athletic programs and sports brands — fan engagement, ticket sales, sponsorships, and brand identity.',
    alConnection: 'AL\'s media and marketing unit covers campaign development, school spirit initiatives, digital promotion, and brand strategy directly.',
    pathSteps: ['Promo / Marketing Intern', 'Marketing Coordinator', 'Marketing Manager', 'Director of Marketing'],
    skills: ['Campaign Strategy', 'Digital Marketing', 'Sponsorship Sales', 'Brand Management', 'Analytics'],
  },
  {
    cat: 'media',
    title: 'Sports Marketing Manager',
    salary: '$70,297',
    level: 'Team / College / Agency',
    desc: 'Execute day-to-day marketing campaigns, manage social media, coordinate promotions, and support fan engagement initiatives.',
    alConnection: 'Direct connection to AL\'s sports media unit — students create real campaigns and digital content for Palmetto Athletics.',
    pathSteps: ['Marketing Intern', 'Marketing Coordinator', 'Marketing Manager'],
    skills: ['Social Media', 'Content Creation', 'Campaign Execution', 'Fan Engagement', 'Analytics'],
  },
  {
    cat: 'media',
    title: 'Sports Broadcaster / Journalist',
    salary: '$40,000 – $300,000+',
    level: 'Local → National → Network',
    desc: 'Cover sports through radio, television, podcasting, or digital media. Tell the stories behind the games — players, programs, and moments.',
    alConnection: 'AL\'s media unit covers sports storytelling, athlete spotlights, game-day content, and digital production — the building blocks of a broadcast career.',
    pathSteps: ['School Media / Podcast', 'College Campus Radio', 'Local Market Reporter', 'Network Broadcaster'],
    skills: ['Storytelling', 'On-Air Delivery', 'Writing', 'Video Production', 'Social Media'],
  },
  {
    cat: 'media',
    title: 'Sports Content Creator',
    salary: '$40,000 – $150,000+',
    level: 'Team / Agency / Freelance',
    desc: 'Produce video content, highlight reels, social media campaigns, and digital media for athletic programs at every level.',
    alConnection: 'AL students shoot real game-day footage, produce social content, and manage Palmetto\'s athletic media — direct field experience.',
    pathSteps: ['School Media Team', 'College Media Program', 'Video Coordinator', 'Director of Content'],
    skills: ['Videography', 'Editing', 'Social Media', 'Graphic Design', 'Branding'],
  },
  // ── OPERATIONS & EVENTS ─────────────────────────────────────────────────
  {
    cat: 'operations',
    title: 'Sports Event Manager',
    salary: '$62,734',
    level: 'HS → College → Pro Venues',
    desc: 'Coordinate the logistics of live athletic events — staffing, facilities, fan experience, broadcast setup, and day-of operations.',
    alConnection: 'AL\'s event operations unit teaches exactly this — students plan and execute real events, manage roles, and handle game-day logistics firsthand.',
    pathSteps: ['Game Day Ops Assistant', 'Event Coordinator', 'Operations Manager', 'Director of Game Operations'],
    skills: ['Event Logistics', 'Staff Management', 'Facility Operations', 'Problem Solving', 'Communication'],
  },
  {
    cat: 'operations',
    title: 'Sports Facility Operations Manager',
    salary: '$107,987',
    level: 'HS → College → Pro',
    desc: 'Oversee the day-to-day operations of athletic facilities — scheduling, maintenance, safety, and event setup.',
    alConnection: 'AL\'s facility management unit covers exactly these responsibilities — inventory, prep, safety protocols, and post-event operations.',
    pathSteps: ['Facilities Assistant', 'Facilities Coordinator', 'Facilities Manager', 'Director of Facilities'],
    skills: ['Facility Management', 'Safety Protocols', 'Scheduling', 'Budgeting', 'Staff Coordination'],
  },
  {
    cat: 'operations',
    title: 'Equipment Manager',
    salary: '$35,000 – $90,000+',
    level: 'HS → College → Pro',
    desc: 'Manage all athletic equipment — ordering, inventory, distribution, care, and logistics for travel and competitions.',
    alConnection: 'AL\'s equipment unit teaches inventory systems, safety inspections, budgeting, and hands-on management of Palmetto\'s athletic inventory.',
    pathSteps: ['Student Equipment Asst.', 'Equipment Room Manager', 'Head Equipment Manager', 'Director of Equipment Ops'],
    skills: ['Inventory Management', 'Logistics', 'Organization', 'Budgeting', 'Attention to Detail'],
  },
  // ── PERFORMANCE & HEALTH ────────────────────────────────────────────────
  {
    cat: 'performance',
    title: 'Strength & Conditioning Coach',
    salary: '$40,000 – $250,000+',
    level: 'HS → College → Pro',
    desc: 'Design and implement training programs to maximize athletic performance, reduce injury risk, and develop athletes physically year-round.',
    alConnection: 'AL covers periodization basics, training cycles, athlete monitoring, and weight room operations — all foundational to an S&C career.',
    pathSteps: ['Weight Room Asst. / Intern', 'Graduate Asst. S&C Coach', 'Assistant S&C Coach', 'Director of S&C'],
    skills: ['Exercise Science', 'Programming', 'Athlete Development', 'Nutrition Basics', 'Injury Prevention'],
  },
  {
    cat: 'performance',
    title: 'Athletic Trainer',
    salary: '$49,966 – $60,250',
    level: 'HS → College → Pro → Clinical',
    desc: 'Prevent, diagnose, and treat athletic injuries — working directly with teams at practice and competition to keep athletes healthy.',
    alConnection: 'AL students intern alongside athletic trainers — understanding prevention protocols, treatment environments, and game-day medical operations.',
    pathSteps: ['HS Internship / Shadow', 'Athletic Training Program (BS)', 'Graduate Internship', 'Certified Athletic Trainer (ATC)'],
    skills: ['Anatomy & Physiology', 'Injury Assessment', 'Rehab & Recovery', 'Taping & Prevention', 'Documentation'],
  },
  // ── BUSINESS & ANALYTICS ────────────────────────────────────────────────
  {
    cat: 'business',
    title: 'Sports General Manager',
    salary: '$122,000 – $122,090',
    level: 'College → Professional',
    desc: 'Oversee roster decisions, player contracts, salary cap management, and the overall competitive strategy of a sports franchise.',
    alConnection: 'AL\'s athletic department structure unit, analytics introduction, and leadership foundation directly support the business and decision-making side of this career.',
    pathSteps: ['Scout / Analyst Intern', 'Director of Player Personnel', 'Assistant GM', 'General Manager'],
    skills: ['Contract Negotiation', 'Roster Management', 'Salary Cap', 'Analytics', 'Leadership'],
  },
  {
    cat: 'business',
    title: 'Sports Analytics Specialist',
    salary: '$55,000 – $175,000+',
    level: 'College → Pro → Sports Tech',
    desc: 'Collect, analyze, and interpret athletic performance data to inform coaching decisions, player development, and competitive strategy.',
    alConnection: 'AL covers performance data collection, athlete monitoring technology, and statistics basics — building the analytical mindset this career demands.',
    pathSteps: ['Stats Intern / Student Manager', 'Analytics Coordinator', 'Data Analyst', 'Director of Analytics'],
    skills: ['Data Analysis', 'Statistics', 'Video Software', 'Excel / Tableau', 'Sports IQ'],
  },
]

// Monochrome SVG icons per category
const CatIcon = ({ cat }: { cat: string }) => {
  const cls = "w-5 h-5"
  if (cat === 'admin') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  if (cat === 'media') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
  if (cat === 'operations') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  if (cat === 'performance') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
  if (cat === 'business') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  return null
}

export default function CareersPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const s1 = useScrollReveal()

  const filtered = activeCategory === 'all'
    ? allCareers
    : allCareers.filter(c => c.cat === activeCategory)

  return (
    <div className="pt-[100px]">
      {/* HEADER */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d81300]" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d81300]" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(216,19,0,0.18) 0%, transparent 65%)' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04]">
          <HorseshoeLogo className="w-80 h-80 object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto pl-6">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Sports Industry Careers</span>
          </div>
          <h1 className="reveal delay-1 text-5xl md:text-7xl font-black leading-none mb-6"
            style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
            Where This<br /><span className="text-[#d81300]">Takes You</span>
          </h1>
          <p className="reveal delay-2 text-gray-400 text-lg max-w-2xl leading-relaxed">
            Every unit in Athletic Leadership connects to a real career path.
            Click a category to explore the jobs, salaries, and how AL prepares you.
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-[#d81300]">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '14', label: 'Career Profiles', sub: 'Across 5 categories' },
            { num: '$135K', label: 'Top Marketing Salary', sub: 'Sports Marketing Director' },
            { num: '$107K', label: 'Facility Ops Salary', sub: 'Sports Facility Manager' },
            { num: '1', label: 'Course to Start', sub: 'Athletic Leadership' },
          ].map(({ num, label, sub }) => (
            <div key={label} className="text-center">
              <div className="text-white font-black text-xl">{num}</div>
              <div className="text-white/80 text-xs font-bold uppercase tracking-[0.08em]">{label}</div>
              <div className="text-white/50 text-[10px] mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="bg-gradient-to-br from-[#242424] to-[#383838] border-b border-white/5 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-black tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === key
                    ? 'bg-[#d81300] text-white'
                    : 'bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
                }`}>
                {key !== 'all' && (
                  <span className={activeCategory === key ? 'text-white' : 'text-[#d81300]'}>
                    <CatIcon cat={key} />
                  </span>
                )}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CAREER CARDS */}
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] py-12 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((path) => {
              const isExpanded = expandedCard === path.title
              return (
                <div
                  key={path.title}
                  className="bg-gradient-to-br from-[#242424] to-[#383838] border border-white/5 hover:border-[#d81300]/30 transition-all duration-300"
                >
                  {/* Card header — always visible */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedCard(isExpanded ? null : path.title)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-[#d81300]"><CatIcon cat={path.cat} /></div>
                        <h3 className="font-black text-white text-lg leading-tight">{path.title}</h3>
                      </div>
                      <span className={`text-[#d81300] font-black text-lg transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-45' : ''}`}>+</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#d81300]/15 border border-[#d81300]/30 text-[#d81300] px-3 py-1 text-xs font-bold">{path.salary}</span>
                      <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 text-xs font-bold">{path.level}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{path.desc}</p>
                  </div>

                  {/* Expanded detail */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 space-y-5 border-t border-white/5 pt-5">
                      {/* AL Connection */}
                      <div className="bg-[#d81300]/8 border-l-2 border-[#d81300] pl-4 py-3">
                        <div className="text-[#d81300] text-[10px] font-black uppercase tracking-[0.15em] mb-1">AL Connection</div>
                        <p className="text-gray-300 text-xs leading-relaxed">{path.alConnection}</p>
                      </div>
                      {/* Pathway */}
                      <div>
                        <div className="text-white text-xs font-black uppercase tracking-[0.12em] mb-3">Career Pathway</div>
                        <div className="flex flex-wrap items-center gap-1">
                          {path.pathSteps.map((step, si) => (
                            <div key={step} className="flex items-center gap-1">
                              <span className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border border-white/10 text-gray-300 text-[10px] px-2 py-1 font-bold">{step}</span>
                              {si < path.pathSteps.length - 1 && <span className="text-[#d81300] text-xs font-black">›</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Skills */}
                      <div>
                        <div className="text-white text-xs font-black uppercase tracking-[0.12em] mb-2">Key Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {path.skills.map(skill => (
                            <span key={skill} className="text-[10px] text-gray-500 border border-white/8 px-2 py-0.5 font-bold uppercase tracking-wide hover:text-[#d81300] hover:border-[#d81300]/30 transition-colors cursor-default">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DEGREE PATHWAYS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <div>
              <div className="text-[#d81300] text-xs font-black tracking-[0.25em] uppercase mb-0.5">After High School</div>
              <h2 className="text-3xl font-black text-gray-900">Degree Pathways to Consider</h2>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-8 max-w-xl">SC schools with relevant programs — Athletic Leadership gives you the foundation before you arrive.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { degree: 'Sports Management', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d81300]"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, schools: 'USC, Clemson, Winthrop, Lander', note: 'Broadest pathway — covers business, ops, and leadership' },
              { degree: 'Exercise Science', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d81300]"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>, schools: 'USC, Clemson, Anderson Univ.', note: 'Foundation for S&C, athletic training, and performance careers' },
              { degree: 'Communications / Broadcast', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d81300]"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, schools: 'USC, Coastal Carolina, Bob Jones', note: 'Sports media, journalism, broadcasting, and PR' },
              { degree: 'Athletic Training (BS + ATC)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d81300]"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, schools: 'Presbyterian, Winthrop, Lander', note: 'Clinical pathway requiring specific accredited programs' },
            ].map(({ degree, icon, schools, note }, i) => (
              <div key={degree} className="bg-gray-50 border border-gray-200 p-6 hover:border-[#d81300]/40 transition-all duration-300 card-lift">
                <div className="mb-4">{icon}</div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2">{degree}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{note}</p>
                <div className="text-[#d81300] text-[10px] font-bold uppercase tracking-wide">SC Schools:</div>
                <div className="text-gray-500 text-[10px]">{schools}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#d81300] py-20 px-6 overflow-hidden text-center">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none">
          <HorseshoeLogo className="w-96 h-96 object-contain" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">The Best Time to Start Is Right Now.</h2>
          <p className="text-white/70 text-lg mb-10">Athletic Leadership gives you the foundation, the experience, and the connections to compete for a career in sports.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/apply')}
              className="px-10 py-4 bg-white text-[#d81300] font-black text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              Apply for Selection
            </button>
            <button onClick={() => navigate('/about')}
              className="px-10 py-4 border-2 border-white/60 text-white font-black text-sm tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white transition-all duration-200">
              Course Overview
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
