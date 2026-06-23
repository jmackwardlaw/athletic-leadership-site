// Loads the singleton settings/config + active course once for the
// authenticated Hub session, so the header and pages don't each refetch.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getCourse, getSettings } from '../lib/hub/db'
import type { Course, SettingsConfig, WithId } from '../lib/hub/types'

interface HubData {
  settings: SettingsConfig | null
  course: WithId<Course> | null
  loading: boolean
  error: string | null
}

const HubDataContext = createContext<HubData | undefined>(undefined)

export function HubDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsConfig | null>(null)
  const [course, setCourse] = useState<WithId<Course> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await getSettings()
        if (cancelled) return
        setSettings(s)
        if (s?.activeCourseId) {
          const c = await getCourse(s.activeCourseId)
          if (!cancelled) setCourse(c)
        }
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('[AL Hub] failed to load settings/course:', err)
          setError('Could not load course settings.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <HubDataContext.Provider value={{ settings, course, loading, error }}>
      {children}
    </HubDataContext.Provider>
  )
}

export function useHubData(): HubData {
  const ctx = useContext(HubDataContext)
  if (!ctx) throw new Error('useHubData must be used within a HubDataProvider')
  return ctx
}
