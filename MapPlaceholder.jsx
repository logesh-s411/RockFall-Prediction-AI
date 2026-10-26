import React from 'react';
import { Mountain, Compass, MapPin, Layers, Satellite, Database, CheckCircle2 } from 'lucide-react';

export default function MapPlaceholder({ zones, selectedZoneId, onSelectZone }) {
  const sources = [
    { name: 'Digital Elevation Model (DEM)', type: 'Spatial 3D Mesh', status: 'Active (16x16 Grid)' },
    { name: 'Satellite InSAR Radar', type: 'Displacement Raster', status: 'Intermittent Pass' },
    { name: 'UAV / Drone Photogrammetry', type: 'High-Res Orthomosaic', status: 'Weekly Sweep' },
    { name: 'Geotechnical Borehole & Extensometer', type: 'Continuous Wire Mesh', status: 'Streaming Live' },
    { name: 'Meteorological Weather Feed', type: 'Precipitation & Temp', status: 'Synchronized' }
  ];

  const levelColorMap = {
    LOW: '#16A085',
    MODERATE: '#F4A62A',
    HIGH: '#FA7C43',
    CRITICAL: '#E53935'
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Compass size={18} color="#1565C0" />
            <span>Mine Area Overview &amp; Terrain Spatial Topology</span>
          </h3>
          <div className="card-subtitle">
            Open-Pit Mine Sector Matrix &bull; Interactive 4-Zone Georeferenced Spatial Plan
          </div>
        </div>
        <span className="demo-pill">SPATIAL TELEMETRY GRID</span>
      </div>

      <div className="terrain-container">
        {/* Visual Map Grid */}
        <div className="terrain-visual">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#12355B', fontWeight: 700 }}>
              <Mountain size={16} color="#1565C0" />
              <span>Monitored Highwall Sectors Plan</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#5F7285', fontWeight: 500 }}>
              Coordinate Frame: WGS84 • Elevation Datum: 600m – 1200m
            </div>
          </div>

          <div className="terrain-grid-mock">
            {(zones || []).map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const level = zone.last_risk_level || 'LOW';
              const color = levelColorMap[level] || '#16A085';

              return (
                <div
                  key={zone.id}
                  className={`terrain-zone-box ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectZone && onSelectZone(zone.id)}
                  style={{
                    borderLeft: `5px solid ${color}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#12355B', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} color={color} />
                        <span>{zone.id}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#5F7285', marginTop: '2px' }}>
                        {zone.name}
                      </div>
                    </div>
                    <span className={`risk-badge ${level}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                      {level}
                    </span>
                  </div>

                  <div style={{ margin: '12px 0 8px 0', fontSize: '0.8rem', color: '#5F7285' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Slope Angle:</span>
                      <strong style={{ color: '#17324D' }}>{zone.slope_angle}°</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>Elevation:</span>
                      <strong style={{ color: '#17324D' }}>{zone.elevation}m</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Lithology:</span>
                      <span style={{ color: '#1565C0', fontWeight: 600 }}>{zone.geological_type}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.74rem',
                      color: '#5F7285',
                      borderTop: '1px solid #D9E7F2',
                      paddingTop: '8px',
                      marginTop: '6px'
                    }}
                  >
                    <span>
                      Risk Score: <strong style={{ color: color }}>{Number(zone.last_risk_score || 0).toFixed(1)}/100</strong>
                    </span>
                    <span style={{ color: isSelected ? '#1565C0' : '#7E92A2', fontWeight: 700 }}>
                      {isSelected ? '● Inspected' : 'Click to inspect'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.74rem', color: '#5F7285', marginTop: '14px', textAlign: 'center', background: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #D9E7F2' }}>
            Multi-spectral spatial inputs are mapped directly into the CNN feature extractor as 16x16 DEM elevation matrices.
          </div>
        </div>

        {/* Data Sources Ingestion Status */}
        <div className="terrain-sources-list">
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#12355B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={15} color="#1565C0" />
            <span>Integrated Ingestion Feeds</span>
          </div>
          {sources.map((s, idx) => (
            <div key={idx} className="source-item">
              <div>
                <div style={{ fontWeight: 700, color: '#17324D' }}>{s.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#5F7285' }}>{s.type}</div>
              </div>
              <span className="source-badge">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
