import { useState } from 'react'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SALTPage from './pages/SALTPage'
import ApplicationPage from './pages/ApplicationPage'
import CareersPage from './pages/CareersPage'
import InstructorPage from './pages/InstructorPage'
import Nav from './components/Nav'

export type Page = 'home' | 'about' | 'salt' | 'apply' | 'careers' | 'instructor'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const navigate = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Nav currentPage={currentPage} navigate={navigate} />
      {currentPage === 'home' && <HomePage navigate={navigate} />}
      {currentPage === 'about' && <AboutPage navigate={navigate} />}
      {currentPage === 'salt' && <SALTPage navigate={navigate} />}
      {currentPage === 'careers' && <CareersPage navigate={navigate} />}
      {currentPage === 'apply' && <ApplicationPage navigate={navigate} />}
      {currentPage === 'instructor' && <InstructorPage navigate={navigate} />}
    </div>
  )
}
