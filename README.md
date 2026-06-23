# Palmetto Athletic Leadership — Site + Course Hub

A Vite + React + TypeScript + Tailwind app, deployed on Vercel.

It contains **two independent areas**:

1. **Public marketing site** (`/`, `/about`, `/salt`, `/careers`, `/apply`,
   `/instructor`, `/admin`) — unchanged. The application form + admin review use
   Google Identity Services and a Google Apps Script backend. **Not touched by
   the Hub.**
2. **Course Hub** (`/hub/*`) — an authenticated course hub for the Athletic
   Leadership & Operations course, backed by **Firebase** (Auth + Firestore +
   callable Cloud Functions). Code-split so Firebase only loads for `/hub`
   visitors.

---

## Quick start (local dev)

```bash
npm install
cp .env.example .env.local      # then fill in the Firebase web config
npm run dev
```

Visit `http://localhost:5173/hub/login`.

> The Hub needs the **ensureProfile** Cloud Function deployed (or emulated) to
> assign roles. Without it, a signed-in user has no role and is treated as a
> student, and Firestore reads will be denied by the security rules. See
> **Deploy** below.

---

## Environment variables

### Frontend (Vite) — `.env.local`, and Vercel project env

| Var | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web config (not secret) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config |
| `VITE_FIREBASE_APP_ID` | Firebase web config |
| `VITE_ALLOWED_AUTH_DOMAINS` | Comma-separated allowed sign-in domains (UX check only). e.g. `apps.anderson1.org` |
| `VITE_FIREBASE_FUNCTIONS_REGION` | Optional, defaults to `us-central1` |

See [.env.example](.env.example). Firebase web config is **not secret** and is
meant to ship in the client bundle — the real boundary is the Cloud Function +
Firestore rules.

### Cloud Functions — `functions/.env` (NOT committed)

| Var | Purpose |
|---|---|
| `ALLOWED_AUTH_DOMAINS` | Comma-separated domains allowed to use the Hub. The real domain gate. |
| `TEACHER_EMAILS` | Comma-separated staff emails that get the `teacher` role. |

See [functions/.env.example](functions/.env.example). Current values:
`ALLOWED_AUTH_DOMAINS=apps.anderson1.org`,
`TEACHER_EMAILS=wardlawj@apps.anderson1.org`.

---

## Firebase project setup (one-time)

Project: **`phs-al-hub`** (dedicated, for clean PII isolation — not shared with
other projects).

1. **Auth** → enable the **Google** sign-in provider, set a support email.
2. **Firestore** → create database in **Production mode** (region `nam5`/us-central or us-east).
3. **Web app** → register a web app; copy the config into `.env.local` / Vercel.
4. **Authorized domains** → Auth → Settings → **Authorized domains**: add the
   production domain(s) the Hub is served from (e.g. `phsal.org` and the
   `*.vercel.app` preview domain). `localhost` is allowed by default. Sign-in
   popups fail on origins not in this list.
5. **Billing** → upgrade to the **Blaze** plan (required for Cloud Functions;
   free tier covers this usage).

> **Workspace consent:** the first time a student signs in to this new OAuth
> app, the `apps.anderson1.org` Workspace may require admin approval. If users
> hit an "admin needs to approve this app" wall, a Workspace admin must allow it.

---

## Deploy

### Frontend → Vercel
- Set all `VITE_*` vars in the Vercel project's Environment Variables.
- Vercel builds with `npm run build`. The SPA rewrite in
  [vercel.json](vercel.json) makes client routing (incl. `/hub/*`) work.

### Auth / Firestore / Functions → Firebase
```bash
# one-time
firebase login
firebase use phs-al-hub          # already set in .firebaserc

# security rules
firebase deploy --only firestore:rules

# cloud functions (reads functions/.env)
cd functions && npm install && cd ..
firebase deploy --only functions
```

### Seed sample data (so dashboards aren't empty)
```bash
# Project settings → Service accounts → Generate new private key.
# Save OUTSIDE the repo (matches the *serviceAccount*.json .gitignore rule).
export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/serviceAccount.json
npm run seed
```
Seeds `settings/config`, one course (`al-2026`) with three modules + items, and
two to-dos. Idempotent (fixed doc ids). Does not touch users or internship logs.

---

## Auth & roles

- Google Sign-In via Firebase `GoogleAuthProvider`.
- On first sign-in the client calls the **`ensureProfile`** callable, which:
  verifies the caller's email domain is allowed, sets a `role` custom claim
  (`teacher` if the email is in `TEACHER_EMAILS`, else `student`), and upserts
  `users/{uid}`. The client then force-refreshes its ID token to pick up the claim.
- Route guards: unauthenticated → `/hub/login`; students → `/hub` (blocked from
  `/hub/teacher/*`); teachers → may access both, default landing `/hub/teacher`.
- The `role` claim is set **only** by `ensureProfile` (admin SDK). There is no
  client path to set a claim.

## Security model (see [firestore.rules](firestore.rules))

- All access requires an authenticated, allowed-domain user.
- `users/{uid}`: read/write own only; cannot change own role; teachers read all.
- `settings`, `courses/**`, `todos`: read by any allowed user; write by teachers.
- `internshipLogs`: students create + read + edit (while `pending`) their own;
  teachers read all and set `teacher_approved`/`rejected`. `supervisor_approved`
  is reachable **only** via a Cloud Function (Phase 3) — no client write path.

---

## Phasing

| Phase | Scope | Status |
|---|---|---|
| **1 — Spine** | Firebase, auth + roles, guards, student landing, internship logging (teacher direct-approve stub), teacher todos + roster, rules, seed, deploy | ✅ this build |
| 2 — Content | Full CMS for courses/modules/items, markdown rendering, "Submit in Classroom", + lesson progress tracking | pending sign-off |
| 2.5 — Quizzes | Native auto-graded quizzes (LMS-inspired) | planned |
| 3 — Internship | Supervisor magic-link sign-off (email) + accurate totals + completion certificates (PDF) | pending |
| 4 — Native submissions | submissions + rubrics + Storage | optional |
| 5 — Engagement | Badges / gamification | optional |

See [docs/ROADMAP.md](docs/ROADMAP.md) for the extended plan + Firestore schemas
for the LMS-inspired features (progress, quizzes, certificates, badges).

`/hub/teacher/content` (Phase 2) and `/hub/teacher/submissions` (Phase 4) are
shown as upcoming in the teacher dashboard and not yet wired.

---

## Project scripts

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run seed` | Seed Firestore sample data (needs service-account creds) |
| `npm --prefix functions run build` | Compile Cloud Functions |
| `npm --prefix functions run deploy` | Deploy Cloud Functions |
