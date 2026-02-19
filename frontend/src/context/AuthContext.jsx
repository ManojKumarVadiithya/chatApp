import React, { createContext, useState, useContext, useEffect } from 'react'
import AuthService from '../services/authService'

/**
 * Auth Context
 * Provides authentication state and methods to child components
 * Implements auto-login for returning users with token expiration checks
 */
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  /**
   * Check if token is expired
   */
  const isTokenExpired = () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration')
    if (!tokenExpiration) return true
    
    const expirationTime = parseInt(tokenExpiration)
    const currentTime = Date.now()
    return currentTime >= expirationTime
  }

  /**
   * On app load, check for existing session
   * Auto-login if valid token exists and not expired
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = AuthService.getCurrentUser()
        
        // Check if token exists and is not expired
        if (token && user && !isTokenExpired()) {
          setCurrentUser(user)
          setIsFirstTimeUser(false)
        } else if (token && isTokenExpired()) {
          // Token expired - clear and redirect to login
          AuthService.logout()
          setCurrentUser(null)
          setIsFirstTimeUser(false)
        } else {
          // No token - check if user has ever registered
          setIsFirstTimeUser(true)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setIsFirstTimeUser(true)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const register = async (username, email, password, displayName) => {
    try {
      setError(null)
      const response = await AuthService.register(username, email, password, displayName)
      
      setCurrentUser({
        id: response.userId,
        username: response.username,
        email: response.email,
        displayName: response.displayName,
      })
      setIsFirstTimeUser(false)
      return response
    } catch (err) {
      setError(err.message || 'Registration failed')
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await AuthService.login(email, password)
      
      setCurrentUser({
        id: response.userId,
        username: response.username,
        email: response.email,
        displayName: response.displayName,
      })
      setIsFirstTimeUser(false)
      return response
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    }
  }

  const logout = async () => {
    try {
      if (currentUser) {
        await AuthService.logout(currentUser.id)
      }
      setCurrentUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    isFirstTimeUser,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
