// src/pages/SecureDAppDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import AlertsList from '../components/dashboard/AlertsList';
import SystemStatus from '../components/dashboard/SystemStatus';
import RiskMeter from '../components/dashboard/RiskMeter';
import TransactionChart from '../components/dashboard/TransactionChart';
import { shortenAddress } from '../utils/formatters';

const SecureDAppDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState(null); // Changed default to null
  const [protectionStatus, setProtectionStatus] = useState(false);

  useEffect(() => {
    // Check if contract address was passed in state and is valid (>= 40 chars for hex address)
    if (location.state && location.state.contractAddress && location.state.contractAddress.length >= 40) {
      setContractAddress(location.state.contractAddress);
      setProtectionStatus(location.state.isProtecting);
    } else {
      // If no valid contract address is found, redirect to landing page
      // where the user can input one via the SecureDAppInterface
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Render nothing or a loading state while the redirect is happening
  if (!contractAddress) {
    return null;
  }

  const mockAlerts = [
    { id: 101, type: 'critical', message: 'Vulnerability: Reentrancy Check Failed', timestamp: Date.now() - 3600000 },
    { id: 102, type: 'warning', message: 'Risk: High Gas Limit Exposure', timestamp: Date.now() - 7200000 },
    { id: 103, type: 'resolved', message: 'Audit: Dependency versions verified', timestamp: Date.now() - 10800000 },
    { id: 104, type: 'info', message: 'Storage slots verified', timestamp: Date.now() - 14400000 },
  ];

  return (
    <>
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            Contract Analysis: {shortenAddress(contractAddress, 10, 8)}
          </h1>
          <p className="page-subtitle">
            <span className={`status-dot-${protectionStatus ? 'green' : 'red'}`} />
            MEV Shield Preview: {protectionStatus ? 'ACTIVE' : 'INACTIVE'}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <MetricCard
            label="SECURITY GRADE"
            value="C+"
            change="▼ -0.5 from audit"
            isAccent={true}
          />
          <MetricCard label="FLAW SEVERITY" value="HIGH" subtext="1 Critical Vulnerability" />
          <MetricCard label="TOTAL TX BLOCKED" value="1,240" subtext="MEV attempts preempted" />
          <MetricCard
            label="AUDIT SCORE"
            value="78%"
            subtext="Based on static analysis"
          />
        </div>

        {/* Transaction Chart (Mocking DApp Tx Volume) */}
        <div style={{ marginBottom: '20px' }}>
            <TransactionChart loading={false} />
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          {/* Left Column */}
          <div className="bottom-left">
            <AlertsList alerts={mockAlerts} maxItems={10} />
          </div>

          {/* Right Column */}
          <div className="bottom-right">
            <SystemStatus />
            <div style={{ marginTop: '20px' }}>
              <RiskMeter
                riskScore={75} // High risk mock for a contract analysis
                lowThreats={5}
                mediumThreats={10}
                highThreats={3}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecureDAppDashboard;