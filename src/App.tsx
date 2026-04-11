import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SALTPage from './pages/SALTPage'
import ApplicationPage from './pages/ApplicationPage'
import CareersPage from './pages/CareersPage'
import InstructorPage from './pages/InstructorPage'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/salt" element={<SALTPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
