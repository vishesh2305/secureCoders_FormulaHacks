// Alerts List Component

import React from 'react';
import { getTimeAgo } from '../../utils/formatters';
import { useTelemetry } from '../../hooks/useTelemetry';
import './AlertsList.css';

const AlertsList = ({ alerts = [], maxItems = 5 }) => {
  const { alerts: telemetryAlerts } = useTelemetry();

  const displayAlerts = alerts.length > 0 ? alerts : telemetryAlerts;
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
        {/* --- ADD EMPTY STATE --- */}
        {limitedAlerts.length === 0 && (
          <div className="alert-item info">
            <span className="alert-icon">ℹ️</span>
            <div className="alert-content">
              <div className="alert-message">No recent alerts. Monitoring...</div>
            </div>
          </div>
        )}
        {/* --- END ADD --- */}

        {limitedAlerts.map((alert) => (
          <div
            key={alert.id} // Use hash as key
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