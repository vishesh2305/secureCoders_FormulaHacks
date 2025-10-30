// Protection Page Component
// --- MODIFIED TO INCLUDE OUR SWAP PANEL ---

import React from 'react';
import RiskMeter from '../components/dashboard/RiskMeter';
import { SwapPanel } from '../components/dashboard/SwapPanel'; // Import our new component

const Protection = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">MEV Protection</h1>
        <p className="page-subtitle">
          Advanced protection against MEV attacks
        </p>
      </div>

      {/* Use a grid to show the Risk Meter and Swap Panel side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        
        {/* Our new Swap Panel */}
        <SwapPanel />

        {/* Your existing Risk Meter */}
        <RiskMeter
          riskScore={35} // This is still mock data, we'll hook it up next
          lowThreats={12}
          mediumThreats={5}
          highThreats={2}
        />
      </div>

    </div>
  );
};

export default Protection;