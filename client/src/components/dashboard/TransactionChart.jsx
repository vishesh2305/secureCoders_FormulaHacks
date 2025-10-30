// Transaction Chart Component (Recharts)

import React from 'react';
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
import { useTelemetry } from '../../hooks/useTelemetry';


const TransactionChart = ({ data = [], loading = false }) => {
  const { chartData } = useTelemetry();
  const displayData = chartData.length > 0 ? chartData : [];
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{payload[0].payload.timestamp}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {


    if (displayData.length === 0) {
      return (
        <div className="transaction-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Live Transaction Monitor</h3>
          </div>
          <div className="chart-loading">📡 Waiting for telemetry data...</div>
        </div>
      );
    }

    return (
      <div className="transaction-chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Live Transaction Monitor</h3>
        </div>
        <div className="chart-loading">Loading chart data...</div>
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
            data={displayData}
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
              dataKey="timestamp"
              stroke="#999"
              style={{ fontSize: '12px' }}
            />

            <YAxis stroke="#999" style={{ fontSize: '12px' }} />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />

            <Area
              type="monotone"
              dataKey="gasPrice"
              name="Gas Price"
              stroke="#E10600"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradientGas)"
            />

            <Area
              type="monotone"
              dataKey="threatLevel"
              name="Threat Level"
              stroke="#FFF200"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gradientThreat)"
            />

            <Area
              type="monotone"
              dataKey="txVolume"
              name="TX Volume"
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
