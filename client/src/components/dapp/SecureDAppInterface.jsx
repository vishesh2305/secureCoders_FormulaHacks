// src/components/dapp/SecureDAppInterface.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecureDAppInterface.css';

const SecureDAppInterface = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isProtecting, setIsProtecting] = useState(true);
  const navigate = useNavigate();

  const handleExecute = () => {
    if (contractAddress && contractAddress.length >= 40) {
      // Navigate to the dedicated dashboard, passing the address as state
      navigate('/secure-dapp', { state: { contractAddress, isProtecting } });
    } else {
      alert('Please enter a valid contract address (at least 40 characters long).');
    }
  };

  return (
    <div className="dapp-interface-card" data-aos="zoom-in" data-aos-delay="300">
      <h3 className="interface-title">🏎 DApp Analyzer Cockpit</h3> {/* Updated from 🏎️ */}
      <p className="interface-subtitle">
        Enter a contract address to run our full F1-level security audit and MEV risk analysis.
      </p>

      {/* Input Group */}
      <div className="input-group">
        <label htmlFor="address-input">Contract Address (0x...)</label>
        <input
          id="address-input"
          type="text"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="address-input"
        />
      </div>

      {/* Protection Toggle */}
      <div className="protection-toggle-group">
        <span className="toggle-label">MEV Shield Preview:</span>
        <button
          className={`toggle-button ${isProtecting ? 'on' : 'off'}`}
          onClick={() => setIsProtecting(!isProtecting)}
        >
          {isProtecting ? 'PROTECTION ON' : 'PROTECTION OFF'}
        </button>
      </div>

      {/* Execute Button */}
      <button
        className="execute-button"
        onClick={handleExecute}
        disabled={contractAddress.length < 40}
      >
        INITIATE FULL ANALYSIS
      </button>

      {/* Status Footer */}
      <div className="interface-footer-status">
        <span className="status-indicator">
          <span className="status-dot green" />
          Analyzer Status: <span className="value">Active</span>
        </span>
        <span className="status-indicator">
          <span className="status-dot red" />
          Risk Engine: <span className="value">v3.1</span>
        </span>
      </div>
    </div>
  );
};

export default SecureDAppInterface;