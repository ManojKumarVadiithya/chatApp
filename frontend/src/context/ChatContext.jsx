import React, { createContext, useState, useContext, useCallback } from 'react'
import MessageService from '../services/messageService'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState({})
  const [typingIndicators, setTypingIndicators] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadConversations = useCallback(async (userId) => {
    try {
      setLoading(true)
      setError(null)
      const data = await MessageService.getUserConversations(userId)
      setConversations(data)
    } catch (err) {
      setError(err.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  const selectConversation = useCallback(async (conversationId) => {
    try {
      setLoading(true)
      setError(null)
      const messageHistory = await MessageService.getMessageHistory(
        conversationId,
        0,
        50
      )
      setCurrentConversation(conversationId)
      setMessages(messageHistory)
    } catch (err) {
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * ✅ FIXED: Duplicate detection ONLY by ID
   */
  const addMessage = useCallback((message) => {
    setMessages((prev) => {
      const isDuplicate = prev.some((m) => m.id === message.id)
      if (isDuplicate) return prev
      return [...prev, message]
    })
  }, [])

  const updateUserStatus = useCallback((userId, status) => {
    setOnlineUsers((prev) => ({
      ...prev,
      [userId]: status,
    }))
  }, [])

  const setTypingStatus = useCallback((conversationId, userId, isTyping) => {
    setTypingIndicators((prev) => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        [userId]: isTyping,
      },
    }))
  }, [])

  const value = {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    onlineUsers,
    typingIndicators,
    loading,
    error,
    loadConversations,
    selectConversation,
    addMessage,
    updateUserStatus,
    setTypingStatus,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
