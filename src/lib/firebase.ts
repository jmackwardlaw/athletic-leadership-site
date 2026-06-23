// ─────────────────────────────────────────────────────────────
// Firebase initialization for the AL Hub.
//
// This is fully isolated from the public marketing site and the
// existing /admin + /apply Google Identity Services flow — those keep
// using raw GIS + the Apps Script backend and are untouched. The Hub
// uses Firebase Auth + Firestore + callable Cloud Functions only.
//
// All config comes from Vite env vars (VITE_FIREBASE_*). The web config
// is not secret; real secrets live in Cloud Functions config.
// ─────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Surface a clear error in dev if env vars are missing, rather than a
// cryptic Firebase failure later.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // eslint-disable-next-line no-console
  console.error(
    '[AL Hub] Missing Firebase env vars. Copy .env.example to .env.local and fill in VITE_FIREBASE_*.'
  )
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
// ignoreUndefinedProperties lets us pass optional fields as `undefined`
// (e.g. a to-do with no gcSubmitUrl) without Firestore throwing.
export const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
})

const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
export const functions = getFunctions(firebaseApp, region)

// Google provider used for Hub sign-in. We set the `hd` hint to the first
// allowed domain for a smoother picker, but the real enforcement happens
// in ensureProfile + Firestore rules — `hd` alone is not a boundary.
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})
