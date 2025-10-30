// client/src/pages/Analytics.jsx

import React from 'react';
import TransactionChart from '../components/dashboard/TransactionChart';
import { useWallet } from '../context/WalletContext'; // 1. Import the useWallet hook

const Analytics = () => {
  const { alerts } = useWallet();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Security Analytics</h1>
        <p className="page-subtitle">
          Advanced analytics and reporting
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <TransactionChart chartData={alerts} />
      </div>

      <div className="placeholder-content" style={{ marginTop: '40px' }}>
        <div className="placeholder-icon">📈</div>
        <p>Detailed security analytics and historical data visualization.</p>
        {alerts.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
            Waiting for transaction data...
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;