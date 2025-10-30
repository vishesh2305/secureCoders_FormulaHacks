// src/pages/Landing.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WalletModal from '../components/wallet/WalletModal';
import LoadingScreen from '../components/loading/LoadingScreen';
import RiskMeter from '../components/dashboard/RiskMeter';
import SecureDAppInterface from '../components/dapp/SecureDAppInterface';
import { useWallet } from '../hooks/useWallet';
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
  const [activeSection, setActiveSection] = useState('home');

  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useWallet();

  // NEW: Ref to track if the manual connection flow has started, which blocks the auto-redirect logic.
  const isManualConnecting = useRef(false);

  // Refs for sections to scroll to
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const dappRef = useRef(null);
  const riskRef = useRef(null);
  // MODIFIED: Ref for the About Us section
  const aboutRef = useRef(null);

  const sectionRefs = {
    'home': homeRef,
    'features': featuresRef,
    'dapp-analyzer': dappRef,
    'risk-meter': riskRef,
    'about': aboutRef, // MODIFIED: Reverted key to 'about'
  };

  // Function to handle the actual scrolling - Wrapped in useCallback
  const navigateToSection = useCallback((id) => {
    const element = sectionRefs[id]?.current;
    if (element) {
      // Use scrollIntoView to immediately scroll to the target element
      element.scrollIntoView({ behavior: 'smooth' });
      // Manually set active section right away for snappier feedback
      setActiveSection(id);
    }
  }, [sectionRefs]); // sectionRefs is a stable object reference

  // MODIFIED: Redirect if already connected (Now only handles auto-reconnect/stale state)
  useEffect(() => {
    // NEW: If a manual connection has started, the loading screen will handle the redirect.
    if (isManualConnecting.current) {
        return; // Block the auto-redirect logic
    }

    // FIX: Only redirect to /dashboard if the wallet is connected AND the bypass flag is NOT set, AND we are NOT showing the loading animation.
    if (isConnected && !location.state?.bypassRedirect && !showLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isConnected, navigate, location.state, showLoading]); 

  // FIX: Check for hash fragment and scroll reliably upon navigation
  useEffect(() => {
    if (location.hash) {
      // Remove '#' from the hash to get the section ID
      const sectionId = location.hash.substring(1);

      // Use setTimeout(..., 0) to defer execution until the next tick after component mount.
      // This is crucial for fixing the race condition on cross-page navigation.
      const timer = setTimeout(() => {
        navigateToSection(sectionId);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [location.hash, navigateToSection]);

  // Observer for active section highlighting (Keep this separate)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Update active section to the one currently visible
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Center of viewport
        threshold: 0.01 // Minimal threshold
      }
    );

    Object.keys(sectionRefs).forEach(key => {
      if (sectionRefs[key].current) {
        observer.observe(sectionRefs[key].current);
      }
    });

    return () => {
      Object.keys(sectionRefs).forEach(key => {
        // Check if current is not null before unobserving
        if (sectionRefs[key].current) {
          observer.unobserve(sectionRefs[key].current);
        }
      });
    };
  }, [sectionRefs]);


  const handleConnectClick = () => {
    setShowWalletModal(true);
    // NEW: Set the flag to true to block the useEffect auto-redirect
    isManualConnecting.current = true; 
  };

  const handleWalletSuccess = () => {
    // When wallet connects, immediately show the loading screen
    setShowWalletModal(false);
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    // Once loading is complete, perform the final navigation.
    // This is guaranteed to run AFTER the loading animation finishes.
    navigate('/dashboard');
    // NEW: Reset the flag once navigation is complete
    isManualConnecting.current = false; 
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="landing-page">

      {/* Centered Navigation Bar */}
      <LandingNav
        isDashboard={false}
        activeSection={activeSection}
        navigateToSection={navigateToSection}
      />

      {/* 1. Hero Section (Maximum Performance) */}
      <section className="hero-section" id="home" ref={homeRef}> {/* Add ID and Ref */}
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
            Ultra-low latency security protocols. Defend against front-running, sandwich attacks, and emerging threats with AI-powered predictive monitoring.
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

      {/* 2. Features Section (Professional & Technical) */}
      <section className="feature-grid-section" id="features" ref={featuresRef}> {/* Add ID and Ref */}
        <h2 className="section-title" data-aos="fade-right">Core Technologies: Engineering Deterministic Security</h2>
        <div className="features-grid">
          <FeatureCard
            icon="⎈" // Proprietary Relayer Network (Helm/Control)
            title="Proprietary Relayer Network"
            description="Our private transaction relay bypasses the public mempool, guaranteeing deterministic execution and zero visibility to front-running bots."
            aosDelay="100"
          />
          <FeatureCard
            icon="🧠" // AI Predictive Threat Matrix (Brain/AI)
            title="AI Predictive Threat Matrix"
            description="A continuously updated neural network analyzes millions of transactions per second to predict, preempt, and block emerging attack vectors."
            aosDelay="200"
          />
          <FeatureCard
            icon="⏱" // Sub-Millisecond Alerting (Stopwatch/Latency)
            title="Sub-Millisecond Alerting"
            description="Critical system alerts are delivered with infrastructure-level speed, enabling automated defense mechanisms with negligible latency."
            aosDelay="300"
          />
          <FeatureCard
            icon="⌕" // Mempool Forensic Analysis (Search/Analysis)
            title="Mempool Forensic Analysis"
            description="In-depth, real-time visualization of pending transaction pools to identify hostile arbitrage and liquidity extraction attempts."
            aosDelay="400"
          />
          <FeatureCard
            icon="📈" // Defensive ROI Reporting (Chart/ROI)
            title="Defensive ROI Reporting"
            description="Access detailed analytics on the total value protected (TVP) and the efficiency of blocked exploits, proving security ROI."
            aosDelay="500"
          />
          <FeatureCard
            icon="⛓" // EVM Canonical Compatibility (Chain/Link)
            title="EVM Canonical Compatibility"
            description="One unified security layer protecting assets across Ethereum, Polygon, BSC, and other major EVM-compatible chains."
            aosDelay="600"
          />
        </div>

        {/* Connect Wallet CTA within the Features Section */}
        <div className="feature-cta-container">
          <h3 data-aos="fade-up" data-aos-delay="700">Ready to Deploy Your Defensive Strategy?</h3>
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

      {/* 3. Secure DApp Interface Section (Ease of Use) */}
      <section className="dapp-interface-section" id="dapp-analyzer" ref={dappRef}> {/* Add ID and Ref */}
        <div className="dapp-content">
          <div className="dapp-text" data-aos="fade-right">
            <h2 className="section-title dapp-title">
              The Cockpit: Intuitive DApp Interface
            </h2>
            <p className="section-subtitle dapp-subtitle">
              F1-level security doesn't mean complex controls. Our streamlined interface allows for easy, protected transaction submission and **instant contract analysis** before connection.
            </p>
          </div>
          <div className="dapp-visual">
            {/* User interaction: Input contract, then redirected to /secure-dapp */}
            <SecureDAppInterface />
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* 4. Live Metrics Section (Risk Meter Demo) */}
      <section className="metrics-section" id="risk-meter" ref={riskRef}> {/* Add ID and Ref */}
        <div className="metrics-content">
          <div className="metrics-text" data-aos="fade-right">
            <h2 className="section-title tech-title">
              Real-time Threat Assessment
            </h2>
            <p className="section-subtitle tech-subtitle">
              The MEV Risk Meter provides a visual, instant gauge of your current exposure based on network activity and active attack vectors. Always know where you stand.
            </p>
            <div className="metrics-cta">
              <span className="status-dot-red" />
              <span>RISK SCORE BASED ON LIVE THREAT FEED</span>
            </div>
          </div>

          <div className="metrics-visual" data-aos="fade-left" data-aos-delay="300">
            <RiskMeter
              riskScore={35}
              lowThreats={12}
              mediumThreats={5}
              highThreats={2}
            />
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* 5. MODIFIED: Simple, Professional About Us Section */}
      <section className="about-section" id="about" ref={aboutRef}>
        <div className="about-content">
          <h2 className="section-title about-title" data-aos="fade-up">
            OUR CORE MISSION
          </h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            F1 DeFi Security is engineered by a decentralized collective of blockchain researchers and security experts, driven by a commitment to ultra-low latency MEV defense.
          </p>

          <div className="about-card-grid">
            {/* Vision Card */}
            <div className="about-info-card" data-aos="flip-left" data-aos-delay="300">
              <div className="card-icon">👁️</div> 
              <h3 className="card-title">Zero-Loss DeFi Vision</h3>
              <p className="card-description">
                Our mission is to establish a truly deterministic execution environment for DeFi, eliminating malicious MEV and leveling the playing field for all users.
              </p>
            </div>

            {/* Principles Card */}
            <div className="about-info-card" data-aos="flip-right" data-aos-delay="400">
                <div className="card-icon">💡</div>
                <h3 className="card-title">Engineering Principles</h3>
                <p className="card-description">
                  We operate on principles of absolute transparency, real-time threat analysis, and continuous protocol upgrades to maintain our competitive edge against exploiters.
                </p>
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* Footer CTA */}
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