import React from 'react';
import { ArrowRight, Mountain, ShieldAlert, Check } from 'lucide-react';

export default function ZoneCard({ zone, latestPrediction, isSelected, onSelect }) {
  const score = latestPrediction?.risk_score !== undefined
    ? Number(latestPrediction.risk_score).toFixed(1)
    : Number(zone?.last_risk_score ?? 15.0).toFixed(1);
  const level = latestPrediction?.risk_level ?? zone?.last_risk_level ?? 'LOW';
  const confidence = latestPrediction?.confidence ? Math.round(latestPrediction.confidence * 100) : 95;
  const mainFactor = latestPrediction?.factors?.[0] || 'Slope morphology baseline';

  const updatedTime = zone?.updated_at
    ? new Date(zone.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Recent';

  const levelColorMap = {
    LOW: '#16A085',
    MODERATE: '#F4A62A',
    HIGH: '#FA7C43',
    CRITICAL: '#E53935'
  };

  return (
    <div
      className={`zone-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(zone.id)}
      style={{
        borderWidth: isSelected ? '2px' : '1px'
      }}
    >
      <div>
        <div className="zone-card-top">
          <div>
            <div className="zone-card-id">{zone.id}</div>
            <div className="zone-card-name">{zone.name}</div>
          </div>
          <span className={`risk-badge ${level}`}>
            {level}
          </span>
        </div>

        <div className="zone-score-row">
          <span className="zone-score-big" style={{ color: levelColorMap[level] || '#12355B' }}>
            {score}
          </span>
          <span className="zone-score-max">/ 100 Risk Index</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#5F7285', marginBottom: '8px', lineHeight: 1.35 }}>
          <strong style={{ color: '#17324D' }}>Leading Trigger:</strong> {mainFactor}
        </div>
      </div>

      <div className="zone-meta-list">
        <div className="zone-meta-row">
          <span>Model Confidence</span>
          <span className="zone-meta-val" style={{ color: '#1565C0' }}>{confidence}% (CNN-LSTM)</span>
        </div>
        <div className="zone-meta-row">
          <span>Slope / Elevation</span>
          <span className="zone-meta-val">{zone.slope_angle}° / {zone.elevation}m</span>
        </div>
        <div className="zone-meta-row">
          <span>Last Updated</span>
          <span className="zone-meta-val">{updatedTime}</span>
        </div>
        <button
          className={isSelected ? 'btn-primary' : 'btn-secondary'}
          style={{ width: '100%', marginTop: '10px', fontSize: '0.78rem', padding: '7px 12px', justifyContent: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(zone.id);
          }}
        >
          <span>{isSelected ? 'Currently Inspected' : 'Inspect Slope Telemetry'}</span>
          {isSelected ? <Check size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
}
