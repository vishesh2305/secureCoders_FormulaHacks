// Alerts Page Component

import React from 'react';
import AlertsList from '../components/dashboard/AlertsList';
import { useWallet } from '../hooks/useWallet';
import DashboardPlaceholder from '../components/dashboard/DashboardPlaceholder';

const Alerts = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Security Alerts</h1>
          <p className="page-subtitle">
            Wallet required to view personal alerts
          </p>
        </div>
        <DashboardPlaceholder />
      </>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Security Alerts</h1>
        <p className="page-subtitle">
          View and manage security alerts
        </p>
      </div>

      <div style={{ maxWidth: '800px', marginTop: '30px' }}>
        <AlertsList maxItems={10} />
      </div>
    </div>
  );
};

export default Alerts;