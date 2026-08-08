// ─────────────────────────────────────────────────────────────
// Import Unit 1 (L1.1–L1.5) into the active course as student-facing items.
//
// Usage: needs a service-account key, exactly like `npm run seed`.
//   export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json
//   node scripts/import-unit1.mjs
//
// A Firebase CLI OAuth token will NOT do — see makeCredential below.
//
// Idempotent: fixed document ids, merge writes. Re-running updates the same
// docs. Everything is written published:false — review in the CMS at
// /hub/teacher/content, then publish.
//
// ── WHAT IS DELIBERATELY NOT HERE ────────────────────────────
// The source documents in Drive are TEACHER lesson plans. They contain
// planted-trap answer keys (L1.1 Appendix B), facilitator ruling banks
// (L1.2 Appendix D), the four-corner style key (L1.4 Appendix A), and the
// sealed fallback podcast format (L1.5 Appendix E). None of that is
// reproduced below.
//
// This is not a stylistic choice. Firestore rules allow ANY signed-in
// allowed-domain user to read every doc under courses/**, regardless of the
// `published` flag — `published:false` hides content from the UI, not from
// the database. A student with the SDK can read a draft item. So teacher-only
// material must never be written into courses/**; it stays in Drive.
// ─────────────────────────────────────────────────────────────
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const PROJECT_ID = 'phs-al-hub'
const MODULE_ID = 'u1-foundations'

// NOTE: a bare OAuth token (e.g. `firebase auth:print-access-token`) does NOT
// work here. firebase-admin's Firestore client checks the credential *type* and
// rejects anything that is not a certificate or real ADC:
//   firestore/invalid-credential: Must initialize the SDK with a certificate
//   credential or application default credentials
// So this needs a service-account key, same as scripts/seed.mjs.
function makeCredential() {
  const explicit = process.env.SERVICE_ACCOUNT
  if (explicit) {
    console.log('auth: service-account file from $SERVICE_ACCOUNT')
    return cert(JSON.parse(readFileSync(explicit, 'utf8')))
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('auth: $GOOGLE_APPLICATION_CREDENTIALS')
    return applicationDefault()
  }

  // Without this guard, applicationDefault() finds nothing and stalls probing
  // for a GCE metadata server that is not there — a silent hang with no error.
  console.error(
    'No credentials found.\n\n' +
      'Firebase console -> Project settings -> Service accounts ->\n' +
      '"Generate new private key". Save it OUTSIDE the repo, then:\n\n' +
      '  export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json\n' +
      '  node scripts/import-unit1.mjs\n'
  )
  process.exit(1)
}

/**
 * Firestore retries auth failures with backoff, so a rejected credential looks
 * exactly like a slow network: no output, no error, forever. Fail loudly.
 */
async function withTimeout(promise, what, ms = 20000) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                `${what} timed out after ${ms / 1000}s.\n` +
                  'This is almost always the credential being refused rather than a\n' +
                  'slow connection. Check that this prints a few hundred characters:\n' +
                  '  firebase auth:print-access-token --project phs-al-hub | wc -c'
              )
            ),
          ms
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

initializeApp({ credential: makeCredential(), projectId: PROJECT_ID })
const db = getFirestore()
const stamps = {
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
}

const md = (...lines) => lines.join('\n')

const MODULE = {
  title: 'Unit 1 — Foundations',
  description:
    'Week 1. What this course costs you, what leadership actually is, and the two things this class ships all semester: the podcast and the Open Problems Board.',
  order: 0,
}

