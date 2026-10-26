import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Radio,
  Zap,
  Activity
} from 'lucide-react';

export default function SimulationControlPanel({
  simStatus,
  onStart,
  onPause,
  onReset,
  onScenarioChange,
  onSpeedChange,
  onManualTick,
  isProcessing
}) {
  const isRunning = simStatus?.is_running ?? false;
  const currentScenario = simStatus?.scenario || 'AUTOMATIC';
  const activeStage = simStatus?.active_stage || 'NORMAL';
  const currentSpeed = simStatus?.speed || '1x';
  const deviceId = simStatus?.device_id || 'ESP32-DEMO-01';
  const tickCount = simStatus?.tick_count ?? 0;

  const stageColorMap = {
    NORMAL: '#16A085',
    RAINFALL: '#F4A62A',
    MODERATE: '#F4A62A',
    INSTABILITY: '#FA7C43',
    HIGH: '#FA7C43',
    CRITICAL: '#E53935',
    RECOVERY: '#16A085'
  };

  const stageLabelMap = {
    NORMAL: 'Normal Conditions',
    RAINFALL: 'Increasing Rainfall',
    MODERATE: 'Increasing Rainfall',
    INSTABILITY: 'Slope Instability',
    HIGH: 'Slope Instability',
    CRITICAL: 'Critical Instability',
    RECOVERY: 'Stabilization & Recovery'
  };

  return (
    <div
      className="card"
      style={{
        border: '1px solid #D9E7F2',
        background: '#FFFFFF',
        boxShadow: '0 4px 18px rgba(30, 90, 140, 0.06)',
        marginBottom: '20px'
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #E8F0F7',
          paddingBottom: '12px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#E3F2FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1565C0'
            }}
          >
            <Cpu size={19} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#12355B', letterSpacing: '-0.01em' }}>
                VIRTUAL HARDWARE SIMULATION ENGINE
              </h3>
              <span
                style={{
                  background: '#FFF0EE',
                  border: '1px solid #FFC9B4',
                  color: '#FF6B61',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}
              >
                PROTOTYPE SIMULATOR
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5F7285', marginTop: '1px' }}>
              Autonomous telemetry generation feeding CNN-LSTM inference &amp; alert engine (Zero physical hardware required)
            </div>
          </div>
        </div>

        {/* Data Source Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F5F9FD',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px solid #D9E7F2'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#5F7285', fontWeight: 700, marginRight: '2px' }}>DATA SOURCE:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#16A085', fontWeight: 700, cursor: 'default' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A085', display: 'inline-block' }}></span>
            SIMULATION
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#7E92A2', cursor: 'not-allowed', marginLeft: '6px' }} title="Physical hardware integration ready for deployment">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #A0B2C2', display: 'inline-block' }}></span>
            HARDWARE (future)
          </label>
        </div>
      </div>

      {/* Main Status & Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          alignItems: 'center'
        }}
      >
        {/* Device Status */}
        <div
          style={{
            background: '#F5F9FD',
            border: '1px solid #D9E7F2',
            borderRadius: '10px',
            padding: '12px 14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: '#5F7285', fontWeight: 600 }}>SIMULATED DEVICE</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                color: '#16A085',
                fontWeight: 800
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A085' }}></span>
              ACTIVE
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#12355B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={15} color="#1565C0" />
            <span>{deviceId}</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#5F7285', marginTop: '3px' }}>
            Ticks: <strong style={{ color: '#17324D' }}>{tickCount}</strong> &bull; Spatial Grid: 4 Monitored Zones
          </div>
        </div>

        {/* Current State & Timeline Progression */}
        <div
          style={{
            background: '#F5F9FD',
            border: '1px solid #D9E7F2',
            borderRadius: '10px',
            padding: '12px 14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: '#5F7285', fontWeight: 600 }}>ACTIVE SIMULATION STAGE</span>
            <span style={{ fontSize: '0.7rem', color: '#1565C0', fontWeight: 700 }}>
              {currentScenario === 'AUTOMATIC' ? 'TIMELINE: AUTO' : 'FIXED SCENARIO'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                background: `${stageColorMap[activeStage] || '#1565C0'}18`,
                border: `1px solid ${stageColorMap[activeStage] || '#1565C0'}44`,
                color: stageColorMap[activeStage] || '#1565C0'
              }}
            >
              {activeStage}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#17324D', fontWeight: 700 }}>
              {stageLabelMap[activeStage] || activeStage}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#5F7285', marginTop: '4px' }}>
            {currentScenario === 'AUTOMATIC' ? 'Cycles: Normal → Rainfall → Instability → Critical → Recovery' : 'Fixed to selected scenario'}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isRunning ? (
              <button
                onClick={onStart}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '0.82rem',
                  background: 'linear-gradient(135deg, #16A085 0%, #117A65 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(22, 160, 133, 0.25)'
                }}
              >
                <Play size={14} fill="#FFFFFF" />
                <span>Start Simulation</span>
              </button>
            ) : (
              <button
                onClick={onPause}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '0.82rem',
                  background: '#FFF6DF',
                  border: '1px solid #FCD89C',
                  color: '#D97706',
                  fontWeight: 700,
                  borderRadius: '8px'
                }}
              >
                <Pause size={14} />
                <span>Pause Simulation</span>
              </button>
            )}

            <button
              onClick={onReset}
              disabled={isProcessing}
              className="btn-secondary"
              title="Reset simulation to nominal baseline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '9px 14px',
                fontSize: '0.82rem'
              }}
            >
              <RotateCcw size={14} color="#1565C0" />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={onManualTick}
            disabled={isProcessing}
            className="btn-secondary"
            style={{
              width: '100%',
              fontSize: '0.76rem',
              padding: '6px 10px',
              justifyContent: 'center',
              color: '#1565C0',
              borderColor: '#D9E7F2'
            }}
          >
            <Zap size={13} color="#1565C0" />
            <span>Manual Step Tick (Next Reading)</span>
          </button>
        </div>

        {/* Scenario & Speed Configuration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: '#F5F9FD',
            border: '1px solid #D9E7F2',
            borderRadius: '10px',
            padding: '10px 12px'
          }}
        >
          {/* Scenario Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#5F7285', fontWeight: 700 }}>SCENARIO:</span>
            <select
              value={currentScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              disabled={isProcessing}
              style={{
                background: '#FFFFFF',
                color: '#17324D',
                border: '1px solid #D9E7F2',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="AUTOMATIC">Automatic Progression</option>
              <option value="NORMAL">Normal Conditions (Low)</option>
              <option value="RAINFALL">Increasing Rainfall (Moderate)</option>
              <option value="INSTABILITY">Slope Instability (High)</option>
              <option value="CRITICAL">Critical Instability (Critical)</option>
            </select>
          </div>

          {/* Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#5F7285', fontWeight: 700 }}>SPEED:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['1x', '2x', '5x'].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  disabled={isProcessing}
                  style={{
                    background: currentSpeed === s ? '#1565C0' : '#FFFFFF',
                    color: currentSpeed === s ? '#FFFFFF' : '#5F7285',
                    border: '1px solid',
                    borderColor: currentSpeed === s ? '#1565C0' : '#D9E7F2',
                    borderRadius: '6px',
                    padding: '3px 9px',
                    fontSize: '0.74rem',
                    fontWeight: currentSpeed === s ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
