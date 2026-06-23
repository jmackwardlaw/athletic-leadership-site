// Route guards for the Hub (React Router v7, library mode → wrapper
// components that render <Navigate>). Matches the repo's component-router
// setup in App.tsx.
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../lib/hub/types'
import HubLoading from './HubLoading'

/** Requires an authenticated user; unauthenticated → /hub/login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <HubLoading />
  if (!user) return <Navigate to="/hub/login" replace state={{ from: location }} />
  return <>{children}</>
}

/**
 * Requires a specific role. Students hitting teacher routes are bounced to
 * /hub; an authenticated user with no role yet is treated as a student.
 */
export function RequireRole({
  role: required,
  children,
}: {
  role: Role
  children: ReactNode
}) {
  const { user, role, loading } = useAuth()
  const location = useLocation()
  if (loading) return <HubLoading />
  if (!user) return <Navigate to="/hub/login" replace state={{ from: location }} />
  const effective: Role = role ?? 'student'
  if (effective !== required) {
    // Teachers may access student routes; students may not access teacher routes.
    if (required === 'student' && effective === 'teacher') return <>{children}</>
    return <Navigate to={effective === 'teacher' ? '/hub/teacher' : '/hub'} replace />
  }
  return <>{children}</>
}
