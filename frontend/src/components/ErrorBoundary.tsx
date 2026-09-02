import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0f172a', color: '#fff', padding: '40px', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#ec4899' }}>Something went wrong</h1>
          <pre style={{ color: '#f87171', whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <pre style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
