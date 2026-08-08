// ─────────────────────────────────────────────────────────────
// Seed the AL Hub with one course + modules/items + a couple of to-dos,
// so the dashboards aren't empty on first run.
//
// Usage:
//   1. Firebase console → Project settings → Service accounts →
//      "Generate new private key". Save it OUTSIDE the repo (or it matches
//      the *serviceAccount*.json .gitignore entry).
//   2. export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json
//   3. npm run seed
//
// Idempotent: uses fixed document ids, so re-running overwrites the same
// seed docs rather than duplicating them. It does NOT touch users or
// internshipLogs.
// ─────────────────────────────────────────────────────────────
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const PROJECT_ID = 'phs-al-hub'

// Accept either GOOGLE_APPLICATION_CREDENTIALS (ADC) or an explicit
// SERVICE_ACCOUNT path.
function makeCredential() {
  const explicit = process.env.SERVICE_ACCOUNT
  if (explicit) {
    return cert(JSON.parse(readFileSync(explicit, 'utf8')))
  }
  return applicationDefault()
}

initializeApp({ credential: makeCredential(), projectId: PROJECT_ID })
const db = getFirestore()

const COURSE_ID = 'al-2026'
const stamps = { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }

// Helper: a date N days from "now" at noon, as a Firestore Timestamp.
function inDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(12, 0, 0, 0)
  return Timestamp.fromDate(d)
}

async function seed() {
  // settings/config (singleton)
  await db.doc('settings/config').set(
    {
      activeCourseId: COURSE_ID,
      internshipHoursRequired: 30,
      termLabel: '2026-27',
      ...stamps,
    },
    { merge: true }
  )

  // course
  await db.doc(`courses/${COURSE_ID}`).set(
    {
      title: 'Athletic Leadership & Operations',
      description:
        'Build the leadership, communication, and operations skills behind a high-performing athletic program.',
      order: 0,
      published: true,
      ...stamps,
    },
    { merge: true }
  )

  // modules + items
  const modules = [
    {
      id: 'm1-foundations',
      title: 'Foundations of Leadership',
      description: 'Core principles: character, accountability, and the "Be an A" standard.',
      order: 0,
      items: [
        {
          id: 'i1-welcome',
          type: 'lesson',
          // Item bodies are markdown (GFM). This one exercises the common
          // elements so the rendering is visible straight after seeding.
          body: [
            '## Welcome to Athletic Leadership',
            '',
            'This course runs through the Hub — modules, to-dos, and your',
            'internship hours all live here.',
            '',
            '### What you owe each week',
            '',
            '- Read the assigned module items and **mark them complete**',
            '- Log any internship hours you worked',
            '- Turn in written work through the Classroom link on the item',
            '',
            '| Requirement | Amount |',
            '| --- | --- |',
            '| Internship hours | 30 |',
            '| Reflections | 4 |',
            '',
            '> Be an A. Effort is the part nobody can grade you down on.',
          ].join('\n'),
          title: 'Welcome & Course Overview',
          order: 0,
        },
        {
          id: 'i2-leadership-styles',
          type: 'resource',
          title: 'Leadership Styles (Article)',
          body: 'Skim this short read, then we will discuss in class.',
          order: 1,
          resourceUrl: 'https://www.mindtools.com/leadership-styles',
        },
        {
          id: 'i3-reflection',
          type: 'assignment',
          title: 'Reflection #1: Your Leadership Story',
          body: 'Write a one-page reflection. Submit in Google Classroom.',
          order: 2,
          gcSubmitUrl: 'https://classroom.google.com/',
          dueDate: inDays(7),
        },
      ],
    },
    {
      id: 'm2-communication',
      title: 'Communication & Team Culture',
      description: 'How to communicate under pressure and build a culture people want to join.',
      order: 1,
      items: [
        {
          id: 'i1-feedback',
          type: 'lesson',
          title: 'Giving & Receiving Feedback',
          body: 'Notes on the feedback loop and practicing hard conversations.',
          order: 0,
        },
        {
          id: 'i2-film',
          type: 'video',
          title: 'Film: Culture in Action',
          body: 'Watch before our next session.',
          order: 1,
          resourceUrl: 'https://www.youtube.com/',
        },
      ],
    },
    {
      id: 'm3-operations',
      title: 'Event & Program Operations',
      description: 'The behind-the-scenes work: logistics, scheduling, and game-day operations.',
      order: 2,
      items: [
        {
          id: 'i1-gameday',
          type: 'resource',
          title: 'Game-Day Operations Checklist',
          body: 'Reference checklist for running an event start to finish.',
          order: 0,
        },
      ],
    },
  ]

  for (const m of modules) {
    const mref = db.doc(`courses/${COURSE_ID}/modules/${m.id}`)
    await mref.set(
      {
        title: m.title,
        description: m.description,
        order: m.order,
        published: true,
        ...stamps,
      },
      { merge: true }
    )
    for (const it of m.items) {
      await mref.collection('items').doc(it.id).set(
        {
          type: it.type,
          title: it.title,
          body: it.body ?? '',
          order: it.order,
          published: true,
          ...(it.resourceUrl ? { resourceUrl: it.resourceUrl } : {}),
          ...(it.gcSubmitUrl ? { gcSubmitUrl: it.gcSubmitUrl } : {}),
          ...(it.dueDate ? { dueDate: it.dueDate } : {}),
          ...stamps,
        },
        { merge: true }
      )
    }
  }

  // to-dos (surfaced on the student "This Week")
  await db.doc('todos/seed-reflection').set(
    {
      title: 'Submit Reflection #1',
      description: 'Your leadership story — one page, submitted in Google Classroom.',
      dueDate: inDays(7),
      courseId: COURSE_ID,
      moduleItemRef: `courses/${COURSE_ID}/modules/m1-foundations/items/i3-reflection`,
      gcSubmitUrl: 'https://classroom.google.com/',
      audience: 'all',
      published: true,
      order: 0,
      createdBy: 'seed',
      ...stamps,
    },
    { merge: true }
  )
  await db.doc('todos/seed-log-hours').set(
    {
      title: 'Log this week’s internship hours',
      description: 'Logged hours need teacher approval before they count toward your total.',
      dueDate: inDays(5),
      audience: 'all',
      published: true,
      order: 1,
      createdBy: 'seed',
      ...stamps,
    },
    { merge: true }
  )

  console.log('✓ Seed complete for project', PROJECT_ID)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
