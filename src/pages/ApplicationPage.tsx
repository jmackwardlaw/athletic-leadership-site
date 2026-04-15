import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

// ─────────────────────────────────────────────
// GOOGLE SIGN-IN CONFIGURATION
// ─────────────────────────────────────────────
// 1. https://console.cloud.google.com/ → Create a new project
// 2. APIs & Services → OAuth consent screen → External → fill in app name
//    (e.g. "Athletic Leadership Application"). Add your email as support contact.
// 3. Credentials → Create Credentials → OAuth Client ID → type: Web application
// 4. Authorized JavaScript origins: add BOTH
//       http://localhost:5173          (for local dev)
//       https://your-deploy-domain     (e.g. https://athletic-leadership.vercel.app)
// 5. Copy the Client ID (format: 123456-abcdef.apps.googleusercontent.com)
//    and paste it below, replacing the placeholder.
const GOOGLE_CLIENT_ID = '936947519171-l6n44hr7qktcrl9809bcm8p5bukp7eju.apps.googleusercontent.com'
const HOSTED_DOMAIN = 'apps.anderson1.org'
const IS_DEMO_AUTH = GOOGLE_CLIENT_ID === 'YOUR_CLIENT_ID.apps.googleusercontent.com'

// ─────────────────────────────────────────────
// GOOGLE SHEETS STORAGE (via Apps Script Web App)
// ─────────────────────────────────────────────
// 1. Create a new Google Sheet on your @apps.anderson1.org account
// 2. Extensions → Apps Script → paste the doPost() code from SETUP.md
// 3. Deploy → New deployment → Web App
//    - Execute as: Me (your email)
//    - Who has access: Anyone
// 4. Copy the Web app URL and paste it below.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWOs2eSj9ZQODY-1MW6HJj6eZom0sqj-iK9dUjzlYds67WSYA541Qd2EVL1XlYSCl7Iw/exec'
const IS_DEMO_STORAGE = APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbxWOs2eSj9ZQODY-1MW6HJj6eZom0sqj-iK9dUjzlYds67WSYA541Qd2EVL1XlYSCl7Iw/exec'

const MIN_LONG = 50

// ── Types ──────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

interface GoogleUser {
  email: string
  name: string
  givenName: string
  familyName: string
  sub: string
  picture?: string
  credential: string
}

interface FormData {
  firstName: string
  lastName: string
  grade: string
  phone: string
  sportsPlayed: string
  otherActivities: string
  q1Responsibility: string
  q2WhyContribute: string
  q3GreatLeader: string
  q4Feedback: string
  q5AreaInterest: string
  q6Respect: string
  q7Background: string
  commitmentConfirm: boolean
  internshipConfirm: boolean
  behaviorConfirm: boolean
}

