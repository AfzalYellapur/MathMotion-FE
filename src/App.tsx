import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './Components/Landing/index'
import Workspace from './Components/Workspace/index'
import SigninPage from './Components/Auth/SigninPage'
import SignupPage from './Components/Auth/SignupPage'
import { AnimatePresence } from 'framer-motion'
import GlassySidebar from './Components/ui/GlassySidebar'

function AppContent() {
  const location = useLocation()
  const hideNavRoutes = ['/signin', '/signup']
  const shouldShowSidebar = !hideNavRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowSidebar && <GlassySidebar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/workspace/:sessionId' element={<Workspace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App