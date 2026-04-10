import { useEffect, useRef } from 'react'

/**
 * Attaches IntersectionObserver to a container ref.
 * All children with class `io-reveal` or `io-slide-right` will
 * get the `visible` class when they enter the viewport.
 */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>('.io-reveal, .io-slide-right')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // stagger based on data-delay attribute
            const delay = (entry.target as HTMLElement).dataset.delay || '0'
            setTimeout(() => {
              entry.target.classList.add('visible')
            }, Number(delay))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
