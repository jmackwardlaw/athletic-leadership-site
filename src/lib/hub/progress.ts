// ─────────────────────────────────────────────────────────────
// Pure lesson-progress math. Deliberately imports nothing at runtime so it
// can be exercised directly by scripts/check-progress.mjs.
// ─────────────────────────────────────────────────────────────

export type ProgressStatus = 'viewed' | 'complete'

/** The only fields the math cares about — see LessonProgress in types.ts. */
export interface ProgressEntry {
  itemId: string
  status: ProgressStatus
}

export interface Tally {
  complete: number
  total: number
  pct: number
}

/** Deterministic doc id, so a student has at most one row per item. */
export function progressId(uid: string, itemId: string): string {
  return `${uid}_${itemId}`
}

/** itemIds the student has finished. */
export function completedIds(entries: ProgressEntry[]): Set<string> {
  return new Set(entries.filter((e) => e.status === 'complete').map((e) => e.itemId))
}

/**
 * Completion for one module. Counted by intersecting against the module's
 * current item ids, so progress rows left behind by a deleted or unpublished
 * item can never push `complete` past `total`.
 */
export function moduleProgress(itemIds: string[], done: Set<string>): Tally {
  const total = itemIds.length
  const complete = itemIds.filter((id) => done.has(id)).length
  return { complete, total, pct: total === 0 ? 0 : Math.round((complete / total) * 100) }
}

/** Roll module tallies up to a course-level tally. */
export function courseProgress(modules: Tally[]): Tally {
  const complete = modules.reduce((sum, m) => sum + m.complete, 0)
  const total = modules.reduce((sum, m) => sum + m.total, 0)
  return { complete, total, pct: total === 0 ? 0 : Math.round((complete / total) * 100) }
}