const ITEMS = [
  {
    id: 'l1-1-course-overview',
    type: 'lesson',
    title: 'L1.1 — Course Overview & Expectations',
    order: 0,
    body: md(
      '**Week 1, Lesson 1 · 90-minute block · Ungraded — syllabus contract collected**',
      '',
      '> What am I actually signing up for, and what will it cost me?',
      '',
      '## The rhythm',
      '',
      'Three classroom days, two work days, one STRIVE period on Thursday.',
      '',
      '## The 60 hours',
      '',
      'Sixty internship hours total, from three channels:',
      '',
      '| Channel | Limit |',
      '| --- | --- |',
      '| In-block work | — |',
      '| NFHS modules | **capped at 10 hours** |',
      '| After-school / event hours | **minimum 12** |',
      '',
      'All 60 are due **Week 16**. This is a pass-fail gate on your internship',
      'grade, and hours logged after the deadline do not count.',
      '',
      'Read that middle row twice. **You cannot pass this course on in-block',
      'hours alone.** At least twelve hours have to happen after the rest of the',
      'school has gone home.',
      '',
      '## The credential stack',
      '',
      '- NFHS Level 1 Coach',
      '- CPR, First Aid, and AED through ProTrainings',
      '- Life-Ready Leadership micro-credentials toward the certificate',
      '',
      '## Professionalism',
      '',
      'On a work day you represent this course to every coach and administrator',
      'you work under. Not yourself. The course. Confidentiality about what you',
      'see and hear in athletic spaces is a condition of your placement.',
      '',
      '## You should be able to answer these without notes',
      '',
      '1. How many hours do I owe, and how many of those cannot come from class time?',
      '2. What is the deadline, and what happens if I miss it?',
      '3. Name three things you will produce this semester with your name on it.',
      '',
      '## Before the next block',
      '',
      '- Set up your NFHS Learn and LiM Online accounts',
      '- Know what to wear and what to bring on work days'
    ),
  },
  {
    id: 'l1-2-seven-habits',
    type: 'lesson',
    title: 'L1.2 — The 7 Habits Through a Leadership Lens',
    order: 1,
    body: md(
      '**Week 1, Lesson 2 · 90-minute block · Ungraded — clips archived to the class drive**',
      '',
      '> If nobody could hear you say the habit, could anyone tell you were living it?',
      '',
      '## What you do in this block',
      '',
      'You rotate through scenario stations with your crew and film 20 to 30',
      'seconds at each one. Clips upload to the station folder before the whistle.',
      '',
      '## Filming rules',
      '',
      '1. Do not say the habit\'s name on camera.',
      '2. No narration. No captions. No explaining.',
      '3. Everyone appears on camera at least once across the rotation.',
      '4. One take per station. No re-shoots. No editing.',
      '',
      'The best clip per habit goes to the archive and gets reused when the media',
      'crew builds the semester recap.',
      '',
      '## Exit standard',
      '',
      'Take any habit, without warning, and name a specific observable behavior',
      'that demonstrates it inside a Palmetto athletic setting.'
    ),
  },
  {
    id: 'l1-3-what-is-athletic-leadership',
    type: 'lesson',
    title: 'L1.3 — What Is Athletic Leadership?',
    order: 2,
    body: md(
      '**Week 1, Lesson 3 · 90-minute block · Ungraded — one-sentence definition collected**',
      '',
      '> Who actually owns the things that go wrong?',
      '',
      '## What you do in this block',
      '',
      'You map who owns what inside Palmetto athletics, then test that map against',
      'real situations and find where it breaks.',
      '',
      '## The Open Problems Board',
      '',
      'This block starts the board, and it does not get erased. Every problem this',
      'class finds in the program between now and December goes up there. In Week',
      '16 you choose a capstone problem, and it has to be a real problem in this',
      'program. Some of you will walk up to that board and take one.',
      '',
      'Two standing rules for the board:',
      '',
      '- **Systems, not people.** A gap in a system goes up. A complaint about a',
      '  named adult does not.',
      '- **A finding names a consequence.** If you cannot say one specific thing',
      '  that will go wrong because of the gap, it is a complaint, not a finding.',
      '',
      '## Exit standard',
      '',
      '1. Name the five domains an athletic department leads',
      '2. State the difference between authority and leadership in your own words',
      '3. Name one thing at Palmetto that nobody clearly owns'
    ),
  },
  {
    id: 'l1-4-leadership-styles',
    type: 'lesson',
    title: 'L1.4 — Leadership Styles in Athletics',
    order: 3,
    body: md(
      '**Week 1, Lesson 4 · 90-minute block · MINOR GRADE — Leadership Self-Assessment**',
      '',
      '> What would the wrong style cost here?',
      '',
      '## What you do in this block',
      '',
      'Your crew draws a scenario and a leadership style — blind, no trading —',
      'performs the first 60 seconds of the response in that style, and then',
      'delivers a verdict: did the style fit, and if not, at what exact moment',
      'would you switch, and to what.',
      '',
      'You will use this frame again in the coach interviews, in game-day',
      'operations, and in the capstone. It is not a Week 1 topic.',
      '',
      '## Leadership Self-Assessment (graded)',
      '',
      'You will name your default style, give **two real behaviors from your own',
      'athletic experience** that prove it, name the situation type that exposes',
      'your weakest style, and write one sentence on what your default style',
      'costs you.',
      '',
      'The scoring standard, so nobody is surprised:',
      '',
      '| Score | What it looks like |',
      '| --- | --- |',
      '| 4 | A real weakness with a real example. The cost is specific, and you are not comfortable writing it. |',
      '| 3 | Honest and specific in most of it. Behaviors are real but generic. |',
      '| 2 | Self-flattering. The "weakness" is a strength in disguise. |',
      '| 1 | Poster language throughout. Could have been written before the lesson. |',
      '',
      'Honesty and specificity beat self-flattery. If your weakness is that you',
      'care too much, or that you are too hard on yourself, or that you take on',
      'too much, you are writing a two.',
      '',
      'This document seeds the Philosophy Launch, due end of week. It is not a',
      'one-off.'
    ),
  },
  {
    id: 'l1-5-podcast-launch',
    type: 'lesson',
    title: 'L1.5 — Launch the Athletics Podcast',
    order: 4,
    body: md(
      '**Week 1, Lesson 5 · 90-minute block · Ungraded today — the podcast grade begins next week**',
      '',
      '> Can this group make a decision it has to live with?',
      '',
      '## The mandate',
      '',
      'This class produces an athletics podcast for the whole semester. Athletics',
      'updates, athlete interviews, coach interviews. Not Coach Wardlaw. You.',
      '',
      'The audience is parents, students, coaches, and anybody who searches for',
      'Palmetto athletics. This is public, and it has your names on it.',
      '',
      '## The five roles',
      '',
      'Host · Interviewer · Producer · Audio editor · Promotion',
      '',
      'You will write the standard operating card for one of these in this block.',
      '',
      'Everybody fills every role by Week 14. You do not get to be the media kid.',
      'You do not get to hide behind the board. Everybody hosts. Everybody edits.',
      '',
      '## Media Ethics Floor',
      '',
      'Standing rules. Not a Week 1 handout.',
      '',
      '1. **Consent.** Every guest knows they are being recorded, what it is for,',
      '   and where it will be published. Every time. No exceptions for people you',
      '   know well.',
      '2. **Fair representation.** You do not cut somebody to make them sound worse',
      '   than they were, or use a clip out of the context that made it make sense.',
      '3. **Nothing from locker rooms.** No audio, no video, no photos. Ever. This',
      '   is not a judgment call.',
      '4. **Ask before, not after.** If you are not sure whether something should be',
      '   published, it does not get published until you ask. The answer is',
      '   sometimes yes. The answer is always yes to asking.',
      '',
      'Every episode this class publishes carries the school\'s name and yours.',
      '',
      '## The floor vote',
      '',
      'The class ratifies five things by vote, chaired by the producer group:',
      'show name, intro format and length, segment structure, target episode',
      'length, and release cadence.',
      '',
      '**Twenty minutes. If all five are not ratified by the buzzer, Coach Wardlaw',
      'picks, and you live with it until December.** The clock will not be',
      'extended.',
      '',
      '## By the end of the block',
      '',
      '1. A show name, format, and release cadence exist, written where the class can see them',
      '2. You know your Week 1 role',
      '3. You can name what your role owes the role after it',
      '4. The Episode 1 date is public'
    ),
  },
]

