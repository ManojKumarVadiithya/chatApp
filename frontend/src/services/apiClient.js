import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const PUBLIC_ENDPOINTS = ['/auth/register', '/auth/login', '/auth/logout']

let isLoggingOut = false

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Clear authentication data
 */
const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('tokenExpiration')
}

/**
 * Check if token expired
 */
const isTokenExpired = () => {
  const tokenExpiration = localStorage.getItem('tokenExpiration')
  if (!tokenExpiration) return true

  return Date.now() >= parseInt(tokenExpiration)
}

/**
 * Check if endpoint is public
 */
const isPublicEndpoint = (url = '') => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint))
}

/**
 * REQUEST INTERCEPTOR
 */
apiClient.interceptors.request.use((config) => {
  if (!isPublicEndpoint(config.url || '')) {
    if (isTokenExpired()) {
      if (!isLoggingOut) {
        isLoggingOut = true
        clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(new Error('Session expired'))
    }
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * RESPONSE INTERCEPTOR
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true
      clearAuth()

      const ws = window.chatWebSocket
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient
