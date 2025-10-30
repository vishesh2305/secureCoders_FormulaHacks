// client/src/pages/Dashboard.jsx

import React from 'react';
import './Dashboard.css';
import { useWallet } from '../context/WalletContext'; // 1. Use correct import path

// Import dashboard components
import MetricCard from '../components/dashboard/MetricCard';
import RiskMeter from '../components/dashboard/RiskMeter';
import AlertsList from '../components/dashboard/AlertsList';
import TransactionChart from '../components/dashboard/TransactionChart';
import SystemStatus from '../components/dashboard/SystemStatus';

// Helper icons (simple example)
const HighThreatIcon = () => '🚨';
const MediumThreatIcon = () => '⚠️';
const LowThreatIcon = () => 'ℹ️';

const Dashboard = () => {
  // 2. Get all the LIVE data from our new WalletContext
  const {
    address,
    alerts,
    riskScore,
    highThreats,
    mediumThreats,
    lowThreats,
    isWsConnected, // Get WebSocket status
  } = useWallet();

  // This function prevents the "Cannot read properties of undefined" error
  // by providing a default value if the user's address is still loading.
  const getGreeting = () => {
    if (address) {
      return `Welcome, ${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return 'Welcome to your Security Dashboard';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{getGreeting()}</h1>
        <p className="page-subtitle">
          Real-time MEV threat monitoring and protection
        </p>
      </div>

      {/* 3. Add the SystemStatus component */}
      <SystemStatus isWsConnected={isWsConnected} />

      {/* --- Main Dashboard Grid --- */}
      <div className="dashboard-grid">
        {/* 4. Main Risk Meter (uses live data) */}
        <div className="grid-item grid-span-2">
          <RiskMeter
            riskScore={riskScore}
            highThreats={highThreats}
            mediumThreats={mediumThreats}
            lowThreats={lowThreats}
          />
        </div>

        {/* 5. Threat Metric Cards (use live data) */}
        <div className="grid-item">
          <MetricCard
            title="High Threats"
            value={highThreats}
            icon={<HighThreatIcon />}
            trend={highThreats > 0 ? 'up' : 'none'}
            trendLabel="High risk"
          />
        </div>
        <div className="grid-item">
          <MetricCard
            title="Medium Threats"
            value={mediumThreats}
            icon={<MediumThreatIcon />}
            trend="none"
          />
        </div>
        <div className="grid-item">
          <MetricCard
            title="Low Threats"
            value={lowThreats}
            icon={<LowThreatIcon />}
            trend="none"
          />
        </div>

        {/* 6. Recent Alerts (gets data from context automatically) */}
        <div className="grid-item grid-span-2">
          <AlertsList maxItems={5} />
        </div>

        {/* 7. Transaction Chart (uses live 'alerts' data) */}
        <div className="grid-item grid-span-3">
          <TransactionChart chartData={alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;