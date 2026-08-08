// Self-check for share-link -> embed-link normalising.
// Run: node scripts/check-embed.mjs
import assert from 'node:assert/strict'
import { embedHostLabel, toEmbedUrl } from '../src/lib/hub/embed.ts'

// Canva share links, with and without the token segment, and with the tracking
// query string Canva appends when you hit "Copy link".
assert.equal(
  toEmbedUrl('https://www.canva.com/design/DAGabc123/view?utm_content=DAGabc123'),
  'https://www.canva.com/design/DAGabc123/view?embed'
)
assert.equal(
  toEmbedUrl('https://www.canva.com/design/DAGabc123/xyzTOKEN/view'),
  'https://www.canva.com/design/DAGabc123/xyzTOKEN/view?embed'
)
// The "edit" link a teacher may copy straight from the editor tab.
assert.equal(
  toEmbedUrl('https://www.canva.com/design/DAGabc123/xyzTOKEN/edit'),
  'https://www.canva.com/design/DAGabc123/xyzTOKEN/view?embed'
)

// YouTube in its three common shapes.
assert.equal(
  toEmbedUrl('https://www.youtube.com/watch?v=ABC123&t=30s'),
  'https://www.youtube.com/embed/ABC123'
)
assert.equal(toEmbedUrl('https://youtu.be/ABC123'), 'https://www.youtube.com/embed/ABC123')
assert.equal(
  toEmbedUrl('https://www.youtube.com/embed/ABC123'),
  'https://www.youtube.com/embed/ABC123'
)

// Google Slides / Docs / Drive share links.
assert.equal(
  toEmbedUrl('https://docs.google.com/presentation/d/DECK1/edit#slide=id.p'),
  'https://docs.google.com/presentation/d/DECK1/embed?start=false&loop=false'
)
assert.equal(
  toEmbedUrl('https://docs.google.com/document/d/DOC1/edit'),
  'https://docs.google.com/document/d/DOC1/preview'
)
assert.equal(
  toEmbedUrl('https://drive.google.com/file/d/FILE1/view?usp=sharing'),
  'https://drive.google.com/file/d/FILE1/preview'
)
assert.equal(
  toEmbedUrl('https://docs.google.com/forms/d/FORM1/viewform'),
  'https://docs.google.com/forms/d/FORM1/viewform?embedded=true'
)

assert.equal(toEmbedUrl('https://vimeo.com/12345678'), 'https://player.vimeo.com/video/12345678')

// Unknown https hosts pass through — an allowlist would block the next tool.
assert.equal(toEmbedUrl('https://example.org/thing'), 'https://example.org/thing')

// Anything that can't be framed, or is dangerous as an iframe src, is refused.
assert.equal(toEmbedUrl('http://example.org/thing'), null) // not https
assert.equal(toEmbedUrl('javascript:alert(1)'), null)
assert.equal(toEmbedUrl('data:text/html,<script>alert(1)</script>'), null)
assert.equal(toEmbedUrl('not a url'), null)
assert.equal(toEmbedUrl(''), null)
assert.equal(toEmbedUrl(null), null)
assert.equal(toEmbedUrl(undefined), null)

assert.equal(embedHostLabel('https://www.canva.com/design/X/view?embed'), 'Canva')
assert.equal(embedHostLabel('https://www.youtube.com/embed/X'), 'YouTube')
assert.equal(embedHostLabel('https://example.org/x'), 'example.org')
assert.equal(embedHostLabel(null), null)

console.log('embed URL normalising OK')
