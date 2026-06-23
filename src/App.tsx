import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SALTPage from './pages/SALTPage'
import ApplicationPage from './pages/ApplicationPage'
import CareersPage from './pages/CareersPage'
import InstructorPage from './pages/InstructorPage'
import AdminPage from './pages/AdminPage'
import AdminDetailPage from './pages/AdminDetailPage'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'
import HubLoading from './components/hub/HubLoading'

// The Hub (Firebase-backed, /hub/*) is code-split so its bundle — and
// Firebase — only loads for visitors who enter the Hub. The public
// marketing site bundle is unchanged.
const HubRoutes = lazy(() => import('./pages/hub/HubRoutes'))

// Public marketing-site layout: the existing shell (dark gradient + Nav).
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
      <Nav />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/salt" element={<SALTPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:sub" element={<AdminDetailPage />} />
        </Route>

        <Route
          path="/hub/*"
          element={
            <Suspense fallback={<HubLoading />}>
              <HubRoutes />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
