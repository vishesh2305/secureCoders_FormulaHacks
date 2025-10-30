// Landing Page Component

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletModal from '../components/wallet/WalletModal';
import LoadingScreen from '../components/loading/LoadingScreen';
import './Landing.css';

const Landing = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnectClick = () => {
    setShowWalletModal(true);
  };

  const handleWalletSuccess = () => {
    setShowWalletModal(false);
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    navigate('/dashboard');
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        {/* Logo */}
        <div className="landing-logo">
          <span className="logo-f1">F1</span>{' '}
          <span className="logo-defi">DEFI</span>
        </div>

        {/* Tagline */}
        <p className="landing-tagline">
          Advanced DeFi security with real-time MEV protection and smart
          contract auditing
        </p>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <div className="feature-text">Real-time Monitoring</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <div className="feature-text">MEV Protection</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">Instant Alerts</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-text">Security Analytics</div>
          </div>
        </div>

        {/* Connect Button */}
        <button className="connect-button" onClick={handleConnectClick}>
          CONNECT WALLET
        </button>

        {/* Security Badge */}
        <div className="security-badge">🔒 Audited & Secure</div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletModal
          onClose={() => setShowWalletModal(false)}
          onSuccess={handleWalletSuccess}
        />
      )}
    </div>
  );
};

export default Landing;
