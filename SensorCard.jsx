import React from 'react';
import { Activity, Compass, Move, CloudRain, Thermometer, BatteryCharging, Wifi, Radio } from 'lucide-react';

export default function SensorCard({ sensor, zoneId }) {
  if (!sensor) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center', color: '#5F7285' }}>
        No sensor reading telemetry available for {zoneId || 'selected zone'}.
      </div>
    );
  }

  const numVal = (v, dec) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    return isNaN(n) ? '0.0' : n.toFixed(dec);
  };

  const vib = sensor?.vibration || 0;
  const tilt = sensor?.tilt || 0;
  const disp = sensor?.displacement || 0;
  const rain = sensor?.rainfall || 0;
  const temp = sensor?.temperature || 0;

  const vibStatus = vib > 18 ? { label: 'Critical', bg: '#FFE9E7', color: '#E53935' }
    : vib > 10 ? { label: 'Elevated', bg: '#FFF1EB', color: '#FA7C43' }
    : vib > 4 ? { label: 'Moderate', bg: '#FFF6DF', color: '#F4A62A' }
    : { label: 'Normal', bg: '#E8F8F3', color: '#16A085' };

  const tiltStatus = tilt > 10 ? { label: 'Critical', bg: '#FFE9E7', color: '#E53935' }
    : tilt > 6 ? { label: 'Rising', bg: '#FFF1EB', color: '#FA7C43' }
    : tilt > 3 ? { label: 'Noticeable', bg: '#FFF6DF', color: '#F4A62A' }
    : { label: 'Normal', bg: '#E8F8F3', color: '#16A085' };

  const dispStatus = disp > 10 ? { label: 'Severe', bg: '#FFE9E7', color: '#E53935' }
    : disp > 6 ? { label: 'Rising', bg: '#FFF1EB', color: '#FA7C43' }
    : disp > 2 ? { label: 'Creep', bg: '#FFF6DF', color: '#F4A62A' }
    : { label: 'Stable', bg: '#E8F8F3', color: '#16A085' };

  const rainStatus = rain > 30 ? { label: 'Heavy', bg: '#FFE9E7', color: '#E53935' }
    : rain > 15 ? { label: 'Moderate', bg: '#E3F2FD', color: '#1565C0' }
    : rain > 3 ? { label: 'Light', bg: '#F0F7FF', color: '#2196F3' }
    : { label: 'Dry', bg: '#E8F8F3', color: '#16A085' };

  const tempStatus = (temp <= 2 && temp >= -2)
    ? { label: 'Freeze-Thaw', bg: '#FFF1EB', color: '#FA7C43' }
    : { label: 'Normal', bg: '#E8F8F3', color: '#16A085' };

  const metrics = [
    {
      label: 'Vibration',
      value: numVal(vib, 2),
      unit: 'mm/s',
      icon: Activity,
      status: vibStatus,
      desc: 'Peak Particle Velocity from haulage/blasting'
    },
    {
      label: 'Tilt',
      value: numVal(tilt, 2),
      unit: '°',
      icon: Compass,
      status: tiltStatus,
      desc: 'Biaxial rotational block inclination'
    },
    {
      label: 'Displacement',
      value: numVal(disp, 2),
      unit: 'mm',
      icon: Move,
      status: dispStatus,
      desc: 'Joint opening extensometer reading'
    },
    {
      label: 'Rainfall',
      value: numVal(rain, 1),
      unit: 'mm/h',
      icon: CloudRain,
      status: rainStatus,
      desc: 'Precipitation inducing pore-water pressure'
    },
    {
      label: 'Temperature',
      value: numVal(temp, 1),
      unit: '°C',
      icon: Thermometer,
      status: tempStatus,
      desc: 'Ambient thermal expansion / freeze cycle'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Radio size={18} color="#1565C0" />
            <span>Geotechnical Telemetry &amp; Environmental Sensor Streams</span>
          </h3>
          <div className="card-subtitle">
            Sector Node: <strong style={{ color: '#12355B' }}>{sensor.zone_id || zoneId}</strong> • Real-Time Telemetry Node
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: '#5F7285' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F9FD', padding: '4px 10px', borderRadius: '8px', border: '1px solid #D9E7F2' }}>
            <BatteryCharging size={14} color="#16A085" />
            <span style={{ fontWeight: 600, color: '#17324D' }}>{sensor.battery_level ?? 96}% Battery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F9FD', padding: '4px 10px', borderRadius: '8px', border: '1px solid #D9E7F2' }}>
            <Wifi size={14} color="#1565C0" />
            <span style={{ fontWeight: 600, color: '#17324D' }}>{sensor.signal_quality ?? 98}% Signal</span>
          </div>
        </div>
      </div>

      <div className="sensor-grid">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="sensor-metric-card">
              <div className="sensor-metric-label">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={16} color="#1565C0" />
                  <span style={{ color: '#17324D', fontWeight: 700 }}>{m.label}</span>
                </div>
                <span
                  className="sensor-status-tag"
                  style={{ background: m.status.bg, color: m.status.color }}
                >
                  {m.status.label}
                </span>
              </div>
              <div className="sensor-metric-value">
                {m.value}
                <span className="sensor-metric-unit">{m.unit}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#5F7285', marginTop: '6px', lineHeight: 1.35 }}>
                {m.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
