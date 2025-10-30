// Dashboard Page Component

import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import TransactionChart from '../components/dashboard/TransactionChart';
import AlertsList from '../components/dashboard/AlertsList';
import SystemStatus from '../components/dashboard/SystemStatus';
import RiskMeter from '../components/dashboard/RiskMeter';
import DashboardPlaceholder from '../components/dashboard/DashboardPlaceholder';
import { useWallet } from '../hooks/useWallet';
import './Dashboard.css';

const Dashboard = () => {
  const { isConnected } = useWallet();

  // Show placeholder if not connected
  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">
            <span className="status-dot-red" />
            Security systems offline
          </p>
        </div>
        <DashboardPlaceholder />
      </>
    );
  }

  // --- Render full dashboard when connected ---
  return (
    <div className="dashboard-page ">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          <span className="status-dot-green" />
          All security systems operational
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard
          label="SECURITY SCORE"
          value="85"
          change="▲ +5 from yesterday"
          isAccent={true}
        />
        <MetricCard label="ACTIVE THREATS" value="3" subtext="Blocked today" />
        <MetricCard label="AVG GAS PRICE" value="45" subtext="Gwei" />
        <MetricCard
          label="PROTECTED VALUE"
          value="$12.4K"
          subtext="Total secured"
        />
      </div>

      {/* Transaction Chart */}
      <TransactionChart />

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Left Column */}
        <div className="bottom-left">
          <AlertsList />
        </div>

        {/* Right Column */}
        <div className="bottom-right">
          <SystemStatus />
          <div style={{ marginTop: '20px' }}>
            <RiskMeter
              riskScore={35}
              lowThreats={12}
              mediumThreats={5}
              highThreats={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;