const initialForm: FormData = {
  firstName: '', lastName: '', grade: '', phone: '',
  sportsPlayed: '', otherActivities: '',
  q1Responsibility: '',
  q2WhyContribute: '',
  q3GreatLeader: '',
  q4Feedback: '',
  q5AreaInterest: '',
  q6Respect: '',
  q7Background: '',
  commitmentConfirm: false, internshipConfirm: false, behaviorConfirm: false,
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

// Decode a Google ID-token (JWT) payload client-side. We don't verify the
// signature here — that's done by Apps Script if desired. We only read the
// claims so we can display the student's name/email and enforce the
// hosted-domain restriction as belt-and-suspenders.
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ApplicationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const signInBtnRef = useRef<HTMLDivElement>(null)

  // ── Google Sign-In: load script + render button ──
  useEffect(() => {
    if (IS_DEMO_AUTH || googleUser) return

    const initializeGoogleAuth = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        hosted_domain: HOSTED_DOMAIN,
        auto_select: false,
        ux_mode: 'popup',
      })
      if (signInBtnRef.current) {
        signInBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(signInBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        })
      }
    }

    if (window.google?.accounts?.id) {
      initializeGoogleAuth()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    )
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogleAuth)
      return () => existingScript.removeEventListener('load', initializeGoogleAuth)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleAuth
    script.onerror = () => setAuthError('Failed to load Google Sign-In. Check your connection and refresh.')
    document.head.appendChild(script)
  }, [googleUser])

  const handleCredentialResponse = (response: { credential: string }) => {
    const payload = decodeJwt(response.credential)
    if (!payload) {
      setAuthError('Could not read your Google account. Please try again.')
      return
    }
    // Defense in depth: verify hosted_domain client-side.
    // The `hd` claim is set for Google Workspace accounts.
    if (payload.hd !== HOSTED_DOMAIN) {
      setAuthError(`You must sign in with your @${HOSTED_DOMAIN} Anderson District One student account.`)
      return
    }
    const givenName = (payload.given_name as string) || ''
    const familyName = (payload.family_name as string) || ''
    setGoogleUser({
      email: payload.email as string,
      name: payload.name as string,
      givenName,
      familyName,
      sub: payload.sub as string,
      picture: payload.picture as string | undefined,
      credential: response.credential,
    })
    // Pre-fill name fields from Google identity — student can still edit
    // (e.g. to use a preferred name / nickname).
    setForm(prev => ({
      ...prev,
      firstName: prev.firstName || givenName,
      lastName: prev.lastName || familyName,
    }))
    setAuthError(null)
  }

  const handleSignOut = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    setGoogleUser(null)
    setAuthError(null)
  }

  const handleDemoSignIn = () => {
    setGoogleUser({
      email: 'demo.student@apps.anderson1.org',
      name: 'Demo Student',
      givenName: 'Demo',
      familyName: 'Student',
      sub: 'demo-sub-12345',
      credential: 'demo',
    })
    setForm(prev => ({
      ...prev,
      firstName: prev.firstName || 'Demo',
      lastName: prev.lastName || 'Student',
    }))
  }

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.grade) e.grade = 'Required'

    const longAnswers: (keyof FormData)[] = [
      'q1Responsibility', 'q2WhyContribute', 'q3GreatLeader',
      'q4Feedback', 'q5AreaInterest', 'q6Respect',
    ]
    for (const field of longAnswers) {
      const val = (form[field] as string).trim()
      if (!val) e[field] = 'Required'
      else if (val.length < MIN_LONG) e[field] = `Please write at least ${MIN_LONG} characters`
    }
    if (!form.q7Background.trim()) e.q7Background = 'Required — write "Nothing to disclose" if nothing applies'

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
    if (!googleUser) {
      setAuthError('You must sign in with your school Google account before submitting.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!validate()) return

    setStatus('loading')
    setErrorMsg('')

    const payload = {
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      // Verified Google identity (via Google Sign-In)
      google_email: googleUser.email,
      google_name: googleUser.name,
      google_sub: googleUser.sub,
      google_credential: googleUser.credential,
      // Student-provided info
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      grade: form.grade,
      phone: form.phone.trim() || '—',
      sportsPlayed: form.sportsPlayed.trim() || '—',
      otherActivities: form.otherActivities.trim() || '—',
      q1_responsibility: form.q1Responsibility.trim(),
      q2_why_contribute: form.q2WhyContribute.trim(),
      q3_great_leader: form.q3GreatLeader.trim(),
      q4_feedback: form.q4Feedback.trim(),
      q5_area_interest: form.q5AreaInterest.trim(),
      q6_respect: form.q6Respect.trim(),
      q7_background: form.q7Background.trim(),
    }

    try {
      if (IS_DEMO_STORAGE) {
        // Demo mode: simulate success after 1.5s
        await new Promise(r => setTimeout(r, 1500))
        setStatus('success')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Apps Script requires no-cors from a browser. The response will be
      // opaque but the data still lands in the sheet. Treat as success.
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setErrorMsg('Submission failed. Please check your connection and try again, or email Coach Wardlaw directly.')
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full bg-white border ${errors[field] ? 'border-red-500' : 'border-gray-300'} text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-[#d81300] transition-colors placeholder:text-gray-400`

  const textareaClass = (field: keyof FormData) =>
    `w-full bg-white border ${errors[field] ? 'border-red-500' : 'border-gray-300'} text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-[#d81300] transition-colors placeholder:text-gray-400 resize-none`

  // ── SUCCESS SCREEN ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="w-20 h-20 bg-[#d81300] flex items-center justify-center font-black text-black text-3xl mx-auto mb-8">✓</div>
          <h1 className="text-5xl font-black mb-4">Application<br />Received.</h1>
          <p className="text-gray-400 leading-relaxed mb-3">
            Thanks, <span className="text-white font-bold">{form.firstName}</span>. Your application for the Athletic Leadership program has been logged.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Coach Wardlaw reviews all applications personally. Selected students will be contacted before the 2026–2027 school year. Not all applicants will be accepted — admission is based on character, commitment, and fit.
          </p>
          <div className="bg-white border border-gray-200 p-5 mb-10 text-left">
            <div className="text-[#d81300] text-xs font-black uppercase tracking-[0.15em] mb-3">Application Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Name', `${form.firstName} ${form.lastName}`],
                ['Grade', `${form.grade}th Grade`],
                ['Email', googleUser?.email || '—'],
                ['Phone', form.phone || '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-gray-500 text-xs">{label}</div>
                  <div className="text-gray-900 font-bold text-sm break-words">{val}</div>
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
              onClick={() => { setForm(initialForm); setStatus('idle'); handleSignOut() }}
              className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.1em] uppercase hover:border-white/40 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── SIGN-IN GATE (shown before student signs in) ─────────────────────────────
  if (!googleUser) {
    return (
      <div className="pt-16">
        {/* Header */}
        <section className="relative py-20 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)` }}
          />
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#d81300]"></div>
              <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">2026–2027 Enrollment</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Athletic Leadership<br /><span className="text-[#d81300]">Application</span>
            </h1>
            <p className="text-gray-400 max-w-xl leading-relaxed">
              Admission to the Athletic Leadership program is selective.
              Complete the application — Coach Wardlaw will review every submission and notify selected students.
            </p>
          </div>
        </section>

        {/* Sign-in gate */}
        <section className="py-20 px-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
          <div className="max-w-xl mx-auto">
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 text-center">
              <div className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase mb-4">Step 1 — Verify Identity</div>
              <h2 className="text-3xl font-black mb-4">Sign in to begin</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Use your <span className="text-white font-bold">Anderson District One</span> student Google account to start your application. This verifies your identity so Coach Wardlaw can contact you.
              </p>
              <div className="flex justify-center mb-4 min-h-[44px]">
                {IS_DEMO_AUTH ? (
                  <button
                    type="button"
                    onClick={handleDemoSignIn}
                    className="px-8 py-3 bg-[#d81300] text-white font-black text-sm tracking-[0.1em] uppercase hover:bg-[#ff1a00] transition-colors"
                  >
                    Continue (Demo Mode)
                  </button>
                ) : (
                  <div ref={signInBtnRef}></div>
                )}
              </div>
              <p className="text-gray-500 text-xs">
                Only <span className="text-white">@{HOSTED_DOMAIN}</span> accounts can submit this application.
              </p>
              {authError && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                  {authError}
                </div>
              )}
              {IS_DEMO_AUTH && (
                <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs text-left leading-relaxed">
                  <strong>Demo Mode:</strong> Google Sign-In is not yet configured. Replace <code className="text-yellow-300">GOOGLE_CLIENT_ID</code> in <code className="text-yellow-300">ApplicationPage.tsx</code> with your OAuth Client ID to enable real sign-in.
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // ── FORM (shown after sign-in) ───────────────────────────────────────────────
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-[#242424] to-[#383838] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #d81300, #d81300 1px, transparent 1px, transparent 24px)` }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#d81300]"></div>
            <span className="text-[#d81300] text-xs font-black tracking-[0.3em] uppercase">2026–2027 Enrollment</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Athletic Leadership<br /><span className="text-[#d81300]">Application</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Admission to the Athletic Leadership program is selective.
            Complete the application — Coach Wardlaw will review every submission and notify selected students.
          </p>
        </div>
      </section>

      {/* Info bar */}
      <div className="bg-[#d81300]/10 border-y border-[#d81300]/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 justify-center md:justify-start">
          {[
            'Reviewed by Coach Wardlaw — not all applicants accepted',
            'Plan 20–30 minutes for thoughtful responses',
            '2026–2027 Academic Year',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="text-[#d81300] font-black text-xs">—</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signed-in banner */}
      <div className="bg-[#1a1a1a] border-b border-white/10 py-3 px-6">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm min-w-0">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-400 flex-shrink-0">Signed in as</span>
            <span className="text-white font-bold truncate">{googleUser.name}</span>
            <span className="text-gray-500 hidden sm:inline truncate">— {googleUser.email}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-gray-400 hover:text-white text-xs underline flex-shrink-0"
          >
            Not you? Sign out
          </button>
        </div>
      </div>

      {/* Demo mode banner */}
      {IS_DEMO_STORAGE && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 py-3 px-6">
          <div className="max-w-3xl mx-auto text-center text-yellow-400 text-xs font-bold tracking-wide">
             DEMO MODE — Form submissions simulated. Connect Google Sheets via Apps Script to store responses.
          </div>
        </div>
      )}

      {/* Form */}
      <section className="bg-white py-12 px-6">
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
                <Field id="field-phone" label="Phone Number" hint="Optional">
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className={inputClass('phone')} placeholder="(864) 555-0000" />
                </Field>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800">Verified email:</span>{' '}
                <span className="text-gray-900">{googleUser.email}</span>
                <span className="text-gray-500"> (from your Google Sign-In — cannot be changed)</span>
              </div>
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

            {/* ── SECTION 3: Short Answer Responses ── */}
            <div>
              <SectionHeader num="3" title="Short Answer Responses" />
              <p className="text-gray-600 text-sm leading-relaxed -mt-3 mb-8">
                Answer each question honestly and thoughtfully. Coach Wardlaw reads every response — there are no right or wrong answers, just real ones.
              </p>

              <div className="space-y-8">
                <EssayField
                  id="field-q1Responsibility"
                  num="1"
                  question="Describe a time you took responsibility for something that went wrong — in school, sports, or life. What did you do?"
                  value={form.q1Responsibility}
                  onChange={v => set('q1Responsibility', v)}
                  error={errors.q1Responsibility}
                  className={textareaClass('q1Responsibility')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q2WhyContribute"
                  num="2"
                  question="Why do you want to be part of the Athletic Leadership program? What do you hope to contribute — not just gain?"
                  value={form.q2WhyContribute}
                  onChange={v => set('q2WhyContribute', v)}
                  error={errors.q2WhyContribute}
                  className={textareaClass('q2WhyContribute')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q3GreatLeader"
                  num="3"
                  question="Describe someone you consider a great leader in athletics. It doesn't have to be a famous person. What makes them effective?"
                  value={form.q3GreatLeader}
                  onChange={v => set('q3GreatLeader', v)}
                  error={errors.q3GreatLeader}
                  className={textareaClass('q3GreatLeader')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q4Feedback"
                  num="4"
                  question="Have you ever received criticism or feedback that was hard to hear? How did you respond?"
                  value={form.q4Feedback}
                  onChange={v => set('q4Feedback', v)}
                  error={errors.q4Feedback}
                  className={textareaClass('q4Feedback')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q5AreaInterest"
                  num="5"
                  question="Athletic programs need people in many roles — marketing, operations, management, media, and more. Which area interests you most and why?"
                  value={form.q5AreaInterest}
                  onChange={v => set('q5AreaInterest', v)}
                  error={errors.q5AreaInterest}
                  className={textareaClass('q5AreaInterest')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q6Respect"
                  num="6"
                  question="What does respect look like in an athletic environment — toward coaches, teammates, opponents, and officials?"
                  value={form.q6Respect}
                  onChange={v => set('q6Respect', v)}
                  error={errors.q6Respect}
                  className={textareaClass('q6Respect')}
                  min={MIN_LONG}
                />
                <EssayField
                  id="field-q7Background"
                  num="7"
                  question="Is there anything in your background — behavior, grades, or attendance — we should know about? If so, how have you addressed it?"
                  hint={'Required. If nothing applies, write "Nothing to disclose."'}
                  value={form.q7Background}
                  onChange={v => set('q7Background', v)}
                  error={errors.q7Background}
                  className={textareaClass('q7Background')}
                  rows={4}
                />
              </div>
            </div>

            <Divider />

            {/* ── SECTION 4: Commitments ── */}
            <div>
              <SectionHeader num="4" title="Commitment Acknowledgements" />
              <div className="space-y-3">
                {([
                  ['commitmentConfirm', 'I understand that Athletic Leadership is a real commitment — not just a class. Members are expected to show up, work hard, and be reliable before, during, and after athletic events.'],
                  ['internshipConfirm', 'I understand that students complete an internship with a school athletic program and may be required to attend events outside of regular school hours.'],
                  ['behaviorConfirm', "I understand that participation requires professional behavior, respect for coaches and staff, and commitment to Palmetto's athletic culture. Enrollment can be revoked."],
                ] as [keyof FormData, string][]).map(([field, text]) => (
                  <div
                    key={field}
                    id={`field-${field}`}
                    className={`flex gap-4 items-start p-4 border cursor-pointer transition-colors ${errors[field] ? 'border-red-500 bg-red-500/5' : 'border-gray-300 bg-white hover:border-[#d81300]/50'}`}
                    onClick={() => set(field, !form[field])}
                  >
                    <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${form[field] ? 'bg-[#d81300] border-[#d81300]' : 'border-white/30'}`}>
                      {form[field] && <span className="text-black text-xs font-black">✓</span>}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed select-none">{text}</p>
                  </div>
                ))}
                {(errors.commitmentConfirm || errors.internshipConfirm || errors.behaviorConfirm) && (
                  <p className="text-red-400 text-xs mt-1">All three acknowledgements are required.</p>
                )}
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <div className="pt-2">
              <div className="bg-gray-50 border border-gray-200 p-5 mb-6">
                <p className="text-gray-600 text-xs leading-relaxed">
                  <strong className="text-gray-800">Important:</strong> Submitting this application does not guarantee admission.
                  All applications are reviewed by Coach Wardlaw. Selected students will be contacted prior to the 2026–2027 school year.
                  Enrollment is limited and based on character, commitment, and fit.
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
      <h2 className="text-lg font-black uppercase tracking-[0.15em] text-gray-900">{title}</h2>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-gray-200" />
}

function Field({
  id, label, required, hint, error, children,
}: {
  id: string; label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div id={id}>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-[0.1em] mb-1">
        {label} {required && <span className="text-[#d81300]">*</span>}
        {hint && <span className="text-gray-600 normal-case font-normal tracking-normal ml-2">— {hint}</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function EssayField({
  id, num, question, hint, value, onChange, error, className, min, rows = 5,
}: {
  id: string
  num: string
  question: string
  hint?: string
  value: string
  onChange: (v: string) => void
  error?: string
  className: string
  min?: number
  rows?: number
}) {
  return (
    <div id={id}>
      <div className="mb-3">
        <div className="flex items-start gap-3">
          <span className="text-[#d81300] font-black text-sm mt-0.5 flex-shrink-0">Q{num}.</span>
          <label className="text-gray-900 text-sm leading-relaxed font-bold">
            {question} <span className="text-[#d81300]">*</span>
          </label>
        </div>
        {hint && <p className="text-gray-500 text-xs mt-1 ml-8 italic">{hint}</p>}
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={className}
        placeholder="Write your response here..."
      />
      {min !== undefined && <CharCount val={value} min={min} />}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function CharCount({ val, min }: { val: string; min: number }) {
  return (
    <div className="flex justify-end mt-1">
      <span className={`text-xs ${val.length >= min ? 'text-[#d81300]' : 'text-gray-500'}`}>
        {val.length} / {min} min
      </span>
    </div>
  )
}
