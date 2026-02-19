import React, { useEffect, useRef, useState } from 'react'
import { useChat } from '../context/ChatContext'
import webSocketService from '../services/webSocketService'
import '../styles/chatwindow.css'

export default function ChatWindow({
  conversationId,
  userId,
  userDisplayName,
  contactName,
  contactId,
}) {
  const { messages, addMessage, onlineUsers } = useChat()

  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const isOnline = onlineUsers[contactId] === 'online'

  /**
   * ✅ Register WebSocket message listener
   */
  useEffect(() => {
    webSocketService.onMessage((message) => {
      addMessage(message)
    })
  }, [addMessage])

  /**
   * Auto scroll
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || sending) return

    try {
      setSending(true)

      const messagePayload = {
        type: 'message',
        conversationId,
        senderId: userId,
        senderName: userDisplayName,
        content: inputValue,
      }

      webSocketService.sendMessage(messagePayload)

      // ✅ Optimistic UI update
      // addMessage({
      //   id: Date.now().toString(),
      //   conversationId,
      //   senderId: userId,
      //   senderName: userDisplayName,
      //   content: inputValue,
      //   createdAt: new Date().toISOString(),
      //   isRead: false,
      // })

      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  /**
   * ✅ FIXED: conversationId safe comparison
   */
  const conversationMessages = messages
    .filter(
      (m) =>
        m.conversationId?.toString() === conversationId?.toString()
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const groupedMessages = conversationMessages.reduce((groups, message) => {
    const date = formatDate(message.createdAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="contact-header-info">
          <div className="contact-avatar-small">
            {contactName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>{contactName}</h4>
            <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {conversationMessages.length === 0 ? (
          <div className="chat-empty-state">
            <h3>No messages yet</h3>
            <p>Start the conversation 👋</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="message-date">
                  <span>{date}</span>
                </div>

                {msgs.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.senderId === userId ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message-bubble">
                      {message.content}
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={sending || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}
