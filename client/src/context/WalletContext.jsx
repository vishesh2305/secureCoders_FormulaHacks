// Wallet Context for global wallet state management

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  connectMetaMask,
  getBalance,
  getChainId,
  onAccountsChanged,
  onChainChanged,
  isWalletConnected as checkWalletConnected,
} from '../utils/web3';

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState('0.0');
  const [chainId, setChainId] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update balance for connected wallet
   */
  const updateBalance = useCallback(async (address, providerInstance) => {
    if (!address || !providerInstance) return;

    try {
      const bal = await getBalance(address, providerInstance);
      setBalance(bal);
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  }, []);

  /**
   * Update chain ID
   */
  const updateChainId = useCallback(async (providerInstance) => {
    if (!providerInstance) return;

    try {
      const chain = await getChainId(providerInstance);
      setChainId(chain);
    } catch (err) {
      console.error('Error updating chain ID:', err);
    }
  }, []);

  /**
   * Connect wallet (MetaMask)
   */
  const connectWallet = useCallback(
    async (walletType = 'metamask') => {
      setIsConnecting(true);
      setError(null);

      try {
        if (walletType === 'metamask') {
          const { provider: newProvider, address } = await connectMetaMask();

          setProvider(newProvider);
          setWalletAddress(address);
          setIsConnected(true);

          // Update balance and chain ID
          await updateBalance(address, newProvider);
          await updateChainId(newProvider);

          // Save to localStorage
          localStorage.setItem('f1-wallet-address', address);
          localStorage.setItem('f1-wallet-connected', 'true');
          localStorage.setItem('f1-wallet-type', walletType);

          return { success: true, address };
        } else {
          throw new Error('Wallet type not supported yet');
        }
      } catch (err) {
        console.error('Error connecting wallet:', err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsConnecting(false);
      }
    },
    [updateBalance, updateChainId]
  );

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setBalance('0.0');
    setIsConnected(false);
    setProvider(null);
    setError(null);

    // Clear localStorage
    localStorage.removeItem('f1-wallet-address');
    localStorage.removeItem('f1-wallet-connected');
    localStorage.removeItem('f1-wallet-type');
  }, []);

  /**
   * Check for existing connection on mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('f1-wallet-address');
      const savedConnected = localStorage.getItem('f1-wallet-connected');

      if (savedAddress && savedConnected === 'true') {
        const connected = await checkWalletConnected();

        if (connected) {
          // Reconnect automatically
          await connectWallet('metamask');
        } else {
          // Clear stale data
          disconnectWallet();
        }
      }
    };

    checkConnection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Set up event listeners for account and chain changes
   */
  useEffect(() => {
    if (!isConnected) return;

    // Listen for account changes
    onAccountsChanged((newAddress) => {
      if (newAddress) {
        setWalletAddress(newAddress);
        localStorage.setItem('f1-wallet-address', newAddress);

        if (provider) {
          updateBalance(newAddress, provider);
        }
      } else {
        // User disconnected from MetaMask
        disconnectWallet();
      }
    });

    // Listen for chain changes
    onChainChanged((newChainId) => {
      setChainId(newChainId);

      // Reload page on chain change (recommended by MetaMask)
      window.location.reload();
    });
  }, [isConnected, provider, updateBalance, disconnectWallet]);

  /**
   * Refresh balance periodically
   */
  useEffect(() => {
    if (!isConnected || !walletAddress || !provider) return;

    // Update balance every 30 seconds
    const interval = setInterval(() => {
      updateBalance(walletAddress, provider);
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, walletAddress, provider, updateBalance]);

  const value = {
    walletAddress,
    balance,
    chainId,
    isConnected,
    provider,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
