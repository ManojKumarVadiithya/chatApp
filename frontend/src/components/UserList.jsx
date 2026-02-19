import React, { useEffect, useState } from 'react'
import UserService from '../services/userService'
import '../styles/userlist.css'

/**
 * User List Component
 * Shows all available users to start a conversation
 */
export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await UserService.getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Start Conversation</h3>
      </div>

      <div className="user-search">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      {loading && <div className="user-list-empty">Loading users...</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredUsers.length === 0 && (
        <div className="user-list-empty">No users found</div>
      )}

      <div className="user-list-items">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="user-item hover-darken"
            onClick={() => onSelectUser(user.id)}
          >
            <div className="user-avatar">{user.displayName.charAt(0)}</div>
            <div className="user-info">
              <p className="user-name">{user.displayName}</p>
              <p className="user-status">
                <span
                  className={`status-indicator status-${user.status}`}
                ></span>
                {user.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
