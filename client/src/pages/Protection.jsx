// ... imports
import React from 'react';
import RiskMeter from '../components/dashboard/RiskMeter';
import { SwapPanel } from '../components/dashboard/SwapPanel';
import { useWallet } from '../context/WalletContext';
const Protection = () => {
  // 2. Get the live data from the context
  const { riskScore, lowThreats, mediumThreats, highThreats } = useWallet();

  return (
    <div className="page-container">
      {/* ... page header ... */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        
        <SwapPanel />

        {/* 3. Pass the dynamic props to RiskMeter */}
        <RiskMeter
          riskScore={riskScore}
          lowThreats={lowThreats}
          mediumThreats={mediumThreats}
          highThreats={highThreats}
        />
      </div>

    </div>
  );
};

export default Protection;