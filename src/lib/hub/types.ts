// ─────────────────────────────────────────────────────────────
// Firestore data model for the AL Hub (spec §5).
// Field names are authoritative. All timestamps are Firestore Timestamp.
// ─────────────────────────────────────────────────────────────
import type { Timestamp } from 'firebase/firestore'

export type Role = 'student' | 'teacher'

// users/{uid}
export interface UserProfile {
  email: string
  displayName: string
  photoURL: string
  role: Role // mirror of custom claim, for queries/display
  lastLogin: Timestamp | null
  // student-only optional profile:
  gradeLevel?: number
  internshipSite?: string
  internshipSupervisorName?: string
  internshipSupervisorEmail?: string
  // Credential counts, maintained by the teacher on the roster. Absent = 0.
  nfhsModulesComplete?: number
  lrlCredentialsEarned?: number
}

// settings/config (singleton)
export interface SettingsConfig {
  activeCourseId: string
  internshipHoursRequired: number // e.g. 60
  termLabel: string // e.g. "2026-27"
  // Denominators for the credential rings. Absent = ring hidden.
  nfhsModulesRequired?: number
  lrlCredentialsRequired?: number
}

// courses/{courseId}
export interface Course {
  title: string
  description: string
  order: number
  published: boolean
}

// courses/{courseId}/modules/{moduleId}
export interface Module {
  title: string
  description: string
  order: number
  published: boolean
}

export type ItemType = 'lesson' | 'resource' | 'link' | 'video' | 'file' | 'assignment'

// courses/{courseId}/modules/{moduleId}/items/{itemId}
export interface Item {
  type: ItemType
  title: string
  body: string // markdown (rendered client-side)
  order: number
  published: boolean
  resourceUrl?: string // for link/video/file types — opens in a new tab
  embedUrl?: string // rendered inline in an iframe (Canva, Slides, YouTube…)
  gcSubmitUrl?: string // deep-link to the GC assignment ("Submit in Classroom →")
  dueDate?: Timestamp
}

// lessonProgress/{uid}_{itemId} — per-student, per-item completion.
// The id is deterministic (see progressId) so a student has exactly one row
// per item and re-marking is an idempotent overwrite, not a duplicate.
export interface LessonProgress {
  studentUid: string
  courseId: string
  moduleId: string
  itemId: string
  status: 'viewed' | 'complete'
  completedAt?: Timestamp | null
}

// todos/{todoId} — surfaced on the student landing "This Week"
export interface Todo {
  title: string
  description: string
  dueDate?: Timestamp
  courseId?: string
  moduleItemRef?: string // path to an item, for "Open" action
  gcSubmitUrl?: string // optional "Submit in Classroom →" action
  audience: 'all' | string[] // 'all' or array of student uids
  published: boolean
  order: number
  createdBy: string // teacher uid
}

export type InternshipStatus =
  | 'pending'
  | 'supervisor_approved'
  | 'teacher_approved'
  | 'rejected'

export interface SupervisorSignoff {
  signedAt: Timestamp
  method: 'magic_link'
  tokenId: string
}

export interface TeacherReview {
  reviewedBy: string
  reviewedAt: Timestamp
  note?: string
}

// internshipLogs/{logId}
export interface InternshipLog {
  studentUid: string
  date: Timestamp // date hours were worked
  hours: number
  site: string
  supervisorName: string
  supervisorEmail: string
  description: string
  status: InternshipStatus
  supervisorSignoff?: SupervisorSignoff
  teacherReview?: TeacherReview
}

// Convenience: a doc plus its Firestore id.
export type WithId<T> = T & { id: string }
