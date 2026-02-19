import apiClient from './apiClient'

/**
 * Message and Conversation API endpoints
 */
const MessageService = {
  /**
   * Get all conversations for a user
   */
  getUserConversations: async (userId) => {
    try {
      const response = await apiClient.get(`/messages/conversations/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Get or create a direct conversation between two users
   */
  getOrCreateConversation: async (userId1, userId2) => {
    try {
      const response = await apiClient.post(
        '/messages/conversation',
        null,
        { params: { userId1, userId2 } }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Get message history for a conversation
   */
  getMessageHistory: async (conversationId, page = 0, size = 50) => {
    try {
      const response = await apiClient.get(
        `/messages/history/${conversationId}`,
        { params: { page, size } }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Mark message as read
   */
  markMessageAsRead: async (messageId, userId) => {
    try {
      const response = await apiClient.put(
        `/messages/read/${messageId}`,
        null,
        { params: { userId } }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId, userId) => {
    try {
      const response = await apiClient.delete(
        `/messages/${messageId}`,
        { params: { userId } }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default MessageService
