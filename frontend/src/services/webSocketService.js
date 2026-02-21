class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageCallback = null
    this.isConnecting = false
    this.isManuallyClosed = false
  }

  /**
   * Check if session expired
   */
  isSessionExpired() {
    const expiration = localStorage.getItem('tokenExpiration')
    if (!expiration) return true
    return Date.now() >= parseInt(expiration)
  }

  /**
   * Connect to WebSocket
   */
  connect(userId) {
    return new Promise((resolve, reject) => {
      // Prevent duplicate connections
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return resolve()
      }

      if (this.isConnecting) return
      this.isConnecting = true
      this.isManuallyClosed = false

      if (this.isSessionExpired()) {
        this.handleSessionExpired()
        this.isConnecting = false
        return reject(new Error('Session expired'))
      }

      const token = localStorage.getItem('token')
      const wsUrl = import.meta.env.VITE_WS_URL

      this.ws = new WebSocket(
        `${wsUrl}/ws/chat?token=${token}&userId=${userId}`
      )

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.isConnecting = false
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (this.messageCallback) {
            this.messageCallback(message)
          }
        } catch (err) {
          console.error('Invalid WS message:', event.data)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket closed')
        this.isConnecting = false

        if (this.isManuallyClosed) return

        if (!this.isSessionExpired()) {
          this.attemptReconnect(userId)
        } else {
          this.handleSessionExpired()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * Handle expired session safely
   */
  handleSessionExpired() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('tokenExpiration')
    localStorage.removeItem('refreshTokenExpiration')

    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  /**
   * Send message
   */
  sendMessage(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected')
    }
  }

  /**
   * Register message listener
   */
  onMessage(callback) {
    this.messageCallback = callback
  }

  /**
   * Manual disconnect
   */
  disconnect() {
    this.isManuallyClosed = true
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * Reconnect with fresh token
   */
  attemptReconnect(userId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.handleSessionExpired()
      return
    }

    this.reconnectAttempts++

    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(
      `Reconnecting in ${delay / 1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    )

    setTimeout(() => {
      const freshToken = localStorage.getItem('token')
      if (!freshToken || this.isSessionExpired()) {
        this.handleSessionExpired()
        return
      }

      this.connect(userId).catch(console.error)
    }, delay)
  }

  /**
   * Check connection state
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export default new WebSocketService()
