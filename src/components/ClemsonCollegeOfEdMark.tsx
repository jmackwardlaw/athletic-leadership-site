// Official Clemson University College of Education mark.
// Authorized for use by the Clemson Athletic Leadership program.
// File: clemson_college_of_education_RGB_Rev.png (reverse / white, on transparent).

import wordmarkUrl from '../assets/clemson_college_of_education_RGB_Rev.png'

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

export default function ClemsonCollegeOfEdMark({
  size = 'footer',
  href,
  className = '',
}: Props) {
  const img = (
    <img
      src={wordmarkUrl}
      alt="Clemson University College of Education"
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
        aria-label="Clemson University College of Education"
        className="inline-block transition-opacity duration-200 hover:opacity-85"
      >
        {img}
      </a>
    )
  }

  return img
}
