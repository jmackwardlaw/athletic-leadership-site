// Official Clemson Athletic Leadership wordmark.
// Authorized for use by Michael Staton, Clemson Athletic Leadership program.
// File: athletic_leadership_RGB_Rev.png (reverse / white, on transparent).

import wordmarkUrl from '../assets/athletic_leadership_RGB_Rev.png'

interface Props {
  variant?: 'light' | 'dark'
  size?: 'inline' | 'footer' | 'feature'
  href?: string
  className?: string
}

const widthFor = (size: Props['size']) => {
  if (size === 'feature') return 'w-[460px] max-w-full'
  if (size === 'inline') return 'w-[160px] max-w-full'
  return 'w-[280px] max-w-full' // footer
}

export default function ClemsonALWordmark({
  size = 'footer',
  href,
  className = '',
}: Props) {
  const img = (
    <img
      src={wordmarkUrl}
      alt="Clemson Athletic Leadership"
      className={`h-auto ${widthFor(size)} ${className}`}
      draggable={false}
    />
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Clemson Athletic Leadership program"
        className="inline-block transition-opacity duration-200 hover:opacity-85"
      >
        {img}
      </a>
    )
  }

  return img
}
