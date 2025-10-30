// src/pages/Mempool.jsx

import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useTelemetry } from '../hooks/useTelemetry'; // IMPORT
import DashboardPlaceholder from '../components/dashboard/DashboardPlaceholder';
import { shortenAddress } from '../utils/formatters'; // Removed unused formatters
import './Mempool.css'; // IMPORT CSS

// Helper component
const RiskTag = ({ type }) => {
  const text = type === 'critical' ? 'High Risk' : (type === 'warning' ? 'Med Risk' : 'Low Risk');
  return <span className={`risk-tag ${type}`}>{text}</span>;
};

const Mempool = () => {
  const { isConnected } = useWallet();
  const { alerts } = useTelemetry(); // GET LIVE ALERTS

  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Mempool Monitor</h1>
          <p className="page-subtitle">
            Wallet required for real-time monitoring
          </p>
        </div>
        <DashboardPlaceholder />
      </>
    );
  }

  return (
    <div className="page-container mempool-container">
      <div className="page-header">
        <h1 className="page-title">Mempool Monitor</h1>
        <p className="page-subtitle">
          Real-time feed of detected Uniswap transactions
        </p>
      </div>

      <div className="mempool-table-container">
        <table className="mempool-table">
          <thead>
            <tr>
              <th>Hash (ID)</th>
              <th>Risk</th>
              <th>Value (ETH)</th>
              <th>Gas (Gwei)</th>
              <th>Full Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="5" className="mempool-empty-state">
                  📡 Waiting for telemetry data...
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{shortenAddress(alert.id, 6, 4)}</td>
                  <td>
                    <RiskTag type={alert.type} />
                  </td>
                  {/* --- NEW: Read from object properties --- */}
                  <td>{Number(alert.value).toFixed(4)}</td>
                  <td>{alert.gas}</td>
                  {/* --- END NEW --- */}
                  <td>{alert.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mempool;