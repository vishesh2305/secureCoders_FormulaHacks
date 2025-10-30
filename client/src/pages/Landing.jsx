// src/pages/Landing.jsx

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletModal from '../components/wallet/WalletModal';
import LoadingScreen from '../components/loading/LoadingScreen';
import RiskMeter from '../components/dashboard/RiskMeter';
import SecureDAppInterface from '../components/dapp/SecureDAppInterface';
import LandingNav from '../components/layout/LandingNav';
import './Landing.css';

// --- Helper Components ---
const FeatureCard = ({ icon, title, description, aosDelay }) => (
  <div className="feature-card" data-aos="fade-up" data-aos-delay={aosDelay}>
    <div className="feature-icon">{icon}</div>
    <div className="feature-text-group">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  </div>
);

const SectionSeparator = () => (
  <div className="section-separator" data-aos="zoom-in" data-aos-delay="200" />
);

// --- Main Component ---
const Landing = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  // Refs for scrolling (optional, same as full UI)
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const dappRef = useRef(null);
  const riskRef = useRef(null);
  const aboutRef = useRef(null);

  const sectionRefs = {
    home: homeRef,
    features: featuresRef,
    'dapp-analyzer': dappRef,
    'risk-meter': riskRef,
    about: aboutRef,
  };

  const navigateToSection = useCallback((id) => {
    const element = sectionRefs[id]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionRefs]);

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

      {/* Navigation Bar */}
      <LandingNav
        isDashboard={false}
        activeSection="home"
        navigateToSection={navigateToSection}
      />

      {/* 1. Hero Section */}
      <section className="hero-section" id="home" ref={homeRef}>
        <div className="hero-content">
          <div className="landing-logo" data-aos="fade-down" data-aos-duration="800">
            <span className="logo-f1">F1</span>{' '}
            <span className="logo-defi">DEFI</span>
            <span className="logo-security">SECURITY</span>
          </div>
          <h1 className="hero-title" data-aos="fade-up" data-aos-delay="200">
            ENGINEERED FOR THE CIRCUIT:
            <br />
            <span className="title-highlight">MEV PROTECTION</span> AT RACE SPEED.
          </h1>
          <p className="hero-tagline" data-aos="fade-up" data-aos-delay="400">
            Ultra-low latency security protocols. Defend against front-running, sandwich attacks,
            and emerging threats with AI-powered predictive monitoring.
          </p>
          <button
            className="connect-button primary-cta"
            onClick={handleConnectClick}
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            CONNECT WALLET & START ENGINE
          </button>
        </div>
      </section>

      <SectionSeparator />

      {/* 2. Features Section */}
      <section className="feature-grid-section" id="features" ref={featuresRef}>
        <h2 className="section-title" data-aos="fade-right">
          Core Technologies: Engineering Deterministic Security
        </h2>
        <div className="features-grid">
          <FeatureCard
            icon="⎈"
            title="Proprietary Relayer Network"
            description="Private relayer bypassing public mempools, guaranteeing deterministic execution and front-run resistance."
            aosDelay="100"
          />
          <FeatureCard
            icon="🧠"
            title="AI Predictive Threat Matrix"
            description="Analyzes millions of transactions per second to detect and prevent malicious MEV activity."
            aosDelay="200"
          />
          <FeatureCard
            icon="⏱"
            title="Sub-Millisecond Alerting"
            description="Receive and react to system alerts in real-time with near-zero latency."
            aosDelay="300"
          />
          <FeatureCard
            icon="⌕"
            title="Mempool Forensic Analysis"
            description="Visualize and analyze pending transactions to identify hostile arbitrage patterns."
            aosDelay="400"
          />
          <FeatureCard
            icon="📈"
            title="Defensive ROI Reporting"
            description="Quantify the value protected and efficiency of exploit mitigation in real time."
            aosDelay="500"
          />
          <FeatureCard
            icon="⛓"
            title="EVM Canonical Compatibility"
            description="Protect assets across Ethereum, Polygon, BSC, and major EVM chains with unified security."
            aosDelay="600"
          />
        </div>

        <div className="feature-cta-container">
          <h3 data-aos="fade-up" data-aos-delay="700">
            Ready to Deploy Your Defensive Strategy?
          </h3>
          <button
            className="connect-button feature-cta-button"
            onClick={handleConnectClick}
            data-aos="zoom-in"
            data-aos-delay="800"
          >
            SECURE YOUR ASSETS NOW
          </button>
        </div>
      </section>

      <SectionSeparator />

      {/* 3. Secure DApp Interface */}
      <section className="dapp-interface-section" id="dapp-analyzer" ref={dappRef}>
        <div className="dapp-content">
          <div className="dapp-text" data-aos="fade-right">
            <h2 className="section-title dapp-title">
              The Cockpit: Intuitive DApp Interface
            </h2>
            <p className="section-subtitle dapp-subtitle">
              F1-level security doesn’t mean complex controls. Our streamlined interface allows
              easy, protected transaction submission and instant contract analysis.
            </p>
          </div>
          <div className="dapp-visual">
            <SecureDAppInterface />
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* 4. Risk Meter Section */}
      <section className="metrics-section" id="risk-meter" ref={riskRef}>
        <div className="metrics-content">
          <div className="metrics-text" data-aos="fade-right">
            <h2 className="section-title tech-title">
              Real-time Threat Assessment
            </h2>
            <p className="section-subtitle tech-subtitle">
              The MEV Risk Meter provides a visual gauge of your live exposure based on active
              attack vectors.
            </p>
            <div className="metrics-cta">
              <span className="status-dot-red" />
              <span>RISK SCORE BASED ON LIVE THREAT FEED</span>
            </div>
          </div>
          <div className="metrics-visual" data-aos="fade-left" data-aos-delay="300">
            <RiskMeter riskScore={35} lowThreats={12} mediumThreats={5} highThreats={2} />
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* 5. About Section */}
      <section className="about-section" id="about" ref={aboutRef}>
        <div className="about-content">
          <h2 className="section-title about-title" data-aos="fade-up">
            OUR CORE MISSION
          </h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            F1 DeFi Security is engineered by a decentralized collective of blockchain researchers
            and security experts, driven by ultra-low latency MEV defense.
          </p>

          <div className="about-card-grid">
            <div className="about-info-card" data-aos="flip-left" data-aos-delay="300">
              <div className="card-icon">👁️</div>
              <h3 className="card-title">Zero-Loss DeFi Vision</h3>
              <p className="card-description">
                Our mission is to create deterministic DeFi execution, eliminating malicious MEV
                and ensuring fairness for all users.
              </p>
            </div>

            <div className="about-info-card" data-aos="flip-right" data-aos-delay="400">
              <div className="card-icon">💡</div>
              <h3 className="card-title">Engineering Principles</h3>
              <p className="card-description">
                Built on transparency, real-time analytics, and continuous upgrades to outpace
                exploiters and maintain a secure ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content" data-aos="fade-up">
          <h2>F1 DeFi: Zero Latency, Maximum Defense.</h2>
          <p>Connect your wallet now and secure your spot on the DeFi grid.</p>
          <button className="connect-button" onClick={handleConnectClick}>
            CONNECT WALLET SECURELY
          </button>
        </div>
      </footer>

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
