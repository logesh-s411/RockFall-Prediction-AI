import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Zones from './pages/Zones';
import Sensors from './pages/Sensors';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchDashboardSummary, fetchSystemStatus, triggerSensorTick, setDemoScenario } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [activeScenario, setActiveScenario] = useState('DEFAULT');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSummaryAndStatus = async () => {
    try {
      const [sumData, statusData] = await Promise.all([
        fetchDashboardSummary(),
        fetchSystemStatus()
      ]);
      setSummary(sumData);
      setSystemStatus(statusData);
    } catch (err) {
      console.warn('Dashboard poll error:', err.message);
    }
  };

  useEffect(() => {
    loadSummaryAndStatus();
    const interval = setInterval(loadSummaryAndStatus, 15000); // 15s polling
    return () => clearInterval(interval);
  }, []);

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (activeScenario !== 'DEFAULT') {
        await setDemoScenario(activeScenario);
      } else {
        await triggerSensorTick();
      }
      await loadSummaryAndStatus();
      setRefreshKey((k) => k + 1); // trigger reload across active page
    } catch (err) {
      console.error('Telemetry refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleScenarioChange = async (scenario) => {
    setActiveScenario(scenario);
    setIsRefreshing(true);
    try {
      if (scenario !== 'DEFAULT') {
        await setDemoScenario(scenario);
      } else {
        await triggerSensorTick();
      }
      await loadSummaryAndStatus();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Scenario injection error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard key={refreshKey} onNavigateToPage={setActivePage} systemStatus={systemStatus} />;
      case 'zones':
        return <Zones key={refreshKey} />;
      case 'sensors':
        return <Sensors key={refreshKey} />;
      case 'predictions':
        return <Predictions key={refreshKey} />;
      case 'alerts':
        return <Alerts key={refreshKey} />;
      case 'reports':
        return <Reports key={refreshKey} />;
      case 'settings':
        return <Settings key={refreshKey} />;
      default:
        return <Dashboard key={refreshKey} onNavigateToPage={setActivePage} systemStatus={systemStatus} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        activeAlertCount={summary?.active_alerts_count || 0}
      />

      <div className="main-content">
        <Header
          summary={summary}
          systemStatus={systemStatus}
          onRefresh={handleGlobalRefresh}
          isRefreshing={isRefreshing}
          onSelectScenario={handleScenarioChange}
          activeScenario={activeScenario}
        />

        <main className="content-body">
          <ErrorBoundary
            key={activePage}
            fallbackTitle={`${activePage.charAt(0).toUpperCase() + activePage.slice(1)} View Error`}
            fallbackMessage={`An unexpected issue occurred while rendering the ${activePage} section. You can retry this view or select another sector from the navigation menu.`}
          >
            {renderActivePage()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
