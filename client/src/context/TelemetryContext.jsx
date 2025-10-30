// src/context/TelemetryContext.jsx

import React, { createContext, useState, useEffect, useRef } from 'react';

export const TelemetryContext = createContext(null);

export const TelemetryProvider = ({ children }) => {
  // State for the raw alert events
  const [alerts, setAlerts] = useState([]);
  
  // State for the time-series chart data
  const [chartData, setChartData] = useState([]);
  
  // State for the header's live gas price
  const [latestGasPrice, setLatestGasPrice] = useState(0);
  
  // State for the connection status
  const [isTelemetryConnected, setIsTelemetryConnected] = useState(false);

  // Use refs to manage the WebSocket and a queue for chart data
  const ws = useRef(null);
  const txQueue = useRef([]);

  useEffect(() => {
    // Connect to the WebSocket server
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('📡 Telemetry WebSocket Connected');
      setIsTelemetryConnected(true);
    };

    ws.current.onclose = () => {
      console.log('📡 Telemetry WebSocket Disconnected');
      setIsTelemetryConnected(false);
    };

    ws.current.onmessage = (event) => {
      // --- NEW: Add this log for debugging
      console.log("[WebSocket] Received:", event.data);

      try {
        const data = JSON.parse(event.data);

        // --- NEW LOGIC: Handle snapshot (Array) or single alert (Object) ---
        if (Array.isArray(data)) {
          // This is the initial snapshot of recent alerts
          setAlerts(data);
        } else {
          // This is a single new, live alert
          // Add to alerts state (keeping only the latest 20)
          setAlerts((prevAlerts) => [data, ...prevAlerts].slice(0, 20));

          // 2. Update the live gas price
          setLatestGasPrice(Math.round(parseFloat(data.gas)));

          // 3. Add data to the queue for chart aggregation
          txQueue.current.push(data);
        }
        // --- END NEW LOGIC ---

      } catch (error) {
        console.error('Failed to parse telemetry message:', error);
      }
    };

    // This interval aggregates transactions from the queue every 3 seconds
    const chartInterval = setInterval(() => {
      if (txQueue.current.length === 0) {
        return;
      }

      const txsInInterval = [...txQueue.current];
      txQueue.current = [];

      const avgGas = txsInInterval.reduce((acc, tx) => acc + parseFloat(tx.gas), 0) / txsInInterval.length;
      const highRiskCount = txsInInterval.filter(t => t.type === 'critical').length; // Use 'type'
      const txVolume = txsInInterval.length;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newDataPoint = {
        timestamp,
        gasPrice: Math.round(avgGas),
        threatLevel: highRiskCount,
        txVolume,
      };

      setChartData((prevData) => [...prevData, newDataPoint].slice(-30));

    }, 3000); // Aggregate data every 3 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(chartInterval);
      ws.current.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  const value = {
    alerts,
    chartData,
    latestGasPrice,
    isTelemetryConnected,
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};