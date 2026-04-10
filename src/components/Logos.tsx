// HorseshoeLogo — renders the Palmetto horseshoe SVG asset
// className lets parent control size/positioning

interface Props {
  className?: string
  style?: React.CSSProperties
}

// We import the SVG as a URL (Vite handles this)
import horseshoeUrl from '../assets/horseshoe.svg'
import leaderInMeUrl from '../assets/leaderinme.svg'

export function HorseshoeLogo({ className = '', style }: Props) {
  return (
    <img
      src={horseshoeUrl}
      alt="Palmetto Horseshoe"
      className={className}
      style={style}
      draggable={false}
    />
  )
}

export function LeaderInMeLogo({ className = '', style }: Props) {
  return (
    <img
      src={leaderInMeUrl}
      alt="Leader in Me"
      className={className}
      style={style}
      draggable={false}
    />
  )
}
