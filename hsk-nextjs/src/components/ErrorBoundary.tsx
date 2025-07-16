"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 在开发环境中，只记录非水合错误
    if (process.env.NODE_ENV === 'development') {
      const isHydrationError = 
        error.message.includes('Hydration') ||
        error.message.includes('server HTML') ||
        error.message.includes('client-side') ||
        errorInfo.componentStack?.includes('Hydration');
      
      if (!isHydrationError) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
      }
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: '#ef4444'
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              出现了一些问题
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              页面遇到了意外错误。请尝试刷新页面，如果问题持续存在，请联系系统管理员。
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={this.resetError}
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#3730a3';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                刷新页面
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                backgroundColor: '#fef2f2',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #fecaca'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#dc2626',
                  marginBottom: '0.5rem'
                }}>
                  错误详情 (开发模式)
                </summary>
                <pre style={{
                  fontSize: '0.75rem',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.stack}
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
