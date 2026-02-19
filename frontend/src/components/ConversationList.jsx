import React from 'react'
import '../styles/conversationlist.css'

/**
 * Conversation List Component
 * Shows all conversations for the logged-in user in WhatsApp-style sidebar
 */
export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  loading,
}) {
  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) {
      return `${minutes}m`
    } else if (hours < 24) {
      return `${hours}h`
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h3>Chats</h3>
      </div>

      {loading && <div className="conversation-list-empty">Loading chats...</div>}

      {!loading && conversations.length === 0 && (
        <div className="conversation-list-empty">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
          <p>No conversations yet</p>
          <p className="text-muted">Click "New Chat" to start messaging</p>
        </div>
      )}

      <div className="conversation-items">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${
              currentConversationId === conversation.id ? 'active' : ''
            } hover-darken`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="conversation-avatar">
              {conversation.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="conversation-content">
              <div className="conversation-header-row">
                <h4 className="conversation-name">{conversation.name}</h4>
                <span className="conversation-time">
                  {formatTime(conversation.lastMessageAt)}
                </span>
              </div>
              <p className="conversation-preview">
                {conversation.lastMessageContent || 'No messages yet'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
