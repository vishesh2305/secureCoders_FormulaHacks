// Alerts List Component

import React from 'react';
import { getTimeAgo } from '../../utils/formatters';
import './AlertsList.css';

const AlertsList = ({ alerts = [], maxItems = 5 }) => {
  // Mock alerts if none provided
  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High gas price detected: 250 Gwei',
      timestamp: Date.now() - 300000,
    },
    {
      id: 2,
      type: 'critical',
      message: 'Potential sandwich attack blocked',
      timestamp: Date.now() - 600000,
    },
    {
      id: 3,
      type: 'resolved',
      message: 'Network congestion cleared',
      timestamp: Date.now() - 900000,
    },
    {
      id: 4,
      type: 'warning',
      message: 'Unusual transaction pattern detected',
      timestamp: Date.now() - 1200000,
    },
    {
      id: 5,
      type: 'resolved',
      message: 'Smart contract audit completed',
      timestamp: Date.now() - 1500000,
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;
  const limitedAlerts = displayAlerts.slice(0, maxItems);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'resolved':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'critical':
        return 'critical';
      case 'warning':
        return 'warning';
      case 'resolved':
        return 'resolved';
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
        {limitedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item ${getAlertClass(alert.type)}`}
          >
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{getTimeAgo(alert.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
