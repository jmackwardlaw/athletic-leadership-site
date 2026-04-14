import { HorseshoeLogo } from '../components/Logos'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Footer from '../components/Footer'
import coachPhoto from '../assets/coach-wardlaw.jpg'

export default function InstructorPage() {
  const navigate = useNavigate()
  const s1 = useScrollReveal()
  const s2 = useScrollReveal()

  const credentials = [
    { label: 'School', value: 'Palmetto High School' },
    { label: 'District', value: 'Anderson School District One' },
    { label: 'Subject', value: 'Health & Physical Education' },
    { label: 'Role', value: 'Football Coach' },
    { label: 'Course', value: 'Athletic Leadership' },
  ]

  const education = [
    { degree: 'Bachelor of Science (BS)', school: 'Clemson University', status: null },
    { degree: 'Master of Arts in Teaching (MAT)', school: 'Liberty University', status: null },
    { degree: 'Doctor of Education: Educational Leadership (Ed.D)', school: 'Liberty University', status: 'In Progress' },
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
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Course Instructor</span>
          </div>
          <h1 className="reveal delay-1 text-5xl md:text-7xl font-black leading-none mb-4"
            style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}>
            Coach<br /><span className="text-[#d81300]">Wardlaw</span>
          </h1>
          <p className="reveal delay-2 text-gray-400 text-lg max-w-xl leading-relaxed">
            Health/PE Teacher · Football Coach · Palmetto High School
          </p>
        </div>
      </section>

      {/* PHOTO + BIO */}
      <section className="bg-white py-20 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">

          {/* Photo */}
          <div className="io-reveal" data-delay="0">
            <div className="border-2 border-[#d81300]/30 aspect-square overflow-hidden">
              <img
                src={coachPhoto}
                alt="Coach Wardlaw"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-3 text-center">
              <div className="text-gray-900 font-black text-sm">Coach Jack Wardlaw</div>
              <div className="text-[#d81300] text-xs font-bold tracking-wide uppercase mt-0.5">Palmetto High School</div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <div className="io-slide-right mb-6" data-delay="60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#d81300]" />
                <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">About</span>
              </div>
              <h2 className="text-3xl font-black mb-4 text-gray-900">Building the Next Generation<br />of Athletic Leaders</h2>
            </div>
            <div className="io-reveal space-y-4 text-gray-600 leading-relaxed text-sm" data-delay="120">
              <p>
                Coach Wardlaw is a Health and Physical Education teacher and football coach at Palmetto High School and a 2014 PHS graduate. Teaching in the community he grew up in is something he is passionate about, and his focus as an educator is helping students develop the confidence, accountability, and discipline to make a positive impact on those around them.
              </p>
              <p>
                While completing his degree at Clemson, he was on staff with the football program throughout his time there, including the 2016 and 2018 National Championship seasons under Dabo Swinney. He later worked in the NFL with the Jacksonville Jaguars under Super Bowl-winning head coach Doug Pederson. Those experiences gave him a firsthand look at how elite programs operate at the highest level, including the culture, communication, leadership structure, and daily accountability that separate good programs from great ones.
              </p>
              <p>
                He also minored in Athletic Leadership at Clemson, where he discovered how many careers exist in sports beyond playing. Those courses, combined with his experiences at Clemson and in the NFL, are what inspired the creation of this course.
              </p>
              <p>
                Athletic Leadership was built to give Palmetto students real experience inside athletic programs, real career awareness, and the leadership habits that carry into every area of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS + EDUCATION */}
      <section className="bg-gradient-to-br from-[#242424] to-[#383838] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Credentials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Credentials</span>
            </div>
            <div className="space-y-3">
              {credentials.map(({ label, value }) => (
                <div key={label} className="flex gap-4 bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border-l-2 border-[#d81300]/40 px-4 py-3">
                  <span className="text-gray-600 text-xs w-20 flex-shrink-0 uppercase tracking-wide font-bold pt-0.5">{label}</span>
                  <span className="text-white text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Education</span>
            </div>
            <div className="space-y-3">
              {education.map(({ degree, school, status }) => (
                <div key={degree} className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border-l-2 border-[#d81300]/40 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-white text-sm font-bold leading-snug">{degree}</div>
                    {status && (
                      <span className="text-[9px] font-black text-[#d81300] border border-[#d81300]/40 px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap flex-shrink-0 mt-0.5">{status}</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{school}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div ref={s2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d81300]" />
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">Areas of Expertise</span>
            </div>
            <div className="space-y-3">
              {expertise.map(({ area, desc }, i) => (
                <div key={area}
                  className="io-reveal bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] border border-white/5 p-4 hover:border-[#d81300]/20 transition-colors"
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
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#242424] to-[#383838] border border-[#d81300]/20 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase mb-3">2026–2027</div>
              <h3 className="text-2xl font-black mb-3">Interested in Athletic Leadership?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Applications for the 2026–2027 school year are open. Coach Wardlaw reviews every application personally — selection is based on character, work ethic, and commitment to Palmetto Athletics.
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
