// Self-check for the lesson-progress math. Run: node scripts/check-progress.mjs
// (Node 24 strips the TypeScript types on import — no build step needed.)
import assert from 'node:assert/strict'
import {
  completedIds,
  courseProgress,
  moduleProgress,
  progressId,
} from '../src/lib/hub/progress.ts'

const done = completedIds([
  { itemId: 'a', status: 'complete' },
  { itemId: 'b', status: 'viewed' },
  { itemId: 'gone', status: 'complete' }, // item since deleted/unpublished
])

assert.deepEqual([...done].sort(), ['a', 'gone'])

// 'viewed' does not count as complete.
assert.deepEqual(moduleProgress(['a', 'b', 'c'], done), { complete: 1, total: 3, pct: 33 })

// The stale 'gone' row must not inflate the count past the total.
assert.deepEqual(moduleProgress(['a'], done), { complete: 1, total: 1, pct: 100 })

// Empty module: no division by zero.
assert.deepEqual(moduleProgress([], done), { complete: 0, total: 0, pct: 0 })

// Course roll-up weights by item, not by module.
assert.deepEqual(
  courseProgress([
    { complete: 1, total: 3, pct: 33 },
    { complete: 3, total: 3, pct: 100 },
  ]),
  { complete: 4, total: 6, pct: 67 }
)
assert.deepEqual(courseProgress([]), { complete: 0, total: 0, pct: 0 })

assert.equal(progressId('uid1', 'item1'), 'uid1_item1')

console.log('progress math OK')
