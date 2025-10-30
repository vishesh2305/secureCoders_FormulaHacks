// Metric Card Component

import React from 'react';
import './MetricCard.css';

const MetricCard = ({ label, value, subtext, change, isAccent = false }) => {
  return (
    <div className={`metric-card ${isAccent ? 'accent-card' : ''}`}>
      <div className="metric-accent-bar" />
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {change && <div className="metric-change">{change}</div>}
      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
};

export default MetricCard;
