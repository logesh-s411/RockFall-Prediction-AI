import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value).toFixed(1);
    const num = parseFloat(val);
    const level = num >= 75 ? 'CRITICAL' : num >= 50 ? 'HIGH' : num >= 25 ? 'MODERATE' : 'LOW';

    const levelColor =
      level === 'CRITICAL' ? '#E53935' :
      level === 'HIGH' ? '#FA7C43' :
      level === 'MODERATE' ? '#F4A62A' : '#16A085';

    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #D9E7F2',
          borderRadius: '10px',
          padding: '10px 14px',
          boxShadow: '0 4px 18px rgba(30, 90, 140, 0.12)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ color: '#5F7285', marginBottom: '4px', fontSize: '0.74rem' }}>
          Time: <strong style={{ color: '#17324D' }}>{label}</strong>
        </div>
        <div style={{ color: '#12355B', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Risk Score:</span>
          <span style={{ color: levelColor }}>{val} / 100</span>
        </div>
        <div style={{ marginTop: '6px' }}>
          <span className={`risk-badge ${level}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            {level}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function RiskChart({ data, zoneId = 'All Zones' }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="card"
        style={{
          height: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5F7285',
          gap: '8px'
        }}
      >
        <TrendingUp size={24} color="#1565C0" />
        <span>No historical trend telemetry available for {zoneId}.</span>
      </div>
    );
  }

  // Format timestamp for display
  const chartData = data.map((d, index) => {
    const dateObj = d.timestamp ? new Date(d.timestamp) : null;
    const timeLabel = dateObj
      ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : `T-${data.length - index}h`;

    return {
      time: timeLabel,
      score: d.risk_score !== undefined ? d.risk_score : (d.vibration || 1) * 3.5,
      displacement: d.displacement,
      vibration: d.vibration,
      rainfall: d.rainfall
    };
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <TrendingUp size={18} color="#1565C0" />
            <span>Chronological Risk Trajectory &amp; Dynamic Thresholds</span>
          </h3>
          <div className="card-subtitle">
            Sector: <strong style={{ color: '#12355B' }}>{zoneId}</strong> • 24-Hour Multi-Modal Geotechnical Dynamics
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.74rem',
            fontWeight: 600,
            background: '#F5F9FD',
            border: '1px solid #D9E7F2',
            padding: '4px 10px',
            borderRadius: '999px'
          }}
        >
          <span style={{ color: '#16A085', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ● 0–24 Low
          </span>
          <span style={{ color: '#F4A62A', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ● 25–49 Moderate
          </span>
          <span style={{ color: '#FA7C43', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ● 50–74 High
          </span>
          <span style={{ color: '#E53935', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ● 75–100 Critical
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 290 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 12, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="arcticRiskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#64B5F6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#E3F2FD" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F0F7" vertical={false} />
            <XAxis dataKey="time" stroke="#5F7285" tick={{ fontSize: 11, fill: '#5F7285' }} />
            <YAxis domain={[0, 100]} stroke="#5F7285" tick={{ fontSize: 11, fill: '#5F7285' }} />
            <Tooltip content={<CustomTooltip />} />

            {/* Risk Threshold Reference Lines */}
            <ReferenceLine y={25} stroke="#16A085" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'LOW / MODERATE', position: 'insideTopRight', fill: '#16A085', fontSize: 10 }} />
            <ReferenceLine y={50} stroke="#F4A62A" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'MODERATE / HIGH', position: 'insideTopRight', fill: '#F4A62A', fontSize: 10 }} />
            <ReferenceLine y={75} stroke="#E53935" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'CRITICAL THRESHOLD', position: 'insideTopRight', fill: '#E53935', fontSize: 10 }} />

            <Area
              type="monotone"
              dataKey="score"
              name="Risk Score"
              stroke="#1565C0"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#arcticRiskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
