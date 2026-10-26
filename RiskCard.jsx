import React from 'react';
import { Activity, Mountain, Bell, Server, ArrowUpRight } from 'lucide-react';

export default function RiskCard({ summary }) {
  const score = summary?.overall_risk_score !== undefined
    ? Number(summary.overall_risk_score).toFixed(1)
    : '41.5';
  const level = summary?.overall_risk_level || 'MODERATE';
  const zonesCount = summary?.monitored_zones_count || 4;
  const totalZones = 6; // Monitored pit sectors capacity
  const alertsCount = summary?.active_alerts_count ?? 0;
  const uptime = '99.8%';

  const levelColorMap = {
    LOW: '#16A085',
    MODERATE: '#F4A62A',
    HIGH: '#FA7C43',
    CRITICAL: '#E53935'
  };

  return (
    <div className="summary-grid">
      {/* 1. Overall Risk Index */}
      <div className="summary-card">
        <div className="summary-card-top">
          <span>Overall Risk Index</span>
          <div className="summary-icon-box" style={{ background: '#E3F2FD', color: '#1565C0' }}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="summary-card-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span>{score}</span>
          <span style={{ fontSize: '1.05rem', color: '#5F7285', fontWeight: 500 }}>/ 100</span>
        </div>
        <div className="summary-card-foot">
          <span className={`risk-badge ${level}`}>
            {level}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#5F7285' }}>
            Spatial-temporal fusion
          </span>
        </div>
      </div>

      {/* 2. Active Zones */}
      <div className="summary-card">
        <div className="summary-card-top">
          <span>Active Zones</span>
          <div className="summary-icon-box" style={{ background: '#E8F8F3', color: '#16A085' }}>
            <Mountain size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="summary-card-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span>{zonesCount}</span>
          <span style={{ fontSize: '1.05rem', color: '#5F7285', fontWeight: 500 }}>/ {totalZones}</span>
        </div>
        <div className="summary-card-foot">
          <span style={{ color: '#16A085', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A085' }}></span>
            Monitoring
          </span>
          <span style={{ fontSize: '0.74rem', color: '#5F7285' }}>
            Telemetry continuous
          </span>
        </div>
      </div>

      {/* 3. Active Alerts */}
      <div className="summary-card">
        <div className="summary-card-top">
          <span>Active Alerts</span>
          <div
            className="summary-icon-box"
            style={{
              background: alertsCount > 0 ? '#FFF0EE' : '#EEF5FB',
              color: alertsCount > 0 ? '#FF6B61' : '#1565C0'
            }}
          >
            <Bell size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div
          className="summary-card-value"
          style={{ color: alertsCount > 0 ? '#E53935' : '#12355B' }}
        >
          {alertsCount}
        </div>
        <div className="summary-card-foot">
          <span
            style={{
              color: alertsCount > 0 ? '#FF6B61' : '#16A085',
              fontWeight: 700
            }}
          >
            {alertsCount > 0 ? 'Needs Attention' : 'All Clear'}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#5F7285' }}>
            {alertsCount > 0 ? `${alertsCount} unacknowledged` : 'Zero active hazards'}
          </span>
        </div>
      </div>

      {/* 4. System Uptime */}
      <div className="summary-card">
        <div className="summary-card-top">
          <span>System Uptime</span>
          <div className="summary-icon-box" style={{ background: '#E3F2FD', color: '#2196F3' }}>
            <Server size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="summary-card-value">
          {uptime}
        </div>
        <div className="summary-card-foot">
          <span style={{ color: '#16A085', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A085' }}></span>
            Online
          </span>
          <span style={{ fontSize: '0.74rem', color: '#5F7285' }}>
            Fault-tolerant mesh
          </span>
        </div>
      </div>
    </div>
  );
}
