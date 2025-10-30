// src/components/dashboard/DashboardPlaceholder.jsx

import React from 'react';
import '../../pages/Pages.css'; // For placeholder-content styles

const DashboardPlaceholder = () => {
  return (
    <div className="placeholder-content">
      <div className="placeholder-icon" style={{ fontSize: '100px' }}>
        🔌
      </div>
      <h2>Engine Idle: Wallet Disconnected</h2>
      <p style={{ maxWidth: '400px', margin: '15px auto' }}>
        Connect your Ethereum wallet to activate the F1 Security Dashboard, monitor your assets, and engage MEV protection systems.
      </p>
      {/* Visual indicator of an inactive circuit */}
      <div style={{ 
          height: '4px', 
          width: '100px', 
          backgroundColor: 'var(--f1-red-dark)', 
          margin: '20px auto 0', 
          borderRadius: '2px',
          opacity: 0.5
      }} />
    </div>
  );
};

export default DashboardPlaceholder;