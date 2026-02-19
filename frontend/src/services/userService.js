import apiClient from './apiClient'

/**
 * User API endpoints
 */
const UserService = {
  /**
   * Get user profile by ID
   */
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/users/profile/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Get all active users
   */
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Update user status (online/offline/away)
   */
  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.put(
        `/users/status/${userId}`,
        null,
        { params: { status } }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default UserService
