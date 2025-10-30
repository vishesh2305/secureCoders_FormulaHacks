// Analytics Page Component

import React from 'react';
import TransactionChart from '../components/dashboard/TransactionChart';
import { useWallet } from '../hooks/useWallet';
import DashboardPlaceholder from '../components/dashboard/DashboardPlaceholder';

const Analytics = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Security Analytics</h1>
          <p className="page-subtitle">
            Wallet required for advanced analytics
          </p>
        </div>
        <DashboardPlaceholder />
      </>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Security Analytics</h1>
        <p className="page-subtitle">
          Advanced analytics and reporting
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <TransactionChart />
      </div>

      <div className="placeholder-content" style={{ marginTop: '40px' }}>
        <div className="placeholder-icon">⟘</div> {/* Updated from 📈 */}
        <p>Detailed security analytics and historical data visualization.</p>
      </div>
    </div>
  );
};

export default Analytics;