// ─────────────────────────────────────────────────────────────
// Turns the link a teacher actually copies (the "Share" link) into the URL
// that will render inside an iframe. Pure — no imports — so it is checked by
// scripts/check-embed.mjs.
//
// Every one of these hosts hands you a share URL that renders a blank frame if
// you embed it directly, which is an infuriating thing to debug from a
// classroom. Normalising is cheaper than explaining.
// ─────────────────────────────────────────────────────────────

/** 16:9 unless a host is known to want something else. */
export const DEFAULT_EMBED_RATIO = '16 / 9'

/**
 * Returns an embeddable https URL, or null if the input can't be embedded.
 * Unknown https hosts are passed through unchanged — plenty of things embed
 * fine and an allowlist would just block the next tool the teacher tries.
 */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  const trimmed = (raw || '').trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }
  // Anything that isn't https can't be framed from an https page anyway, and
  // javascript:/data: URLs must never reach an iframe src.
  if (url.protocol !== 'https:') return null

  const host = url.hostname.replace(/^www\./, '')
  const path = url.pathname

  // Canva: /design/{id}/{token}/view -> same path + ?embed
  if (host === 'canva.com') {
    const m = path.match(/^\/design\/([^/]+)(?:\/([^/]+))?\/(?:view|edit|watch)/)
    if (m) {
      const tail = m[2] ? `${m[1]}/${m[2]}` : m[1]
      return `https://www.canva.com/design/${tail}/view?embed`
    }
  }

  // YouTube: watch?v=ID and youtu.be/ID -> /embed/ID
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const v = url.searchParams.get('v')
    if (v) return `https://www.youtube.com/embed/${v}`
    const short = path.match(/^\/(?:embed|shorts)\/([^/]+)/)
    if (short) return `https://www.youtube.com/embed/${short[1]}`
  }
  if (host === 'youtu.be') {
    const id = path.slice(1)
    if (id) return `https://www.youtube.com/embed/${id}`
  }

  // Google Slides / Docs / Sheets / Forms and Drive files.
  if (host === 'docs.google.com') {
    const m = path.match(/^\/(presentation|document|spreadsheets|forms)\/d\/([^/]+)/)
    if (m) {
      const [, kind, id] = m
      if (kind === 'presentation') {
        return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false`
      }
      if (kind === 'forms') {
        return `https://docs.google.com/forms/d/${id}/viewform?embedded=true`
      }
      return `https://docs.google.com/${kind}/d/${id}/preview`
    }
  }
  if (host === 'drive.google.com') {
    const m = path.match(/^\/file\/d\/([^/]+)/)
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`
  }

  // Vimeo: /ID -> player.vimeo.com/video/ID
  if (host === 'vimeo.com') {
    const m = path.match(/^\/(\d+)/)
    if (m) return `https://player.vimeo.com/video/${m[1]}`
  }

  return url.toString()
}

/** Human label for the editor hint, so a teacher can see it was understood. */
export function embedHostLabel(embedUrl: string | null): string | null {
  if (!embedUrl) return null
  try {
    const host = new URL(embedUrl).hostname.replace(/^www\./, '')
    if (host.includes('canva')) return 'Canva'
    if (host.includes('youtube')) return 'YouTube'
    if (host.includes('vimeo')) return 'Vimeo'
    if (host.includes('docs.google')) return 'Google Docs'
    if (host.includes('drive.google')) return 'Google Drive'
    return host
  } catch {
    return null
  }
}
