// client/src/components/dashboard/AlertsList.jsx

import React from 'react';
import './AlertsList.css';
// 1. THIS IS THE CORRECTED IMPORT PATH:
import { useWallet } from '../../context/WalletContext'; 

const AlertsList = ({ maxItems = 5 }) => {
  // 2. Get the live alerts directly from the context
  const { alerts } = useWallet();

  // 3. Slice the live alerts from the context
  const limitedAlerts = alerts.slice(0, maxItems);

  // 4. Update helpers to match context data ('High', 'Medium', 'Low')
  const getAlertIcon = (type) => {
    switch (type) {
      case 'High':
        return '🚨';
      case 'Medium':
        return '⚠️';
      case 'Low':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  // 5. Update helpers to match context data ('High', 'Medium', 'Low')
  const getAlertClass = (type) => {
    switch (type) {
      case 'High':
        return 'critical'; // Uses 'critical' class from your CSS
      case 'Medium':
        return 'warning'; // Uses 'warning' class from your CSS
      case 'Low':
        return 'info'; // Uses 'info' class
      default:
        return 'info';
    }
  };

  return (
    <div className="alerts-list-card">
      <div className="alerts-header">
        <h3 className="alerts-title">Recent Alerts</h3>
      </div>

      <div className="alerts-list">
        {/* 6. Add an empty state message */}
        {limitedAlerts.length === 0 && (
          <div className="alert-item info">
            <span className="alert-icon">📡</span>
            <div className="alert-content">
              <div className="alert-message">Listening for new alerts...</div>
            </div>
          </div>
        )}

        {limitedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item ${getAlertClass(alert.type)}`}
          >
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;