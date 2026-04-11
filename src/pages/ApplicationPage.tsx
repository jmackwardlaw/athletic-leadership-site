import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HorseshoeLogo } from '../components/Logos'
import Footer from '../components/Footer'

interface FormData {
  firstName: string
  lastName: string
  grade: string
  email: string
  phone: string
  sportsPlayed: string
  otherActivities: string
  whyInterested: string
  strengthsContribute: string
  roleInterest: string
  scenarioResponse: string
  leadershipExp: string
  commitmentConfirm: boolean
  internshipConfirm: boolean
  behaviorConfirm: boolean
}

const initialForm: FormData = {
  firstName: '', lastName: '', grade: '', email: '', phone: '',
  sportsPlayed: '', otherActivities: '',
  whyInterested: '', strengthsContribute: '', roleInterest: '',
  scenarioResponse: '',
  leadershipExp: '',
  commitmentConfirm: false, internshipConfirm: false, behaviorConfirm: false,
}

// ─────────────────────────────────────────────
// PASTE YOUR APPS SCRIPT WEB APP URL HERE
// Deploy the provided Apps Script as a Web App
// (Execute as: Me | Who has access: Anyone)
// then replace the placeholder below.
// ─────────────────────────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzs94QmCY0tKd7u8U92SDEMxuC7rSotEOt1D9cA93V0zhFUhUY_hN6vme5dI0ai-MOL/exec'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ApplicationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.grade) e.grade = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.whyInterested.trim() || form.whyInterested.length < 50) e.whyInterested = 'Please write at least 50 characters'
    if (!form.strengthsContribute.trim() || form.strengthsContribute.length < 50) e.strengthsContribute = 'Please write at least 50 characters'
    if (!form.roleInterest) e.roleInterest = 'Required'
    if (!form.scenarioResponse.trim() || form.scenarioResponse.length < 50) e.scenarioResponse = 'Please write at least 50 characters'
    if (!form.commitmentConfirm) e.commitmentConfirm = 'Required'
    if (!form.internshipConfirm) e.internshipConfirm = 'Required'
    if (!form.behaviorConfirm) e.behaviorConfirm = 'Required'
    setErrors(e)
    if (Object.keys(e).length > 0) {
      // scroll to first error
      const firstField = Object.keys(e)[0]
      const el = document.getElementById(`field-${firstField}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setErrorMsg('')

    const payload = {
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      grade: form.grade,
      email: form.email.trim(),
      phone: form.phone.trim() || '—',
      sportsPlayed: form.sportsPlayed.trim() || '—',
      otherActivities: form.otherActivities.trim() || '—',
      whyInterested: form.whyInterested.trim(),
      strengthsContribute: form.strengthsContribute.trim(),
      roleInterest: form.roleInterest,
      scenarioResponse: form.scenarioResponse.trim(),
      leadershipExp: form.leadershipExp.trim() || '—',
    }

    try {
      // Apps Script requires no-cors when called from a browser.
      // We use a fetch with no-cors — the response will be opaque but the data
      // still lands in the sheet. We optimistically treat it as success.
      if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbzs94QmCY0tKd7u8U92SDEMxuC7rSotEOt1D9cA93V0zhFUhUY_hN6vme5dI0ai-MOL/exec') {
        // Demo mode: simulate success after 1.5s
        await new Promise(r => setTimeout(r, 1500))
        setStatus('success')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      // no-cors gives opaque response — assume success
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setErrorMsg('Submission failed. Please check your connection and try again, or email Coach Wardlaw directly.')
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#111] border ${errors[field] ? 'border-red-500' : 'border-white/10'} text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d81300] transition-colors placeholder:text-gray-600`

  const textareaClass = (field: keyof FormData) =>
    `w-full bg-[#111] border ${errors[field] ? 'border-red-500' : 'border-white/10'} text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d81300] transition-colors placeholder:text-gray-600 resize-none`

  // ── SUCCESS SCREEN ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="pt-16 min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="w-20 h-20 bg-[#d81300] flex items-center justify-center font-black text-black text-3xl mx-auto mb-8">✓</div>
          <h1 className="text-5xl font-black mb-4">Application<br />Received.</h1>
          <p className="text-gray-400 leading-relaxed mb-3">
            Thanks, <span className="text-white font-bold">{form.firstName}</span>. Your application for the SALT Program has been logged.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Coach Wardlaw reviews all applications personally. Selected students will be contacted before the 2026–2027 school year. Not all applicants will be selected — membership is limited and based on character, commitment, and fit.
          </p>
          <div className="bg-[#111] border border-white/10 p-5 mb-10 text-left">
            <div className="text-[#d81300] text-xs font-black uppercase tracking-[0.15em] mb-3">Application Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Name', `${form.firstName} ${form.lastName}`],
                ['Grade', `${form.grade}th Grade`],
                ['Email', form.email],
                ['Role Interest', form.roleInterest === 'unsure' ? 'Open to any role' : form.roleInterest.charAt(0).toUpperCase() + form.roleInterest.slice(1)],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-gray-500 text-xs">{label}</div>
                  <div className="text-white font-bold text-sm">{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-colors"
            >
              Return Home
            </button>
            <button
              onClick={() => { setForm(initialForm); setStatus('idle') }}
              className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.1em] uppercase hover:border-white/40 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="relative py-20 px-6 bg-[#111] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)` }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">2026–2027 Selection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            SALT Program<br /><span className="text-[#d81300]">Application</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Membership in the Student Athletic Leadership Team is selective.
            Complete the application — Coach Wardlaw will review all submissions and notify selected students.
          </p>
        </div>
      </section>

      {/* Info bar */}
      <div className="bg-[#d81300]/10 border-y border-[#d81300]/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 justify-center md:justify-start">
          {[
            'Reviewed by Coach Wardlaw — not all applicants accepted',
            '15–20 minutes to complete',
            '2026–2027 Academic Year',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-[#d81300] font-black text-xs">—</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo mode banner */}
      {APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbzs94QmCY0tKd7u8U92SDEMxuC7rSotEOt1D9cA93V0zhFUhUY_hN6vme5dI0ai-MOL/exec' && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 py-3 px-6">
          <div className="max-w-3xl mx-auto text-center text-yellow-400 text-xs font-bold tracking-wide">
             DEMO MODE — Form submissions simulated. See setup instructions to connect Google Sheets.
          </div>
        </div>
      )}

      {/* Form */}
      <section className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-12" noValidate>

            {/* ── SECTION 1: Student Info ── */}
            <div>
              <SectionHeader num="1" title="Student Information" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field id="field-firstName" label="First Name" required error={errors.firstName}>
                  <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
                    className={inputClass('firstName')} placeholder="First name" />
                </Field>
                <Field id="field-lastName" label="Last Name" required error={errors.lastName}>
                  <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
                    className={inputClass('lastName')} placeholder="Last name" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field id="field-grade" label="Grade Level" required error={errors.grade}>
                  <select value={form.grade} onChange={e => set('grade', e.target.value)} className={inputClass('grade')}>
                    <option value="">Select grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                </Field>
                <Field id="field-email" label="Email Address" required error={errors.email}>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className={inputClass('email')} placeholder="your@email.com" />
                </Field>
              </div>
              <Field id="field-phone" label="Phone Number" hint="Optional">
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className={inputClass('phone')} placeholder="(864) 555-0000" />
              </Field>
            </div>

            <Divider />

            {/* ── SECTION 2: Athletic Background ── */}
            <div>
              <SectionHeader num="2" title="Athletic & Activity Background" />
              <div className="mb-4">
                <Field id="field-sportsPlayed" label="Sports / Athletic Programs You Participate In">
                  <input type="text" value={form.sportsPlayed} onChange={e => set('sportsPlayed', e.target.value)}
                    className={inputClass('sportsPlayed')} placeholder="e.g. Football, Track, Basketball — or 'None'" />
                </Field>
              </div>
              <Field id="field-otherActivities" label="Other Clubs, Organizations, or Activities">
                <input type="text" value={form.otherActivities} onChange={e => set('otherActivities', e.target.value)}
                  className={inputClass('otherActivities')} placeholder="e.g. Student Council, Beta Club, Band — or 'None'" />
              </Field>
            </div>

            <Divider />

            {/* ── SECTION 3: Interest & Motivation ── */}
            <div>
              <SectionHeader num="3" title="Interest & Motivation" />
              <div className="mb-6">
                <Field id="field-whyInterested" label="Why do you want to be part of the SALT Program?" required
                  hint="What drew you to this course? What do you hope to get out of it?" error={errors.whyInterested}>
                  <textarea rows={5} value={form.whyInterested} onChange={e => set('whyInterested', e.target.value)}
                    className={textareaClass('whyInterested')} placeholder="Write your response here..." />
                  <CharCount val={form.whyInterested} min={50} />
                </Field>
              </div>
              <div className="mb-6">
                <Field id="field-strengthsContribute" label="What strengths or skills would you bring to this team?" required
                  hint="Be specific — work ethic, skills, personality, experience." error={errors.strengthsContribute}>
                  <textarea rows={5} value={form.strengthsContribute} onChange={e => set('strengthsContribute', e.target.value)}
                    className={textareaClass('strengthsContribute')} placeholder="Write your response here..." />
                  <CharCount val={form.strengthsContribute} min={50} />
                </Field>
              </div>
              <Field id="field-roleInterest" label="Which SALT role interests you most?" required error={errors.roleInterest}>
                <select value={form.roleInterest} onChange={e => set('roleInterest', e.target.value)} className={inputClass('roleInterest')}>
                  <option value="">Select a role...</option>
                  <option value="operations">Operations Lead</option>
                  <option value="media">Media & Content Lead</option>
                  <option value="equipment">Equipment Manager</option>
                  <option value="spirit">Spirit & Engagement Lead</option>
                  <option value="development">Athletic Development Assistant</option>
                  <option value="community">Community Relations Coordinator</option>
                  <option value="unsure">Not sure yet — open to any role</option>
                </select>
              </Field>
            </div>

            <Divider />

            {/* ── SECTION 4: Scenario ── */}
            <div>
              <SectionHeader num="4" title="Scenario Response" />
              <div className="bg-[#111] border border-[#d81300]/20 p-6 mb-4">
                <div className="text-[#d81300] text-xs font-black uppercase tracking-[0.1em] mb-3">Scenario</div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  It's 30 minutes before a home football game. The equipment you were responsible
                  for organizing hasn't been set out yet. The coach is busy. Two other SALT
                  members aren't there yet. There's a lot to do and not much time.
                </p>
                <p className="text-gray-400 text-sm mt-3">
                  <strong className="text-white">How do you handle it?</strong> Walk through what you would actually do.
                </p>
              </div>
              <Field id="field-scenarioResponse" label="Your Response" required error={errors.scenarioResponse}>
                <textarea rows={6} value={form.scenarioResponse} onChange={e => set('scenarioResponse', e.target.value)}
                  className={textareaClass('scenarioResponse')} placeholder="Describe what you would do, step by step..." />
                <CharCount val={form.scenarioResponse} min={50} />
              </Field>
            </div>

            <Divider />

            {/* ── SECTION 5: Leadership ── */}
            <div>
              <SectionHeader num="5" title="Leadership Experience" />
              <Field id="field-leadershipExp"
                label="Describe a time you took a leadership role or showed responsibility."
                hint="Optional — sports, school, work, family. Leave blank if you don't have an example.">
                <textarea rows={4} value={form.leadershipExp} onChange={e => set('leadershipExp', e.target.value)}
                  className={textareaClass('leadershipExp')} placeholder="Optional..." />
              </Field>
            </div>

            <Divider />

            {/* ── SECTION 6: Commitments ── */}
            <div>
              <SectionHeader num="6" title="Commitment Acknowledgements" />
              <div className="space-y-3">
                {([
                  ['commitmentConfirm', 'I understand that SALT is a real commitment — not just a class. Members are expected to show up, work hard, and be reliable before, during, and after athletic events.'],
                  ['internshipConfirm', 'I understand that SALT members complete an internship with a school athletic program and may be required to attend events outside of regular school hours.'],
                  ['behaviorConfirm', "I understand that SALT membership requires professional behavior, respect for coaches and staff, and commitment to Palmetto's athletic culture. Membership can be revoked."],
                ] as [keyof FormData, string][]).map(([field, text]) => (
                  <div
                    key={field}
                    id={`field-${field}`}
                    className={`flex gap-4 items-start p-4 border cursor-pointer transition-colors ${errors[field] ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-[#111] hover:border-[#d81300]/30'}`}
                    onClick={() => set(field, !form[field])}
                  >
                    <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${form[field] ? 'bg-[#d81300] border-[#d81300]' : 'border-white/30'}`}>
                      {form[field] && <span className="text-black text-xs font-black">✓</span>}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed select-none">{text}</p>
                  </div>
                ))}
                {(errors.commitmentConfirm || errors.internshipConfirm || errors.behaviorConfirm) && (
                  <p className="text-red-400 text-xs mt-1">All three acknowledgements are required.</p>
                )}
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <div className="pt-2">
              <div className="bg-[#111] border border-white/5 p-5 mb-6">
                <p className="text-gray-500 text-xs leading-relaxed">
                  <strong className="text-gray-300">Important:</strong> Submitting this application does not guarantee selection.
                  All applications are reviewed by Coach Wardlaw. Selected students will be contacted prior to the 2026–2027 school year.
                  SALT membership is limited and based on character, commitment, and fit.
                </p>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/40 p-4 mb-4 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-5 font-black text-sm tracking-[0.2em] uppercase transition-all ${
                  status === 'loading'
                    ? 'bg-[#d81300]/50 text-white/50 cursor-not-allowed'
                    : 'bg-[#d81300] text-black hover:bg-[#ff1a00]'
                }`}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Application'}
              </button>
            </div>

          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// ── Helper Components ──────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-6 bg-[#d81300] flex items-center justify-center font-black text-black text-xs flex-shrink-0">{num}</div>
      <h2 className="text-lg font-black uppercase tracking-[0.15em]">{title}</h2>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-white/5" />
}

function Field({
  id, label, required, hint, error, children,
}: {
  id: string; label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div id={id}>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
        {label} {required && <span className="text-[#d81300]">*</span>}
        {hint && <span className="text-gray-600 normal-case font-normal tracking-normal ml-2">— {hint}</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function CharCount({ val, min }: { val: string; min: number }) {
  return (
    <div className="flex justify-end mt-1">
      <span className={`text-xs ${val.length >= min ? 'text-[#d81300]' : 'text-gray-600'}`}>
        {val.length} / {min} min
      </span>
    </div>
  )
}
