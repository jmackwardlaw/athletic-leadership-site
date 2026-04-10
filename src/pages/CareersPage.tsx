import { Page } from '../App'
import { HorseshoeLogo } from '../components/Logos'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

interface Props { navigate: (page: Page) => void }

const careers = [
  {
    category: 'Administration & Leadership',
    color: '#d81300',
    paths: [
      {
        title: 'Athletic Director',
        icon: '🏛️',
        salary: '$55K – $120K+',
        level: 'High school → Collegiate → Pro',
        desc: 'Oversee all athletic programs, manage budgets, coordinate staff, ensure compliance, and lead the vision of a school\'s athletic department.',
        alConnection: 'AL students learn athletic department structure, budgeting, compliance, and program management — the exact foundation of an AD career.',
        pathSteps: ['HS Assistant Coach / Operations', 'Athletic Operations Coordinator', 'Associate Athletic Director', 'Athletic Director'],
        skills: ['Program Management', 'Budget & Finance', 'Compliance', 'Staff Leadership', 'Community Relations'],
      },
      {
        title: 'Coaching',
        icon: '📋',
        salary: '$35K – $5M+ (college/pro)',
        level: 'All levels',
        desc: 'Lead teams in player development, game planning, practice design, and building winning culture — from youth leagues to Division I programs.',
        alConnection: 'Internship placements put AL students alongside head coaches — learning how to run a practice, prepare a game plan, and lead athletes.',
        pathSteps: ['Student Assistant / GA', 'Position Coach', 'Coordinator', 'Head Coach'],
        skills: ['Player Development', 'Game Planning', 'Communication', 'Film Study', 'Recruiting'],
      },
    ],
  },
  {
    category: 'Sports Media & Content',
    color: '#d81300',
    paths: [
      {
        title: 'Sports Broadcaster / Journalist',
        icon: '🎙️',
        salary: '$40K – $300K+',
        level: 'Local → National → Network',
        desc: 'Cover sports through radio, television, podcasting, or digital media. Tell the stories behind the games — players, programs, and moments.',
        alConnection: 'AL\'s media unit covers sports storytelling, athlete spotlights, game-day content, and digital production — the building blocks of a broadcast career.',
        pathSteps: ['School Media / Podcast', 'College Media / Campus Radio', 'Local Market Reporter', 'Network Broadcaster'],
        skills: ['Storytelling', 'On-Air Delivery', 'Writing', 'Video Production', 'Social Media'],
      },
      {
        title: 'Sports Content Creator / Videographer',
        icon: '🎬',
        salary: '$40K – $150K+',
        level: 'Team / Agency / Freelance',
        desc: 'Produce video content, highlight reels, social media campaigns, and digital media for athletic programs at every level.',
        alConnection: 'AL students shoot real game-day footage, produce social content, and manage Palmetto\'s athletic media — direct field experience.',
        pathSteps: ['School Media Team', 'College Media Program', 'Team Video Coordinator', 'Director of Content'],
        skills: ['Videography', 'Editing', 'Social Media', 'Graphic Design', 'Branding'],
      },
    ],
  },
  {
    category: 'Operations & Events',
    color: '#d81300',
    paths: [
      {
        title: 'Event & Game Operations Manager',
        icon: '📋',
        salary: '$45K – $110K+',
        level: 'HS → College → Pro venues',
        desc: 'Coordinate the logistics of live athletic events — staffing, facilities, fan experience, broadcast setup, and day-of operations.',
        alConnection: 'AL\'s event operations unit teaches exactly this — students plan and execute real events, manage roles, and handle game-day logistics firsthand.',
        pathSteps: ['Game Day Ops Assistant', 'Event Coordinator', 'Operations Manager', 'Director of Game Operations'],
        skills: ['Event Logistics', 'Staff Management', 'Facility Operations', 'Problem Solving', 'Communication'],
      },
      {
        title: 'Equipment Manager',
        icon: '🎽',
        salary: '$35K – $90K+',
        level: 'HS → College → Pro',
        desc: 'Manage all athletic equipment — ordering, inventory, distribution, care, and logistics for travel and competitions.',
        alConnection: 'AL\'s equipment unit teaches inventory systems, safety inspections, budgeting, and hands-on management of Palmetto\'s athletic inventory.',
        pathSteps: ['Student Equipment Asst.', 'Equipment Room Manager', 'Head Equipment Manager', 'Director of Equipment Operations'],
        skills: ['Inventory Management', 'Logistics', 'Organization', 'Budgeting', 'Attention to Detail'],
      },
    ],
  },
  {
    category: 'Performance & Health',
    color: '#d81300',
    paths: [
      {
        title: 'Strength & Conditioning Coach',
        icon: '🏋️',
        salary: '$40K – $250K+',
        level: 'HS → College → Pro',
        desc: 'Design and implement training programs to maximize athletic performance, reduce injury risk, and develop athletes physically year-round.',
        alConnection: 'AL covers periodization basics, training cycles, athlete monitoring, and weight room operations — all foundational to an S&C career.',
        pathSteps: ['Weight Room Asst. / Intern', 'Graduate Asst. Strength Coach', 'Assistant S&C Coach', 'Director of Strength & Conditioning'],
        skills: ['Exercise Science', 'Programming', 'Athlete Development', 'Nutrition Basics', 'Injury Prevention'],
      },
      {
        title: 'Athletic Trainer',
        icon: '🩹',
        salary: '$48K – $95K+',
        level: 'HS → College → Pro → Clinical',
        desc: 'Prevent, diagnose, and treat athletic injuries — working directly with teams at practice and competition to keep athletes healthy and competing.',
        alConnection: 'AL students intern alongside athletic trainers — understanding prevention protocols, treatment environments, and game-day medical operations.',
        pathSteps: ['HS Internship / Shadow', 'Athletic Training Program (BS)', 'Graduate Internship', 'Certified Athletic Trainer (ATC)'],
        skills: ['Anatomy & Physiology', 'Injury Assessment', 'Rehab & Recovery', 'Taping & Prevention', 'Documentation'],
      },
    ],
  },
  {
    category: 'Business & Analytics',
    color: '#d81300',
    paths: [
      {
        title: 'Sports Marketing Director',
        icon: '📣',
        salary: '$55K – $180K+',
        level: 'Team / Agency / Brand',
        desc: 'Develop and execute marketing campaigns for athletic programs and sports brands — fan engagement, ticket sales, sponsorships, and brand identity.',
        alConnection: 'AL\'s media and marketing unit covers campaign development, school spirit initiatives, digital promotion, and brand strategy directly.',
        pathSteps: ['Promo / Marketing Intern', 'Marketing Coordinator', 'Marketing Manager', 'VP / Director of Marketing'],
        skills: ['Campaign Strategy', 'Digital Marketing', 'Sponsorship Sales', 'Brand Management', 'Analytics'],
      },
      {
        title: 'Sports Analytics Specialist',
        icon: '📊',
        salary: '$55K – $175K+',
        level: 'College → Pro → Sports Tech',
        desc: 'Collect, analyze, and interpret athletic performance data to inform coaching decisions, player development, and competitive strategy.',
        alConnection: 'AL covers performance data collection, athlete monitoring technology, and statistics basics — building the analytical mindset this career demands.',
        pathSteps: ['Stats Intern / Student Manager', 'Analytics Coordinator', 'Data Analyst', 'Director of Analytics'],
        skills: ['Data Analysis', 'Statistics', 'Video Software', 'Excel / Tableau', 'Sports IQ'],
      },
    ],
  },
]

