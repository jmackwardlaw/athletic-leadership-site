// ─────────────────────────────────────────────────────────────
// Firestore access helpers for the AL Hub.
//
// Queries deliberately use single-field filters and sort/merge in the
// client, so Phase 1 needs no composite indexes. Data volume is one
// class, so this is cheap and keeps deploys simple.
// ─────────────────────────────────────────────────────────────
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'
import type {
  Course,
  InternshipLog,
  Item,
  Module,
  SettingsConfig,
  Todo,
  UserProfile,
  WithId,
} from './types'

function withId<T>(snap: QueryDocumentSnapshot<DocumentData>): WithId<T> {
  return { id: snap.id, ...(snap.data() as T) }
}

// ── Settings ────────────────────────────────────────────────────────────
export async function getSettings(): Promise<SettingsConfig | null> {
  const snap = await getDoc(doc(db, 'settings', 'config'))
  return snap.exists() ? (snap.data() as SettingsConfig) : null
}

// ── Users ───────────────────────────────────────────────────────────────
export async function getUser(uid: string): Promise<WithId<UserProfile> | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...(snap.data() as UserProfile) } : null
}

/** Teacher-only: all students, for the roster. */
export async function getStudents(): Promise<WithId<UserProfile>[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => withId<UserProfile>(d))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

// ── Courses / modules / items ─────────────────────────────────────────────
export async function getCourse(courseId: string): Promise<WithId<Course> | null> {
  const snap = await getDoc(doc(db, 'courses', courseId))
  return snap.exists() ? { id: snap.id, ...(snap.data() as Course) } : null
}

export async function getPublishedModules(courseId: string): Promise<WithId<Module>[]> {
  const q = query(
    collection(db, 'courses', courseId, 'modules'),
    where('published', '==', true)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => withId<Module>(d)).sort((a, b) => a.order - b.order)
}

export async function getModule(
  courseId: string,
  moduleId: string
): Promise<WithId<Module> | null> {
  const snap = await getDoc(doc(db, 'courses', courseId, 'modules', moduleId))
  return snap.exists() ? { id: snap.id, ...(snap.data() as Module) } : null
}

export async function getPublishedItems(
  courseId: string,
  moduleId: string
): Promise<WithId<Item>[]> {
  const q = query(
    collection(db, 'courses', courseId, 'modules', moduleId, 'items'),
    where('published', '==', true)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => withId<Item>(d)).sort((a, b) => a.order - b.order)
}

// ── Todos ─────────────────────────────────────────────────────────────────
/**
 * Published todos visible to a student: audience 'all' OR uid in audience[].
 * Sorted by dueDate (soonest first, undated last) then order.
 */
export async function getTodosForStudent(uid: string): Promise<WithId<Todo>[]> {
  const q = query(collection(db, 'todos'), where('published', '==', true))
  const snap = await getDocs(q)
  const all = snap.docs.map((d) => withId<Todo>(d))
  const visible = all.filter((t) =>
    t.audience === 'all' ? true : Array.isArray(t.audience) && t.audience.includes(uid)
  )
  return sortTodos(visible)
}

/** Teacher view: every todo, published or not. */
export async function getAllTodos(): Promise<WithId<Todo>[]> {
  const snap = await getDocs(collection(db, 'todos'))
  return sortTodos(snap.docs.map((d) => withId<Todo>(d)))
}

function sortTodos(todos: WithId<Todo>[]): WithId<Todo>[] {
  return [...todos].sort((a, b) => {
    const at = a.dueDate ? a.dueDate.toMillis() : Number.POSITIVE_INFINITY
    const bt = b.dueDate ? b.dueDate.toMillis() : Number.POSITIVE_INFINITY
    if (at !== bt) return at - bt
    return (a.order ?? 0) - (b.order ?? 0)
  })
}

export async function createTodo(
  data: Omit<Todo, never>
): Promise<string> {
  const ref = await addDoc(collection(db, 'todos'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateTodo(id: string, data: Partial<Todo>): Promise<void> {
  await updateDoc(doc(db, 'todos', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteTodo(id: string): Promise<void> {
  await deleteDoc(doc(db, 'todos', id))
}

// ── Internship logs ─────────────────────────────────────────────────────────
export async function getStudentLogs(uid: string): Promise<WithId<InternshipLog>[]> {
  const q = query(collection(db, 'internshipLogs'), where('studentUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => withId<InternshipLog>(d))
    .sort((a, b) => (b.date?.toMillis() ?? 0) - (a.date?.toMillis() ?? 0))
}

/** Teacher approval queue: pending + supervisor_approved logs. */
export async function getApprovalQueue(): Promise<WithId<InternshipLog>[]> {
  const q = query(
    collection(db, 'internshipLogs'),
    where('status', 'in', ['pending', 'supervisor_approved'])
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => withId<InternshipLog>(d))
    .sort((a, b) => (a.date?.toMillis() ?? 0) - (b.date?.toMillis() ?? 0))
}

/** Teacher view of every log (for roster totals). */
export async function getAllLogs(): Promise<WithId<InternshipLog>[]> {
  const snap = await getDocs(collection(db, 'internshipLogs'))
  return snap.docs.map((d) => withId<InternshipLog>(d))
}

export async function createInternshipLog(
  data: Omit<InternshipLog, 'status' | 'supervisorSignoff' | 'teacherReview'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'internshipLogs'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/** Student edit, only allowed by rules while status === 'pending'. */
export async function updateInternshipLog(
  id: string,
  data: Partial<InternshipLog>
): Promise<void> {
  await updateDoc(doc(db, 'internshipLogs', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/** Phase-1 stub: teacher directly approves (counts toward total). */
export async function teacherApproveLog(
  id: string,
  teacherUid: string,
  note?: string
): Promise<void> {
  await updateDoc(doc(db, 'internshipLogs', id), {
    status: 'teacher_approved',
    teacherReview: {
      reviewedBy: teacherUid,
      reviewedAt: serverTimestamp(),
      ...(note ? { note } : {}),
    },
    updatedAt: serverTimestamp(),
  })
}

export async function teacherRejectLog(
  id: string,
  teacherUid: string,
  note?: string
): Promise<void> {
  await updateDoc(doc(db, 'internshipLogs', id), {
    status: 'rejected',
    teacherReview: {
      reviewedBy: teacherUid,
      reviewedAt: serverTimestamp(),
      ...(note ? { note } : {}),
    },
    updatedAt: serverTimestamp(),
  })
}

/** Sum of teacher-approved hours from a set of logs. */
export function approvedHours(logs: InternshipLog[]): number {
  return logs
    .filter((l) => l.status === 'teacher_approved')
    .reduce((sum, l) => sum + (Number(l.hours) || 0), 0)
}

/** Upsert the caller's own profile (used as a client-side fallback so the
 * roster isn't empty even before a teacher opens it; ensureProfile remains
 * the authority for role). Students may only write their own doc per rules. */
export async function touchOwnProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    { ...data, lastLogin: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true }
  )
}
