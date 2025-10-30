// Header Component for F1 DeFi Dashboard

import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { shortenAddress } from '../../utils/formatters';
import { getNetworkName } from '../../utils/web3';
import WalletDropdown from '../wallet/WalletDropdown';
import './Header.css';

const Header = () => {
  const { walletAddress, chainId, isConnected } = useWallet();
  const [gasPrice, setGasPrice] = useState(45);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock gas price updates (in production, fetch from API)
  useEffect(() => {
    const interval = setInterval(() => {
      setGasPrice(Math.floor(Math.random() * 50) + 30);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <span className="logo-f1">F1</span>{' '}
          <span className="logo-defi">DEFI</span>{' '}
          <span className="logo-security">SECURITY</span>
        </div>
      </div>

      <div className="header-right">
        {/* Network Status */}
        <div className="header-item network-status">
          <span className="status-dot active" />
          <span className="status-text">
            {isConnected ? getNetworkName(chainId) : 'NOT CONNECTED'}
          </span>
        </div>

        {/* Gas Price */}
        <div className="header-item gas-price">
          <span className="gas-label">GAS:</span>{' '}
          <span className="gas-value">{gasPrice} GWEI</span>
        </div>

        {/* Wallet Address */}
        {isConnected && walletAddress && (
          <div className="header-item wallet-address-container">
            <button
              className="wallet-address-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {shortenAddress(walletAddress, 4, 4)}
            </button>

            {showDropdown && (
              <WalletDropdown onClose={() => setShowDropdown(false)} />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
