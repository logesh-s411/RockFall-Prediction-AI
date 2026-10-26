import React, { useState, useEffect } from 'react';
import {
  Mountain,
  RefreshCw,
  Bell,
  Sliders,
  Cpu,
  Sparkles,
  User,
  Clock
} from 'lucide-react';

export default function Header({
  summary,
  systemStatus,
  onRefresh,
  isRefreshing,
  onSelectScenario,
  activeScenario = 'DEFAULT'
}) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
        ' • ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isModelOk = systemStatus?.model ?? true;
  const isGenAIOk = systemStatus?.genai ?? false;
  const alertCount = summary?.active_alerts_count ?? 0;

  return (
    <header className="app-header">
      {/* Left: Branding & Subtitle */}
      <div className="header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(21, 101, 192, 0.25)'
            }}
          >
            <Mountain size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#12355B', letterSpacing: '-0.02em' }}>
                Rockfall<span style={{ color: '#FF6B61' }}>AI</span>
              </span>
              <span className="demo-pill">DEMO MODE</span>
            </div>
            <div className="header-subtitle">
              AI-Powered Mine Safety &amp; Early Warning System
            </div>
          </div>
        </div>
      </div>

      {/* Right: Operational Controls & Admin Profile */}
      <div className="header-right">
        {/* System Online Status */}
        <div className="system-online-badge" title="Telemetry ingestion bus & CNN-LSTM prediction engine operational">
          <span className="system-online-dot"></span>
          <span>System Online</span>
        </div>

        {/* Date / Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: '#5F7285',
            fontWeight: 600,
            background: '#FFFFFF',
            border: '1px solid #D9E7F2',
            padding: '5px 10px',
            borderRadius: '8px'
          }}
          title="Current System Monitoring Time"
        >
          <Clock size={13} color="#1565C0" />
          <span>{currentTime || 'Syncing...'}</span>
        </div>

        {/* Subsystem Health Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid #D9E7F2',
            fontSize: '0.74rem'
          }}
          title="Subsystem Health: PyTorch Model & GenAI Engine"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={13} color={isModelOk ? '#16A085' : '#F4A62A'} />
            <span style={{ color: isModelOk ? '#16A085' : '#F4A62A', fontWeight: 700 }}>
              CNN-LSTM
            </span>
          </div>
          <span style={{ color: '#D9E7F2' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color={isGenAIOk ? '#1565C0' : '#7E92A2'} />
            <span style={{ color: isGenAIOk ? '#1565C0' : '#7E92A2', fontWeight: 700 }}>
              GenAI: {isGenAIOk ? 'Claude' : 'Fallback'}
            </span>
          </div>
        </div>

        {/* Demo Scenario Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} color="#5F7285" />
          <select
            value={activeScenario}
            onChange={(e) => onSelectScenario && onSelectScenario(e.target.value)}
            style={{
              padding: '6px 10px',
              background: '#FFFFFF',
              color: '#17324D',
              border: '1px solid #D9E7F2',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 4px rgba(30, 90, 140, 0.04)'
            }}
            title="Inject operational demo scenarios to evaluate telemetry and risk response"
          >
            <option value="DEFAULT">Scenario: Dynamic Drift</option>
            <option value="NORMAL">Scenario: Normal Baseline</option>
            <option value="MODERATE">Scenario: Moderate Rainfall</option>
            <option value="HIGH">Scenario: Slope Creep</option>
            <option value="CRITICAL">Scenario: Critical Instability</option>
          </select>
        </div>

        {/* Simulate Telemetry Tick Button */}
        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Simulate incoming sensor telemetry tick"
        >
          <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} color="#1565C0" />
          <span>{isRefreshing ? 'Processing...' : 'Simulate Tick'}</span>
        </button>

        {/* Notification Bell with Coral Badge */}
        <div className="header-icon-btn" title={`${alertCount} Active Alerts`}>
          <Bell size={17} color="#17324D" />
          {alertCount > 0 && (
            <span className="coral-notification-badge">
              {alertCount}
            </span>
          )}
        </div>

        {/* Admin Profile */}
        <div className="admin-profile-pill" title="Administrator Session">
          <div className="admin-avatar">
            <User size={15} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#12355B' }}>Admin</span>
            <span style={{ fontSize: '0.65rem', color: '#5F7285' }}>Mine Safety HQ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
