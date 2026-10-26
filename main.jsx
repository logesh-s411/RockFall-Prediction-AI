import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#1e293b', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Application Render Error</h2>
          <p style={{ color: '#94a3b8', marginBottom: '16px' }}>An error occurred while mounting the component tree:</p>
          <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', color: '#fca5a5', overflow: 'auto', fontSize: '0.85rem' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element with id 'root'.");
}
