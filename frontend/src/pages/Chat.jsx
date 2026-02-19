import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import MessageService from '../services/messageService'
import UserService from '../services/userService'
import webSocketService from '../services/webSocketService'
import ContactList from '../components/ContactList'
import ChatWindow from '../components/ChatWindow'
import '../styles/chat.css'

export default function Chat() {
  const { currentUser, logout } = useAuth()
  const {
    currentConversation,
    selectConversation,
    addMessage,
    updateUserStatus,
  } = useChat()

  const [selectedContact, setSelectedContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      initializeChat()
    }
  }, [currentUser])

  const initializeChat = async () => {
    try {
      setLoading(true)

      await UserService.updateUserStatus(currentUser.id, 'online')

      const token = localStorage.getItem('token')
      await webSocketService.connect(currentUser.id, token)

      webSocketService.onMessage((message) => {
        handleWebSocketMessage(message)
      })
    } catch (error) {
      console.error('Failed to initialize chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'message':
        addMessage({
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          content: message.content,
          createdAt: message.createdAt,
          isRead: message.isRead,
        })
        break
      case 'status_update':
        updateUserStatus(message.userId, message.status)
        break
      default:
        break
    }
  }

  const handleSelectContact = async (contact) => {
    try {
      setSelectedContact(contact)

      const conversation = await MessageService.getOrCreateConversation(
        currentUser.id,
        contact.id
      )

      await selectConversation(conversation.id)
    } catch (error) {
      console.error('Failed to open conversation:', error)
    }
  }

  const handleLogout = async () => {
    try {
      webSocketService.disconnect()
      logout()

      await UserService.updateUserStatus(currentUser.id, 'offline')
      .catch(err => console.error("Status update failed:", err))
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="chat-container">

      {/* HEADER */}
      <header className="chat-header">
        <div className="header-content">
          <h1 className="header-title">MM Chat</h1>

          <div className="header-actions">
            <span className="user-badge">
              {currentUser?.displayName}
            </span>

            <button
              className="btn logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="chat-main">

        {/* SIDEBAR */}
        <aside className="chat-sidebar">
          <ContactList
            currentUser={currentUser}
            onSelectContact={handleSelectContact}
            selectedContactId={selectedContact?.id}
          />
        </aside>

        {/* CHAT CONTENT */}
        <section className="chat-content">
          {selectedContact && currentConversation ? (
            <ChatWindow
              conversationId={currentConversation}
              userId={currentUser.id}
              userDisplayName={currentUser.displayName}
              contactName={selectedContact.displayName}
              contactId={selectedContact.id}
            />
          ) : (
            <div className="chat-empty">
              <div className="empty-icon">💬</div>
              <h2>Welcome to MM Chat</h2>
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
