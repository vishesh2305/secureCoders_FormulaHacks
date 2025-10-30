// Wallet Selection Modal Component

import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './WalletModal.css';

const WalletModal = ({ onClose, onSuccess }) => {
  const { connectWallet, isConnecting, error } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using browser extension',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔷',
      description: 'Scan with mobile wallet',
      disabled: true,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🌐',
      description: 'Connect via Coinbase',
      disabled: true,
    },
  ];

  const handleWalletSelect = async (walletId) => {
    if (walletId !== 'metamask') {
      setConnectionError('This wallet is not yet supported');
      return;
    }

    setSelectedWallet(walletId);
    setConnectionError(null);

    try {
      const result = await connectWallet(walletId);

      if (result.success) {
        // Show success briefly
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 500);
      } else {
        setConnectionError(result.error || 'Connection failed');
        setSelectedWallet(null);
      }
    } catch (err) {
      setConnectionError(err.message || 'Connection failed');
      setSelectedWallet(null);
    }
  };

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Connect Wallet</h2>
          <p className="modal-subtitle">
            Choose your preferred wallet to continue
          </p>
        </div>

        {/* Wallet Options */}
        <div className="wallet-options">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className={`wallet-option ${selectedWallet === wallet.id ? 'connecting' : ''} ${wallet.disabled ? 'disabled' : ''}`}
              onClick={() => !wallet.disabled && handleWalletSelect(wallet.id)}
              disabled={wallet.disabled || isConnecting}
            >
              <div className="wallet-icon-box">{wallet.icon}</div>
              <div className="wallet-info">
                <div className="wallet-name">{wallet.name}</div>
                <div className="wallet-description">
                  {wallet.disabled ? 'Coming soon' : wallet.description}
                </div>
              </div>
              <div className="wallet-arrow">
                {selectedWallet === wallet.id && isConnecting ? (
                  <span className="spinner">⏳</span>
                ) : selectedWallet === wallet.id ? (
                  <span className="check">✓</span>
                ) : (
                  '→'
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Error Display */}
        {(connectionError || error) && (
          <div className="connection-error">
            {connectionError || error}
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <p className="modal-footer-text">
            New to wallets?{' '}
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="learn-more-link"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
