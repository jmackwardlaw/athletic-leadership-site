// Self-check for enrollment list parsing. Run: node scripts/check-roster.mjs
import assert from 'node:assert/strict'
import {
  enrollmentEnabled,
  isEnrolled,
  parseEmailList,
} from '../src/lib/hub/roster.ts'

// One per line, the common case.
assert.deepEqual(parseEmailList('a@x.org\nb@x.org'), ['a@x.org', 'b@x.org'])

// Comma-separated out of a spreadsheet, with a trailing comma and spaces.
assert.deepEqual(parseEmailList('a@x.org, b@x.org, '), ['a@x.org', 'b@x.org'])

// Mixed separators, mixed case, duplicates — normalised and deduped, order kept.
assert.deepEqual(
  parseEmailList('B@x.org; a@X.org\n b@x.org , A@x.org'),
  ['b@x.org', 'a@x.org']
)

// Paste artifacts without an "@" are dropped rather than enrolled.
assert.deepEqual(parseEmailList('Name\tEmail\na@x.org'), ['a@x.org'])

// Empty / whitespace input is an empty list, not [''].
assert.deepEqual(parseEmailList(''), [])
assert.deepEqual(parseEmailList('   \n  '), [])

// The gate is off unless the list actually has someone in it.
assert.equal(enrollmentEnabled([]), false)
assert.equal(enrollmentEnabled(null), false)
assert.equal(enrollmentEnabled(undefined), false)
assert.equal(enrollmentEnabled(['a@x.org']), true)

// Membership is case-insensitive, and nobody is enrolled when the gate is off.
assert.equal(isEnrolled('A@X.org', ['a@x.org']), true)
assert.equal(isEnrolled('c@x.org', ['a@x.org']), false)
assert.equal(isEnrolled('a@x.org', []), false)

// A hand-edited console entry with stray case/space still matches.
assert.equal(isEnrolled('a@x.org', [' A@x.org ']), true)

console.log('roster parsing OK')