const quickStats = [
  { num: '11', label: 'Career Pathways', sub: 'Explored in AL' },
  { num: '$74K', label: 'Avg Sports Admin Salary', sub: 'Bureau of Labor Statistics' },
  { num: '4%', label: 'Industry Growth', sub: 'Sports management sector' },
  { num: '1', label: 'Course to Start', sub: 'Athletic Leadership' },
]

export default function CareersPage({ navigate }: Props) {
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()
  const s3 = useScrollReveal()

  return (
    <div className="pt-16">

      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-[#111] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)`,
        }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04]">
          <HorseshoeLogo className="w-80 h-80 object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Sports Industry Careers</span>
          </div>
          <h1 className="reveal delay-1 text-5xl md:text-7xl font-black leading-none mb-6">
            Where This
            <br /><span className="text-[#d81300]">Takes You</span>
          </h1>
          <p className="reveal delay-2 text-gray-400 text-lg max-w-2xl leading-relaxed">
            Athletic Leadership is a direct pipeline into the sports industry. Every unit, 
            every internship hour, every project connects to a real career path. 
            Here's what's on the other side.
          </p>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────────────────── */}
      <div className="bg-[#d81300]">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map(({ num, label, sub }) => (
            <div key={label} className="text-center">
              <div className="text-white font-black text-xl">{num}</div>
              <div className="text-white/80 text-xs font-bold uppercase tracking-[0.08em]">{label}</div>
              <div className="text-white/50 text-[10px] mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── AL → CAREERS CONNECTION ─────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-20 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal text-center mb-14" data-delay="0">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">The Connection</span>
              <div className="w-8 h-0.5 bg-[#d81300]" />
            </div>
            <h2 className="text-4xl font-black mb-4">How AL Prepares You</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Every unit in Athletic Leadership was designed with a career pathway in mind. 
              This isn't a general elective — it's a launchpad.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { unit: 'Unit 01', skill: '7 Habits & Leadership Foundation', arrow: '→', career: 'Every career in sports' },
              { unit: 'Unit 02', skill: 'Athletic Department Structure', arrow: '→', career: 'Athletic Administration, Coaching' },
              { unit: 'Unit 03', skill: 'Event & Game Operations', arrow: '→', career: 'Event Management, Game Ops' },
              { unit: 'Unit 04', skill: 'Equipment & Facility Management', arrow: '→', career: 'Equipment Manager, Facility Director' },
              { unit: 'Unit 05', skill: 'Sports Media & Marketing', arrow: '→', career: 'Broadcasting, Content, Marketing' },
              { unit: 'Unit 06–07', skill: 'Internship & Capstone', arrow: '→', career: 'Resume, references, real experience' },
            ].map(({ unit, skill, career }, i) => (
              <div key={unit}
                className="io-reveal bg-[#111] border border-white/5 p-5 flex gap-4 items-start hover:border-[#d81300]/30 transition-colors card-lift"
                data-delay={String(i * 60)}>
                <div className="text-[#d81300] text-xs font-black w-16 flex-shrink-0 mt-0.5 uppercase tracking-wider">{unit}</div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">{skill}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d81300] font-black">→</span>
                    <span className="text-gray-500 text-xs">{career}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAREER PATHS ────────────────────────────────────────────────── */}
      {careers.map((category, ci) => (
        <section
          key={category.category}
          className={`py-20 px-6 ${ci % 2 === 0 ? 'bg-[#111]' : 'bg-[#0f0f0f]'}`}
          ref={ci === 0 ? s2 : ci === 2 ? s3 : undefined}
        >
          <div className="max-w-7xl mx-auto">
            <div className="io-reveal flex items-center gap-4 mb-10" data-delay="0">
              <div className="w-1 h-8 bg-[#d81300]" />
              <div>
                <div className="text-[#d81300] text-xs font-black tracking-[0.25em] uppercase mb-0.5">Career Category</div>
                <h2 className="text-3xl font-black">{category.category}</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {category.paths.map((path, pi) => (
                <div
                  key={path.title}
                  className="io-reveal bg-[#0a0a0a] border border-white/5 hover:border-[#d81300]/30 transition-all duration-300 card-lift glow-red-hover"
                  data-delay={String(pi * 100)}
                >
                  {/* Card header */}
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{path.icon}</span>
                        <h3 className="font-black text-white text-xl">{path.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="bg-[#d81300]/15 border border-[#d81300]/30 text-[#d81300] px-3 py-1 font-bold">
                        {path.salary}
                      </span>
                      <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 font-bold">
                        {path.level}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{path.desc}</p>

                    {/* AL Connection */}
                    <div className="bg-[#d81300]/8 border-l-2 border-[#d81300] pl-4 py-3">
                      <div className="text-[#d81300] text-[10px] font-black uppercase tracking-[0.15em] mb-1">AL Connection</div>
                      <p className="text-gray-300 text-xs leading-relaxed">{path.alConnection}</p>
                    </div>

                    {/* Pathway steps */}
                    <div>
                      <div className="text-white text-xs font-black uppercase tracking-[0.12em] mb-3">Career Pathway</div>
                      <div className="flex flex-wrap items-center gap-1">
                        {path.pathSteps.map((step, si) => (
                          <div key={step} className="flex items-center gap-1">
                            <span className="bg-[#111] border border-white/10 text-gray-300 text-[10px] px-2 py-1 font-bold">
                              {step}
                            </span>
                            {si < path.pathSteps.length - 1 && (
                              <span className="text-[#d81300] text-xs font-black">›</span>
                            )}
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
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ─── EDUCATION PATHWAYS ──────────────────────────────────────────── */}
      <section className="bg-[#111] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="io-reveal flex items-center gap-3 mb-10" data-delay="0">
            <div className="w-8 h-0.5 bg-[#d81300]" />
            <div>
              <div className="text-[#d81300] text-xs font-black tracking-[0.25em] uppercase mb-0.5">After High School</div>
              <h2 className="text-3xl font-black">Degree Pathways to Consider</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { degree: 'Sports Management', icon: '🏆', schools: 'USC, Clemson, Winthrop, Lander', note: 'Broadest pathway — covers business, ops, and leadership' },
              { degree: 'Exercise Science / Kinesiology', icon: '💪', schools: 'USC, Clemson, Anderson Univ.', note: 'Foundation for S&C, athletic training, and performance careers' },
              { degree: 'Communications / Broadcast', icon: '📡', schools: 'USC, Coastal Carolina, Bob Jones', note: 'Sports media, journalism, broadcasting, and PR' },
              { degree: 'Athletic Training (BS + ATC)', icon: '🩹', schools: 'Presbyterian, Winthrop, Lander', note: 'Clinical pathway requiring specific accredited programs' },
            ].map(({ degree, icon, schools, note }, i) => (
              <div key={degree}
                className="io-reveal bg-[#0f0f0f] border border-white/5 p-6 hover:border-[#d81300]/30 transition-all duration-300 card-lift"
                data-delay={String(i * 70)}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2">{degree}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{note}</p>
                <div className="text-[#d81300] text-[10px] font-bold uppercase tracking-wide">SC Schools:</div>
                <div className="text-gray-600 text-[10px]">{schools}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
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
            The Best Time to Start<br />Is Right Now.
          </h2>
          <p className="reveal delay-1 text-white/70 text-lg mb-10">
            Athletic Leadership gives you the foundation, the experience, and the connections 
            to compete for a career in sports.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('apply')}
              className="px-10 py-4 bg-white text-[#d81300] font-black text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              Apply for Selection
            </button>
            <button onClick={() => navigate('about')}
              className="px-10 py-4 border-2 border-white/60 text-white font-black text-sm tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white transition-all duration-200">
              Course Overview
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
