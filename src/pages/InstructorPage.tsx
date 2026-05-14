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
    { label: 'Role', value: 'Health & PE Teacher and Football Coach' },
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
    <div className="pt-[100px]">
      {/* HEADER */}
      <section className="relative py-24 md:py-28 px-6 bg-surface-base overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(216,19,0,0.22) 0%, rgba(216,19,0,0.05) 35%, transparent 65%)' }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-[0.04]">
          <HorseshoeLogo className="w-[600px] h-[600px] object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="red-grad-rule w-12" />
            <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Course Instructor</span>
          </div>
          <h1 className="reveal delay-1 font-display text-5xl md:text-7xl font-black leading-[0.95] mb-5">
            Coach<br /><span className="red-grad-text">Wardlaw</span>
          </h1>
          <p className="reveal delay-2 text-ink-secondary text-lg max-w-xl leading-relaxed">
            Health/PE Teacher · Football Coach · Palmetto High School
          </p>
        </div>
      </section>

      {/* PHOTO + BIO */}
      <section className="bg-surface-raised py-24 md:py-28 px-6" ref={s1}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">

          {/* Photo */}
          <div className="io-reveal" data-delay="0">
            <div className="card-dark red-card-edge aspect-square overflow-hidden">
              <img
                src={coachPhoto}
                alt="Coach Wardlaw"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="font-headline text-ink-primary font-black text-sm">Coach Jack Wardlaw</div>
              <div className="font-headline text-brand-red text-xs font-bold tracking-[0.18em] uppercase mt-0.5">Palmetto High School</div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <div className="io-slide-right mb-6" data-delay="60">
              <div className="flex items-center gap-3 mb-5">
                <div className="red-grad-rule w-10" />
                <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">About</span>
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-black mb-6 text-ink-primary leading-tight">Building the next generation<br />of <span className="red-grad-text">athletic leaders</span></h2>
            </div>
            <div className="io-reveal space-y-5 text-ink-secondary leading-relaxed" data-delay="120">
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
      <section className="bg-surface-base py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Credentials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="red-grad-rule w-10" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Credentials</span>
            </div>
            <div className="space-y-3">
              {credentials.map(({ label, value }) => (
                <div key={label} className="flex gap-4 card-dark px-4 py-3">
                  <span className="font-headline text-ink-muted text-[10px] w-16 flex-shrink-0 uppercase tracking-[0.15em] font-bold pt-0.5">{label}</span>
                  <span className="text-ink-primary text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="red-grad-rule w-10" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Education</span>
            </div>
            <div className="space-y-3">
              {education.map(({ degree, school, status }) => (
                <div key={degree} className="card-dark px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-ink-primary text-sm font-bold leading-snug">{degree}</div>
                    {status && (
                      <span className="font-headline text-[9px] font-bold text-brand-red border border-brand-red/40 px-1.5 py-0.5 uppercase tracking-[0.15em] whitespace-nowrap flex-shrink-0 mt-0.5 rounded-sm">{status}</span>
                    )}
                  </div>
                  <div className="text-ink-muted text-xs mt-1">{school}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div ref={s2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="red-grad-rule w-10" />
              <span className="font-headline text-[11px] font-bold tracking-[0.22em] uppercase text-ink-secondary">Areas of Expertise</span>
            </div>
            <div className="space-y-3">
              {expertise.map(({ area, desc }, i) => (
                <div key={area}
                  className="io-reveal card-dark p-4"
                  data-delay={String(i * 50)}>
                  <div className="text-ink-primary font-bold text-sm mb-1">{area}</div>
                  <div className="text-ink-muted text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* COURSE CTA */}
      <section className="bg-surface-raised py-24 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-dark red-card-edge p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="font-headline text-brand-red text-[11px] font-bold tracking-[0.22em] uppercase mb-3">2026–2027</div>
              <h3 className="font-headline text-2xl md:text-3xl font-black mb-3 leading-tight">Interested in Athletic Leadership?</h3>
              <p className="text-ink-secondary leading-relaxed">
                Applications for the 2026–2027 school year are open. Coach Wardlaw reviews every application personally — selection is based on character, work ethic, and commitment to Palmetto Athletics.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <button onClick={() => navigate('/apply')} className="btn btn-primary whitespace-nowrap">
                Apply Now
              </button>
              <button onClick={() => navigate('/about')} className="btn btn-outline whitespace-nowrap">
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