async function importUnit1() {
  console.log(`Connecting to ${PROJECT_ID}…`)
  const settings = await withTimeout(
    db.doc('settings/config').get(),
    'Reading settings/config'
  )
  const courseId = settings.exists ? settings.data().activeCourseId : null
  if (!courseId) {
    throw new Error(
      'settings/config has no activeCourseId. Run `npm run seed` first, or set it in Firestore.'
    )
  }
  console.log(`Importing Unit 1 into courses/${courseId}`)

  const moduleRef = db.doc(`courses/${courseId}/modules/${MODULE_ID}`)
  await moduleRef.set({ ...MODULE, published: false, ...stamps }, { merge: true })
  console.log(`  module ${MODULE_ID}: ${MODULE.title}`)

  for (const item of ITEMS) {
    const { id, ...data } = item
    await moduleRef
      .collection('items')
      .doc(id)
      .set({ ...data, published: false, ...stamps }, { merge: true })
    console.log(`    item ${id}: ${item.title}`)
  }

  console.log(
    `\nDone. ${ITEMS.length} items written as drafts.\n` +
      'Review at /hub/teacher/content, then publish the module and each item.'
  )
}

// Firestore holds gRPC connections open, so node will not exit on its own once
// the writes are done. Exit explicitly rather than leaving a finished script
// looking like a hung one.
importUnit1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`\n${err.message || err}`)
    process.exit(1)
  })
