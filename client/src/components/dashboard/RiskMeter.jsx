// Risk Meter Component (Radial Gauge)

import React from 'react';
import './RiskMeter.css';

const RiskMeter = ({
  riskScore = 35,
  lowThreats = 12,
  mediumThreats = 5,
  highThreats = 2,
}) => {
  // Determine risk color based on score
  const getRiskColor = () => {
    if (riskScore >= 67) return '#E10600'; // High risk - Red
    if (riskScore >= 34) return '#FFF200'; // Medium risk - Yellow
    return '#00D800'; // Low risk - Green
  };

  // Calculate needle rotation (0-180 degrees for half circle)
  const getNeedleRotation = () => {
    return (riskScore / 100) * 180;
  };

  const riskColor = getRiskColor();
  const needleRotation = getNeedleRotation();

  return (
    <div className="risk-meter-card">
      <div className="risk-meter-header">
        <h3 className="risk-meter-title">🚦 MEV RISK METER</h3>
      </div>

      <div className="risk-meter-gauge-container">
        <svg viewBox="0 0 200 120" className="risk-meter-svg">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#222"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Colored Arcs */}
          {/* Green Zone (0-33%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 73 34"
            fill="none"
            stroke="#00D800"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Yellow Zone (34-66%) */}
          <path
            d="M 73 34 A 80 80 0 0 1 127 34"
            fill="none"
            stroke="#FFF200"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Red Zone (67-100%) */}
          <path
            d="M 127 34 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E10600"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Needle */}
          <g
            transform={`rotate(${needleRotation - 90} 100 100)`}
            style={{ transition: 'transform 0.8s ease' }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={riskColor}
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 5px ${riskColor})`,
              }}
            />
            <circle cx="100" cy="100" r="6" fill={riskColor} />
          </g>
        </svg>

        {/* Center Display */}
        <div className="risk-meter-center">
          <div className="risk-score" style={{ color: riskColor }}>
            {riskScore}
          </div>
          <div className="risk-label">RISK SCORE</div>
        </div>
      </div>

      {/* Threat Stats */}
      <div className="threat-stats">
        <div className="threat-stat">
          <div className="threat-value low">{lowThreats}</div>
          <div className="threat-label">LOW</div>
        </div>
        <div className="threat-stat">
          <div className="threat-value medium">{mediumThreats}</div>
          <div className="threat-label">MEDIUM</div>
        </div>
        <div className="threat-stat">
          <div className="threat-value high">{highThreats}</div>
          <div className="threat-label">HIGH</div>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
