// src/components/ErrorBoundary.jsx
'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (you could also send to a logging service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error info for display
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 border border-white/10 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-text-light mb-4">Something went wrong</h2>
            <p className="text-text-muted mb-6">
              An unexpected error occurred. Please refresh the page and try again.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 mb-6"
            >
              Refresh Page
            </button>

            {this.state.error && (
              <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {this.state.error.toString()}
              </p>
            )}

            {this.state.errorInfo && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem', color: '#06b6d4' }}>
                  Click for error details
                </summary>
                <pre style={{
                  background: '#1f2937',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  textAlign: 'left'
                }}>
                  {this.state.errorInfo?.componentStack || 'No component stack available'}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;