import React from 'react'

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 * Prevents the entire app from crashing on unexpected errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}>
          <h1 style={{ marginBottom: '20px' }}>Oops! Something went wrong</h1>
          <p style={{ marginBottom: '20px', maxWidth: '600px', textAlign: 'center' }}>
            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '20px', 
              maxWidth: '600px', 
              padding: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              textAlign: 'left',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                overflow: 'auto',
                marginTop: '10px',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}>
                {this.state.error && this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.resetError}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
