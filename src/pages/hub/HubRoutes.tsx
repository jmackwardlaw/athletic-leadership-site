// All /hub/* routes live here, wrapped in AuthProvider. App.tsx lazy-loads
// this module so Firebase + Hub code only ship to visitors who hit /hub —
// the public marketing site bundle is unchanged.
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { RequireRole } from '../../components/hub/guards'
import HubLayout from '../../components/hub/HubLayout'
import LoginPage from './LoginPage'
import StudentDashboard from './StudentDashboard'
import ModulePage from './ModulePage'
import ItemPage from './ItemPage'
import InternshipPage from './InternshipPage'
import TeacherDashboard from './TeacherDashboard'
import TeacherRoster from './TeacherRoster'
import TeacherInternship from './TeacherInternship'
import TeacherTodos from './TeacherTodos'

export default function HubRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />

        {/* Authenticated area (RequireAuth lives inside HubLayout) */}
        <Route element={<HubLayout />}>
          {/* Student + teacher */}
          <Route index element={<StudentDashboard />} />
          <Route path="modules/:moduleId" element={<ModulePage />} />
          <Route path="modules/:moduleId/items/:itemId" element={<ItemPage />} />
          <Route path="internship" element={<InternshipPage />} />

          {/* Teacher only */}
          <Route
            path="teacher"
            element={
              <RequireRole role="teacher">
                <TeacherDashboard />
              </RequireRole>
            }
          />
          <Route
            path="teacher/roster"
            element={
              <RequireRole role="teacher">
                <TeacherRoster />
              </RequireRole>
            }
          />
          <Route
            path="teacher/internship"
            element={
              <RequireRole role="teacher">
                <TeacherInternship />
              </RequireRole>
            }
          />
          <Route
            path="teacher/todos"
            element={
              <RequireRole role="teacher">
                <TeacherTodos />
              </RequireRole>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/hub" replace />} />
      </Routes>
    </AuthProvider>
  )
}
