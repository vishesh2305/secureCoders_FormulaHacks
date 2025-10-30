// Wallet Dropdown Component (shown in header)

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { shortenAddress, formatEthBalance } from '../../utils/formatters';
import { getNetworkName } from '../../utils/web3';
import './WalletDropdown.css';

const WalletDropdown = ({ onClose }) => {
  const { walletAddress, balance, chainId, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Address copied to clipboard!');
  };

  const handleViewExplorer = () => {
    const explorerUrls = {
      1: 'https://etherscan.io/address/',
      11155111: 'https://sepolia.etherscan.io/address/',
      137: 'https://polygonscan.com/address/',
      56: 'https://bscscan.com/address/',
    };

    const baseUrl = explorerUrls[chainId] || explorerUrls[1];
    window.open(`${baseUrl}${walletAddress}`, '_blank');
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
    navigate('/');
  };

  return (
    <div className="wallet-dropdown" ref={dropdownRef}>
      {/* Wallet Info Section */}
      <div className="dropdown-section wallet-info-section">
        <div className="dropdown-label">Wallet Address</div>
        <div className="wallet-full-address">
          {shortenAddress(walletAddress, 10, 10)}
        </div>

        <div className="balance-display">
          <div className="balance-eth">
            {formatEthBalance(balance)} ETH
          </div>
          <div className="balance-usd">
            ≈ ${(parseFloat(balance) * 2000).toFixed(2)} USD
          </div>
        </div>

        <div className="network-display">
          <span className="network-dot" />
          {getNetworkName(chainId)}
        </div>
      </div>

      {/* Action Items */}
      <div className="dropdown-section action-items">
        <button className="dropdown-action" onClick={handleViewExplorer}>
          <span className="action-icon">🔗</span>
          <span className="action-text">View on Explorer</span>
        </button>

        <button className="dropdown-action" onClick={handleCopyAddress}>
          <span className="action-icon">📋</span>
          <span className="action-text">Copy Address</span>
        </button>

        <button
          className="dropdown-action disconnect-action"
          onClick={handleDisconnect}
        >
          <span className="action-icon">🚪</span>
          <span className="action-text">Disconnect</span>
        </button>
      </div>
    </div>
  );
};

export default WalletDropdown;
