import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import './styles/globals.css'
import './styles/components.css'

/**
 * Protected Route Component
 */
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Main App Component
 * Routes users based on authentication state
 */
function AppContent() {
  const { currentUser, loading, isFirstTimeUser } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>
  }

  return (
    <Routes>
      {/* First-time users must register */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected chat route */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatProvider>
              <Chat />
            </ChatProvider>
          </ProtectedRoute>
        }
      />
      
      {/* Root route logic */}
      <Route 
        path="/" 
        element={
          isFirstTimeUser ? <Navigate to="/register" replace /> : <Navigate to="/chat" replace />
        } 
      />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/**
 * Root App Component
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}
