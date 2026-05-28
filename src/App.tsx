import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Landing from './Components/Landing/index'
import Workspace from './Components/Workspace/index'
import LoginPage from './Components/Auth/LoginPage'
import RegisterPage from './Components/Auth/RegisterPage'
import VerifyEmailPage from './Components/Auth/VerifyEmailPage'
import ForgotPasswordPage from './Components/Auth/ForgotPasswordPage'
import ResetPasswordPage from './Components/Auth/ResetPasswordPage'
import { AnimatePresence } from 'framer-motion'
import GlassySidebar from './Components/ui/GlassySidebar'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <p className="text-white/60 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation()
  const hideNavRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']
  const shouldShowSidebar = !hideNavRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowSidebar && <GlassySidebar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path='/workspace/:projectId' element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App