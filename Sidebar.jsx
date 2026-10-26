import React from 'react';
import {
  LayoutDashboard,
  Mountain,
  Radio,
  BrainCircuit,
  BellRing,
  FileText,
  Settings,
  Database,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, activeAlertCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'zones', label: 'Zones', icon: Mountain },
    { id: 'sensors', label: 'Sensors', icon: Radio },
    { id: 'predictions', label: 'Predictions', icon: BrainCircuit },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: activeAlertCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand & Logo Area */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Mountain size={22} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-text">
          <h2>
            Rockfall<span className="coral-accent">AI</span>
          </h2>
          <p>Safety &amp; Early Warning Tech</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={18}
                color={isActive ? '#1565C0' : '#5F7285'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span style={{ flex: 1, color: isActive ? '#1565C0' : '#17324D' }}>
                {item.label}
              </span>
              {item.id === 'alerts' && item.badge > 0 && (
                <span className="nav-badge-coral" title={`${item.badge} active unacknowledged alerts`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#17324D', fontWeight: 600 }}>
          <ShieldCheck size={14} color="#16A085" />
          <span>Active Telemetry Core</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#5F7285' }}>
          <Database size={12} color="#1565C0" />
          <span>FastAPI • CNN-LSTM DNN</span>
        </div>
      </div>
    </aside>
  );
}
