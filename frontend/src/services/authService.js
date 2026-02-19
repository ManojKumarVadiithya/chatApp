import apiClient from './apiClient'

/**
 * Helper: Store authentication data
 */
const storeAuthData = (data) => {
  localStorage.setItem('token', data.token)
  localStorage.setItem('refreshToken', data.refreshToken)
  localStorage.setItem('tokenExpiration', data.tokenExpiration.toString())
  localStorage.setItem('refreshTokenExpiration', data.refreshTokenExpiration.toString())
  localStorage.setItem('user', JSON.stringify({
    id: data.userId,
    username: data.username,
    email: data.email,
    displayName: data.displayName,
  }))
}

/**
 * Helper: Clear authentication data
 */
const clearAuthData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('tokenExpiration')
  localStorage.removeItem('refreshTokenExpiration')
}

const AuthService = {

  register: async (username, email, password, displayName) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        displayName,
      })

      if (response.data.token) {
        storeAuthData(response.data)
      }

      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      if (response.data.token) {
        storeAuthData(response.data)
      }

      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  refreshToken: async () => {
    try {
      const user = localStorage.getItem('user')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!user || !refreshToken) {
        throw new Error('No refresh token available')
      }

      const userId = JSON.parse(user).id

      const response = await apiClient.post('/auth/refresh', {
        userId,
        refreshToken,
      })

      if (response.data.token) {
        storeAuthData(response.data)
      }

      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  logout: async (userId) => {
    try {
      await apiClient.post('/auth/logout', { userId })
    } finally {
      clearAuthData()
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isLoggedIn: () => {
    const token = localStorage.getItem('token')
    const expiration = localStorage.getItem('tokenExpiration')
    if (!token || !expiration) return false
    return Date.now() < parseInt(expiration)
  },
}

export default AuthService
