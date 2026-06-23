# AL Hub — Roadmap & LMS-inspired feature plan

Extends the build spec (`AL-Hub-Build-Spec.md`) with features borrowed from
Frappe LMS — built **natively** into the React/Firebase hub, keeping the
seamless school-Google sign-in + "Google Classroom is a dumb dropbox"
operating model. We adopt the *ideas and data models*, not the Frappe stack.

Guiding rule (unchanged): native-on-hub only for what Google Classroom can't do
well. Traditional file/quiz turn-in that GC handles stays in GC via links.

---

## Phase status

| Phase | Scope | Status |
|---|---|---|
| 1 — Spine | Auth, roles, student landing, internship logging (direct-approve stub), teacher todos/roster, rules, seed | ✅ done |
| 2 — Content | CMS for courses/modules/items, markdown rendering, Submit-in-Classroom **+ progress tracking** | next |
| 2.5 — Quizzes | Native auto-graded quizzes | new (LMS-inspired) |
| 3 — Internship | Supervisor magic-link sign-off (email) + accurate totals + **completion certificates (PDF)** | planned |
| 4 — Native submissions | submissions + rubrics + Storage | optional |
| 5 — Engagement | Badges / gamification | optional polish |

---

## Phase 2 add-on — Lesson progress tracking

Borrowed from Frappe's `lms course progress` + `lms video watch duration`.
Gives per-lesson checkmarks and a course % complete on the dashboard — high
perceived legitimacy, low effort. Builds on the module/item pages already in
Phase 2.

```
lessonProgress/{uid}_{itemId}        // deterministic id = `${uid}_${itemId}`
  studentUid: string
  courseId: string
  moduleId: string
  itemId: string
  status: 'viewed' | 'complete'
  completedAt?: Timestamp
  // createdAt, updatedAt
```

- Student marks an item complete (or auto-mark on open for `lesson`/`resource`).
- Dashboard + module page show `n/total complete` and a progress bar.
- Rules: a student may read/write only their own `lessonProgress` docs
  (`studentUid == request.auth.uid`); teachers may read all (roster completion).
- No composite index needed — query by `studentUid` (and filter client-side).

---

## Phase 2.5 — Native quizzes (the biggest "real LMS" win)

Borrowed from Frappe's `lms quiz` / `lms question` / `lms quiz submission`.
Auto-graded, instant feedback, never leaves the hub. This is exactly the
"native for what GC can't do well" case.

```
quizzes/{quizId}
  title: string
  description: string
  courseId?: string
  moduleItemRef?: string          // optional: attach to an item
  shuffleQuestions: boolean
  maxAttempts: number             // 0 = unlimited
  passingPct?: number             // e.g. 70
  published: boolean
  order: number
  createdBy: string               // teacher uid
  // createdAt, updatedAt

quizzes/{quizId}/questions/{questionId}
  type: 'single' | 'multiple' | 'truefalse' | 'short'
  prompt: string                  // markdown
  options: { id: string, text: string, correct: boolean }[]   // for choice types
  answerKey?: string              // for 'short' (exact/normalized match)
  points: number
  order: number
  explanation?: string            // shown after submit

quizSubmissions/{submissionId}
  quizId: string
  studentUid: string
  attempt: number                 // 1-based
  answers: { questionId: string, selected: string[], text?: string }[]
  score: number                   // auto-computed
  maxScore: number
  pct: number
  passed?: boolean
  submittedAt: Timestamp
  // createdAt, updatedAt
```

Grading: choice/truefalse graded client-side is insecure (answer key would ship
to the client). Two options:
- **Recommended:** a callable Cloud Function `gradeQuiz` that reads the question
  answer keys server-side, computes the score, and writes the submission. Keeps
  answer keys out of the client bundle.
- Simpler interim: store answer keys in a teacher-only-readable subcollection and
  grade in a Function. Either way, **answer keys must never be client-readable.**

Rules:
- `quizzes` + `questions`: `published` quizzes readable by allowed users **but**
  the `correct`/`answerKey` fields must not reach students → keep keys in a
  separate teacher-only doc, or strip them in the Function and never store keys
  in the student-readable question doc. Teachers write.
- `quizSubmissions`: student creates/reads own; score written only by the
  `gradeQuiz` Function (no client write to `score`/`passed`).

UI: `QuizPage` (take), `QuizResult` (review with explanations), teacher
`QuizEditor` (CRUD questions) + submissions list. Mirrors Frappe's
`QuizPage.vue` / `QuizForm.vue` / `QuizSubmissionList.vue`.

---

## Phase 3 add-on — Completion certificates (cheap, high-impact)

Borrowed from Frappe's `lms certificate`. The repo already depends on
`@react-pdf/renderer` (used by `src/pdf/ApplicationPdf.tsx`), so branded PDF
certificates are nearly free.

```
certificates/{uid}_{courseId}
  studentUid: string
  studentName: string
  courseId: string
  courseTitle: string
  issuedAt: Timestamp
  issuedBy: string                // teacher uid (or 'system' if auto)
  // optional: serial for verification
  serial?: string
```

- Issue when course completion criteria are met (all modules complete +
  internship hours met, teacher's choice) — auto via Function or teacher button.
- Render with `@react-pdf/renderer` reusing the brand tokens (Race Sport,
  Palmetto red, "BE AN A"). Student downloads from their dashboard / profile.
- Rules: student reads own; teacher reads all; created by teacher/Function only.

---

## Phase 5 (optional) — Badges / gamification

Borrowed from Frappe's `lms badge` / `lms badge assignment`. Fun for HS students.

```
badges/{badgeId}
  title: string
  description: string
  icon: string                    // lucide icon name or emoji
  criteria: string                // human-readable; awarding is manual or rule-based
  published: boolean

badgeAwards/{uid}_{badgeId}
  studentUid: string
  badgeId: string
  awardedAt: Timestamp
  awardedBy: string
```

Display a badge shelf on the student dashboard / profile.

---

## Explicitly NOT adopting from Frappe LMS

Out of scope for a single high-school course: batches/cohorts, payments &
coupons, the job board, live-class (Zoom/Meet) scheduling, programs,
SCORM packages, public course marketplace, reviews/ratings. Revisit only if the
program scales to multiple cohorts.

---

## Stack note

Frappe LMS is Python/Frappe/MariaDB + Vue — architecturally incompatible with
this Vite/React/Firebase app. It is used here purely as a **reference
implementation** for features and data models, not as a dependency.
