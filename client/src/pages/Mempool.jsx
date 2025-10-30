// Mempool Monitoring Page
// --- HYBRID DEMO: Reads from the Simulation Context ---

import React from 'react';
import { useWallet } from '../hooks/useWallet'; // Import useWallet

const Mempool = () => {
  // --- FIX: Read live alert data from the WalletContext ---
  const { alerts } = useWallet();
  const mempoolTxs = alerts; // We'll just re-use the alerts list

  const getRiskColor = (risk) => {
    if (risk === 'High' || risk === 'critical') return 'risk-high';
    if (risk === 'Medium' || risk === 'warning') return 'risk-medium';
    return 'risk-low';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Live Mempool Monitor</h1>
        <p className="page-subtitle">
          Real-time feed of F1T token transactions
        </p>
      </div>

      <div className="mempool-table-container">
        <table className="mempool-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Transaction Hash</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {mempoolTxs.length === 0 && (
              <tr>
                <td colSpan="3">Listening for transactions...</td>
              </tr>
            )}
            {mempoolTxs.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <span className={`risk-badge ${getRiskColor(tx.type)}`}>
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="hash-cell">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${tx.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {`${tx.id.substring(0, 8)}...${tx.id.substring(tx.id.length - 6)}`}
                  </a>
                </td>
                <td>{tx.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mempool;