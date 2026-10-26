import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const { compact, fallbackTitle = 'Component Display Error', fallbackMessage = 'An unexpected render error occurred in this view.' } = this.props;

      if (compact) {
        return (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            color: '#fca5a5',
            margin: '8px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#f87171' }}>
              <AlertTriangle size={16} />
              <span>{fallbackTitle}</span>
            </div>
            <p style={{ margin: '6px 0 10px', fontSize: '0.82rem', color: '#94a3b8' }}>
              {fallbackMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <RefreshCw size={12} />
              <span>Retry Component</span>
            </button>
          </div>
        );
      }

      return (
        <div style={{
          padding: '32px',
          background: 'var(--bg-card, #131b2e)',
          border: '1px solid var(--border-color, #1e293b)',
          borderRadius: '12px',
          margin: '20px',
          color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ef4444' }}>{fallbackTitle}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{fallbackMessage}</p>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, margin: '16px 0' }}>
            The rest of the RockfallAI dashboard remains intact. You can navigate to other sectors using the sidebar, or retry loading this section.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '16px' }}>
            <button
              onClick={this.handleReset}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} />
              <span>Retry Section</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} />
              <span>Reload Application</span>
            </button>
            <button
              onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                cursor: 'pointer',
                fontSize: '0.82rem',
                textDecoration: 'underline'
              }}
            >
              {this.state.showDetails ? 'Hide Technical Diagnostics' : 'View Technical Diagnostics'}
            </button>
          </div>

          {this.state.showDetails && (
            <div style={{ marginTop: '20px' }}>
              <strong style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Error Diagnostics &amp; Stack Trace:
              </strong>
              <pre style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                padding: '14px',
                borderRadius: '8px',
                color: '#fca5a5',
                overflow: 'auto',
                fontSize: '0.78rem',
                maxHeight: '260px'
              }}>
                {this.state.error?.stack || this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
