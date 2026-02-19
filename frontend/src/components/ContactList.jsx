import React, { useState, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import UserService from '../services/userService'
import '../styles/contactlist.css'

export default function ContactList({
  currentUser,
  onSelectContact,
  selectedContactId,
}) {
  const { onlineUsers } = useChat()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (currentUser) {
      loadUsers()
    }
  }, [currentUser])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const allUsers = await UserService.getAllUsers()
      const otherUsers = allUsers.filter(
        (user) => user.id !== currentUser.id
      )

      setUsers(otherUsers)
    } catch (err) {
      setError(err.message || 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    (user.displayName?.toLowerCase() || '').includes(
      searchTerm.toLowerCase()
    )
  )

  return (
    <div className="contact-list">

      {/* HEADER */}
      <div className="contact-list-header">
        <h3>Contacts</h3>

        <button
          className={`refresh-btn ${loading ? 'spinning' : ''}`}
          onClick={loadUsers}
          disabled={loading}
          title="Refresh contacts"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      {/* SEARCH */}
      <div className="contact-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="contact-error">
          <p>{error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="contact-list-empty">
          <p>Loading...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredUsers.length === 0 && !error && (
        <div className="contact-list-empty">
          <p>No contacts found</p>
        </div>
      )}

      {/* USERS */}
      <div className="contact-items">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers[user.id] === 'online'

          return (
            <div
              key={user.id}
              className={`contact-item ${
                selectedContactId === user.id ? 'active' : ''
              }`}
              onClick={() => onSelectContact(user)}
            >
              <div className="contact-avatar-wrapper">
                <div className="contact-avatar">
                  {user.displayName?.charAt(0).toUpperCase()}
                </div>

                <span
                  className={`status-dot ${
                    isOnline ? 'online' : 'offline'
                  }`}
                ></span>
              </div>

              <div className="contact-name">
                {user.displayName}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
