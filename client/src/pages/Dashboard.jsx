// Dashboard Page Component
// --- MODIFIED TO CONNECT TO LIVE TELEMETRY ---

import React, { useState, useEffect } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import TransactionChart from '../components/dashboard/TransactionChart';
import AlertsList from '../components/dashboard/AlertsList';
import SystemStatus from '../components/dashboard/SystemStatus';
import RiskMeter from '../components/dashboard/RiskMeter';
import { TELEMETRY_WEBSOCKET_URL } from '../constants'; // Import our URL
import './Dashboard.css';

const Dashboard = () => {
  // State for live data
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState({
    score: 35,
    low: 12,
    medium: 5,
    high: 2,
    activeThreats: 3
  });

  // Connect to the telemetry WebSocket
  useEffect(() => {
    const ws = new WebSocket(TELEMETRY_WEBSOCKET_URL);
    
    ws.onopen = () => console.log("Telemetry WebSocket connected.");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Telemetry Data Received:", data);

      // --- 1. Update Alerts List ---
      const newAlert = {
        id: data.hash,
        type: data.risk === 'High' ? 'critical' : 'warning',
        message: `New swap detected (${data.value} ETH) with ${data.risk} risk.`,
        timestamp: Date.now(),
      };
      // Add new alert to the top, keep last 10
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);

      // --- 2. Update Transaction Chart ---
      const newChartEntry = {
        timestamp: new Date().toLocaleTimeString(),
        gasPrice: parseFloat(data.gas),
        threatLevel: data.risk === 'High' ? 80 : (data.risk === 'Medium' ? 50 : 20),
        txVolume: parseFloat(data.value),
      };
      // Add new data, keep last 20 entries
      setChartData((prev) => [...prev.slice(-19), newChartEntry]);

      // --- 3. Update Risk Meter & Metrics ---
      setRiskMetrics((prev) => {
        let newScore = prev.score;
        if(data.risk === 'High') newScore = Math.min(prev.score + 5, 90);
        else if (data.risk === 'Medium') newScore = Math.min(prev.score + 2, 70);
        else newScore = Math.max(prev.score - 1, 10);

        return {
          score: newScore,
          low: data.risk === 'Low' ? prev.low + 1 : prev.low,
          medium: data.risk === 'Medium' ? prev.medium + 1 : prev.medium,
          high: data.risk === 'High' ? prev.high + 1 : prev.high,
          activeThreats: data.risk === 'High' ? prev.activeThreats + 1 : prev.activeThreats,
        }
      });
    };

    ws.onclose = () => console.log("Telemetry WebSocket disconnected.");
    
    // Cleanup on component unmount
    return () => ws.close();
  }, []); // Empty array ensures this runs once

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          <span className="status-dot-green" />
          All security systems operational
        </p>
      </div>

      {/* Metrics Grid (now with live data) */}
      <div className="metrics-grid">
        <MetricCard
          label="SECURITY SCORE"
          value={riskMetrics.score}
          isAccent={true}
        />
        <MetricCard 
          label="ACTIVE THREATS" 
          value={riskMetrics.activeThreats}
          subtext="Blocked today"
        />
        <MetricCard 
          label="AVG GAS PRICE"
          value={chartData.length > 0 ? chartData[chartData.length-1].gasPrice.toFixed(0) : 45}
          subtext="Gwei" 
        />
        <MetricCard
          label="PROTECTED VALUE"
          value="$12.4K"
          subtext="Total secured"
        />
      </div>

      {/* Transaction Chart (now with live data) */}
      <TransactionChart data={chartData} />

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Left Column (now with live data) */}
        <div className="bottom-left">
          <AlertsList alerts={alerts} />
        </div>

        {/* Right Column */}
        <div className="bottom-right">
          <SystemStatus />
          <div style={{ marginTop: '20px' }}>
            <RiskMeter
              riskScore={riskMetrics.score}
              lowThreats={riskMetrics.low}
              mediumThreats={riskMetrics.medium}
              highThreats={riskMetrics.high}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;