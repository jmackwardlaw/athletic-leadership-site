import { HorseshoeLogo } from '../components/Logos'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'

export default function InstructorPage() {
  const navigate = useNavigate()
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()

  const credentials = [
    { label: 'School', value: 'Palmetto High School' },
    { label: 'District', value: 'Anderson School District One' },
    { label: 'Subject', value: 'Health & Physical Education' },
    { label: 'Role', value: 'Football Coach' },
    { label: 'Graduate Program', value: 'Doctoral Student — Educational Leadership' },
    { label: 'Course', value: 'Athletic Leadership & Operations' },
  ]

  const expertise = [
    { area: 'Health & Physical Education', desc: 'Classroom instruction in health concepts, fitness, and physical education curriculum development.' },
    { area: 'Football Coaching', desc: 'On-field coaching experience building team culture, player development, and competitive programs.' },
    { area: 'Athletic Operations', desc: 'Hands-on experience managing the operational side of high school athletic programs.' },
    { area: 'Educational Leadership', desc: 'Doctoral-level study in leadership theory, school administration, and educational systems.' },
    { area: 'Google Workspace & Apps Script', desc: 'Technical skills in building dashboards, tracking systems, and automation tools for athletic programs.' },
    { area: 'Sports Media & Content', desc: 'Experience creating sports content, graphics, and media for athletic program promotion.' },
  ]

  return (
    <div className="pt-16">
      {/* HEADER */}
      <section className="relative py-24 px-6 bg-[#111] overflow-hidden">
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
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Instructor</span>
          </div>
          <h1 className="reveal delay-1 text-5xl md:text-7xl font-black leading-none mb-4"
            style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
            Mr. Jack<br /><span className="text-[#d81300]">Wardlaw</span>
          </h1>
          <p className="reveal delay-2 text-gray-400 text-lg max-w-xl leading-relaxed">
            Health/PE Teacher · Football Coach · Palmetto High School
          </p>
        </div>
      </section>

      {/* PHOTO + BIO */}
      <section className="bg-[#0f0f0f] py-20 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">

          {/* Photo placeholder */}
          <div className="io-reveal" data-delay="0">
            <div className="bg-[#111] border-2 border-[#d81300]/30 aspect-square flex flex-col items-center justify-center text-center p-8">
              <HorseshoeLogo className="w-24 h-24 object-contain opacity-20 mb-4" />
              <div className="text-gray-600 text-xs uppercase tracking-[0.15em] font-bold">Photo Coming Soon</div>
              <div className="text-gray-700 text-[10px] mt-2">Mr. Wardlaw · Palmetto HS</div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <div className="io-slide-right mb-6" data-delay="60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#d81300]" />
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">About</span>
              </div>
              <h2 className="text-3xl font-black mb-4">Building the Next Generation<br />of Athletic Leaders</h2>
            </div>
            <div className="io-reveal space-y-4 text-gray-400 leading-relaxed text-sm" data-delay="120">
              <p>
                Mr. Wardlaw is a Health and Physical Education teacher and football coach at Palmetto High School in Anderson School District One. He brings a unique combination of classroom instruction, on-field coaching experience, and ongoing doctoral study in Educational Leadership to the Athletic Leadership course.
              </p>
              <p>
                Athletic Leadership & Operations is built from real experience — not just theory. The course reflects what Mr. Wardlaw has learned running athletic programs, developing student-athletes, and studying what makes great leaders in educational and athletic contexts.
              </p>
              <p>
                Outside of the classroom and field, Mr. Wardlaw works extensively with technology — building Google Sheets dashboards, Apps Script automation tools, and athlete tracking systems for Palmetto's athletic programs. This technical background directly informs the data and analytics components of the course.
              </p>
              <p className="text-gray-500 italic">
                Photo and additional bio details coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="bg-[#111] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Credentials</span>
            </div>
            <div className="space-y-3">
              {credentials.map(({ label, value }) => (
                <div key={label} className="flex gap-4 bg-[#0f0f0f] border-l-2 border-[#d81300]/40 px-4 py-3">
                  <span className="text-gray-600 text-xs w-28 flex-shrink-0 uppercase tracking-wide font-bold pt-0.5">{label}</span>
                  <span className="text-white text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div ref={s2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Areas of Expertise</span>
            </div>
            <div className="space-y-3">
              {expertise.map(({ area, desc }, i) => (
                <div key={area}
                  className="io-reveal bg-[#0f0f0f] border border-white/5 p-4 hover:border-[#d81300]/20 transition-colors"
                  data-delay={String(i * 50)}>
                  <div className="text-white font-bold text-sm mb-1">{area}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSE CTA */}
      <section className="bg-[#0f0f0f] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-[#d81300]/20 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase mb-3">2026–2027</div>
              <h3 className="text-2xl font-black mb-3">Interested in Athletic Leadership?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Applications for the 2026–2027 school year are open. Mr. Wardlaw reviews every application personally — selection is based on character, work ethic, and commitment to Palmetto Athletics.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <button onClick={() => navigate('/apply')}
                className="px-8 py-3 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-all duration-200 whitespace-nowrap">
                Apply Now
              </button>
              <button onClick={() => navigate('/about')}
                className="px-8 py-3 border border-white/20 text-white font-bold text-sm tracking-[0.1em] uppercase hover:border-[#d81300]/60 hover:text-[#d81300] transition-all duration-200 whitespace-nowrap">
                Course Overview
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
