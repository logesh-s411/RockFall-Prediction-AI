import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, PlusCircle, BellRing } from 'lucide-react';

export default function AlertPanel({ alerts, onAcknowledge, onGenerateAlert }) {
  const [demoZone, setDemoZone] = useState('ZONE-A');
  const [demoLevel, setDemoLevel] = useState('HIGH');

  const getAlertIcon = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <AlertTriangle size={18} color="#E53935" />;
      case 'HIGH':
        return <AlertCircle size={18} color="#FA7C43" />;
      case 'MODERATE':
        return <AlertTriangle size={18} color="#F4A62A" />;
      default:
        return <ShieldCheck size={18} color="#16A085" />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <BellRing size={18} color="#FF6B61" />
            <span>Active Early Warning Alerts Feed</span>
          </h3>
          <div className="card-subtitle">
            Tiered Operational Action Protocol (LOW, MODERATE, HIGH, CRITICAL)
          </div>
        </div>

        {/* Dispatch Simulated Alert Test Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={demoZone}
            onChange={(e) => setDemoZone(e.target.value)}
            style={{
              padding: '6px 10px',
              background: '#FFFFFF',
              color: '#17324D',
              border: '1px solid #D9E7F2',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Select slope sector to simulate"
          >
            <option value="ZONE-A">Zone A</option>
            <option value="ZONE-B">Zone B</option>
            <option value="ZONE-C">Zone C</option>
            <option value="ZONE-D">Zone D</option>
          </select>

          <select
            value={demoLevel}
            onChange={(e) => setDemoLevel(e.target.value)}
            style={{
              padding: '6px 10px',
              background: '#FFFFFF',
              color: '#17324D',
              border: '1px solid #D9E7F2',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Select risk severity level"
          >
            <option value="LOW">LOW</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#1565C0', borderColor: '#D9E7F2' }}
            onClick={() => onGenerateAlert && onGenerateAlert(demoZone, demoLevel)}
            title="Dispatch simulated risk alert for testing"
          >
            <PlusCircle size={14} color="#1565C0" />
            <span>Simulate Alert</span>
          </button>
        </div>
      </div>

      <div className="alert-list">
        {(!alerts || alerts.length === 0) ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: '#5F7285',
              fontSize: '0.9rem',
              background: '#F8FBFE',
              borderRadius: '12px',
              border: '1px dashed #D9E7F2'
            }}
          >
            <ShieldCheck size={28} color="#16A085" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, color: '#12355B' }}>No active unacknowledged alerts</div>
            <div style={{ fontSize: '0.8rem', color: '#5F7285', marginTop: '2px' }}>
              All monitored pit sectors are operating within standard baseline safety margins.
            </div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.alert_level}`}>
              <div className="alert-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getAlertIcon(alert.alert_level)}
                  <div>
                    <span className={`risk-badge ${alert.alert_level}`} style={{ marginRight: '8px' }}>
                      {alert.alert_level}
                    </span>
                    <strong style={{ color: '#12355B' }}>{alert.zone_id}</strong>
                    <span style={{ color: '#5F7285', margin: '0 4px' }}>•</span>
                    <span style={{ color: '#17324D', fontWeight: 600 }}>{alert.title}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="alert-time">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!(alert.is_acknowledged || alert.acknowledged) ? (
                    <button
                      className="btn-secondary"
                      style={{
                        fontSize: '0.74rem',
                        padding: '4px 10px',
                        borderColor: '#A3E4D7',
                        color: '#16A085',
                        background: '#E8F8F3'
                      }}
                      onClick={() => onAcknowledge && onAcknowledge(alert.id)}
                      title="Acknowledge alert"
                    >
                      <CheckCircle2 size={13} color="#16A085" />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#16A085',
                        background: '#E8F8F3',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        border: '1px solid #A3E4D7',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700
                      }}
                      title="Alert acknowledged by safety personnel"
                    >
                      <CheckCircle2 size={13} />
                      <span>✓ ACKNOWLEDGED</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="alert-reason">{alert.reason}</div>

              <div className="alert-action-box">
                <strong style={{ color: '#12355B' }}>Required Action:</strong>
                <span>{alert.recommended_action}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
