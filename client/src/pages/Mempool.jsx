// Mempool Page Component

import React from 'react';

const Mempool = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mempool Monitor</h1>
        <p className="page-subtitle">
          Real-time monitoring of pending transactions
        </p>
      </div>

      <div className="placeholder-content">
        <div className="placeholder-icon">🔍</div>
        <h2>Mempool Monitoring</h2>
        <p>This page will display real-time mempool data and transaction analysis.</p>
      </div>
    </div>
  );
};

export default Mempool;
