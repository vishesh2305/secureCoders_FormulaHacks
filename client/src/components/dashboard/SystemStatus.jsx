// System Status Component

import React from 'react';
import './SystemStatus.css';

const SystemStatus = () => {
  const statusItems = [
    {
      id: 1,
      label: 'Blockchain Connection',
      status: 'active',
      description: 'Mainnet connected',
    },
    {
      id: 2,
      label: 'Mempool Monitor',
      status: 'active',
      description: 'Monitoring 1,234 txs/min',
    },
    {
      id: 3,
      label: 'AI Detection',
      status: 'active',
      description: 'Neural network active',
    },
    {
      id: 4,
      label: 'Flashbots Relay',
      status: 'warning',
      description: 'High latency detected',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'var(--f1-green)';
      case 'warning':
        return 'var(--f1-yellow)';
      case 'error':
        return 'var(--f1-red)';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'ACTIVE';
      case 'warning':
        return 'WARNING';
      case 'error':
        return 'ERROR';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <div className="system-status-card">
      <div className="status-header">
        <h3 className="status-title">System Status</h3>
      </div>

      <div className="status-list">
        {statusItems.map((item) => (
          <div key={item.id} className="status-item">
            <div className="status-info">
              <div className="status-label">{item.label}</div>
              <div className="status-description">{item.description}</div>
            </div>
            <div className="status-indicator">
              <span
                className="status-dot"
                style={{ backgroundColor: getStatusColor(item.status) }}
              />
              <span
                className="status-text"
                style={{ color: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
