// Dashboard Page Component
// --- HYBRID DEMO: Reads from the Simulation Context ---

import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import TransactionChart from '../components/dashboard/TransactionChart';
import AlertsList from '../components/dashboard/AlertsList';
import SystemStatus from '../components/dashboard/SystemStatus';
import RiskMeter from '../components/dashboard/RiskMeter';
import { useWallet } from '../hooks/useWallet'; // Import useWallet
import './Dashboard.css';

const Dashboard = () => {
  // --- FIX: Read all data directly from the WalletContext ---
  const { alerts, chartData, riskMetrics } = useWallet();

  // --- We no longer need useState or useEffect for WebSocket ---

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          <span className="status-dot-green" />
          All security systems operational
        </p>
      </div>
      <div className="metrics-grid">
        <MetricCard
          label="SECURITY SCORE"
          value={riskMetrics.score}
          isAccent={true}
        />
        <MetricCard 
          label="ACTIVE THREATS" 
          value={riskMetrics.activeThreats}
          subtext="Blocked today"
        />
        <MetricCard 
          label="AVG GAS PRICE"
          value={chartData.length > 0 ? chartData[chartData.length-1].gasPrice.toFixed(0) : 45}
          subtext="Gwei" 
        />
        <MetricCard
          label="PROTECTED VALUE"
          value="$12.4K"
          subtext="Total secured"
        />
      </div>
      <TransactionChart data={chartData} />
      <div className="bottom-grid">
        <div className="bottom-left">
          <AlertsList alerts={alerts} />
        </div>
        <div className="bottom-right">
          <SystemStatus />
          <div style={{ marginTop: '20px' }}>
            <RiskMeter
              riskScore={riskMetrics.score}
              lowThreats={riskMetrics.low}
              mediumThreats={riskMetrics.medium}
              highThreats={riskMetrics.high}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;