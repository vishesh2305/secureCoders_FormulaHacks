// client/src/components/dashboard/TransactionChart.jsx

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './TransactionChart.css';

// 1. Updated Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        {/* We don't have a real timestamp, so we'll show Gwei, Threat, and ETH Value */}
        <p className="tooltip-item" style={{ color: '#E10600' }}>
          Gas Price: {data.gasPrice.toFixed(2)} Gwei
        </p>
        <p className="tooltip-item" style={{ color: '#FFF200' }}>
          Threat Level: {data.threatLevel}
        </p>
        <p className="tooltip-item" style={{ color: '#00D800' }}>
          TX Volume: {data.txVolume.toFixed(4)} ETH
        </p>
      </div>
    );
  }
  return null;
};

// 2. Renamed 'data' prop to 'chartData' to match Analytics.jsx
const TransactionChart = ({ chartData = [], loading = false }) => {
  
  // 3. Process the 'alerts' array to make it chartable
  const processedData = useMemo(() => {
    const gasRegex = /\(([\d.]+) Gwei\)/;
    const valueRegex = /for ([\d.]+) ETH/;

    // Map the alerts array, parse strings, and create chart data
    return chartData
      .map((alert) => {
        const gasMatch = alert.message.match(gasRegex);
        const valueMatch = alert.message.match(valueRegex);

        const gas = gasMatch ? parseFloat(gasMatch[1]) : 0;
        const value = valueMatch ? parseFloat(valueMatch[1]) : 0;

        let threat;
        // Scale threat level for better visibility on the chart
        if (alert.type === 'High') threat = 30;
        else if (alert.type === 'Medium') threat = 20;
        else threat = 10;

        return {
          // We use the ID hash (shortened) for the X-axis key
          timestamp: `${alert.id.substring(0, 4)}...`, 
          gasPrice: gas,
          threatLevel: threat,
          txVolume: value,
        };
      })
      .reverse(); // Reverse to get chronological order (oldest first)
  }, [chartData]);

  if (loading) {
    return (
      <div className="transaction-chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Live Transaction Monitor</h3>
        </div>
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  // 4. Add an empty state
  if (processedData.length === 0) {
    return (
      <div className="transaction-chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Live Transaction Monitor</h3>
        </div>
        <div className="chart-loading">
          📡 Listening for transaction data...
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Live Transaction Monitor</h3>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            // 5. Use the processedData
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientGas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E10600" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#E10600" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientThreat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFF200" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FFF200" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D800" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D800" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis
              // 6. Data key is now 'timestamp' (the shortened hash)
              dataKey="timestamp"
              stroke="#999"
              style={{ fontSize: '10px' }} // Smaller font for hash
              interval={Math.floor(processedData.length / 10)} // Show ~10 ticks
            />

            <YAxis
              stroke="#999"
              style={{ fontSize: '12px' }}
              // 7. Add Y-axis domain for better scaling
              yAxisId="left"
              orientation="left"
              domain={[0, 'dataMax + 10']}
            />
            <YAxis
              stroke="#999"
              style={{ fontSize: '12px' }}
              yAxisId="right"
              orientation="right"
              domain={[0, 'dataMax + 1']}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />

            {/* 8. Map Area data keys to the correct Y-axis */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="gasPrice"
              name="Gas Price (Gwei)"
              stroke="#E10600"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradientGas)"
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="threatLevel"
              name="Threat Level"
              stroke="#FFF200"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradientThreat)"
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="txVolume"
              name="TX Volume (ETH)"
              stroke="#00D800"
              strokeWidth={2}
              fillOpacity={1}
            fill="url(#gradientVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;