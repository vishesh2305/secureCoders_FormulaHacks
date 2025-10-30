// --- HYBRID DEMO VERSION ---
// --- Live Wallet Connection + Simulated Dashboard State ---
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  connectMetaMask, 
  getBalance, 
  getChainId, 
  getNetworkName, 
  isWalletConnected,
  onAccountsChanged,
  onChainChanged
} from '../utils/web3';
import { ethers } from 'ethers';

export const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }) => {
  // --- REAL WALLET STATE ---
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkId, setNetworkId] = useState(11155111);
  const [networkName, setNetworkName] = useState('Sepolia');
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // --- FAKE SIMULATION STATE ---
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState({
    score: 35, low: 12, medium: 5, high: 2, activeThreats: 3
  });

  // --- LIVE WALLET LOGIC (AUTO-CONNECT & LISTENERS) ---
  useEffect(() => {
    const autoConnect = async () => {
      try {
        if (await isWalletConnected()) {
          console.log("Auto-connecting wallet...");
          const v5Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          const v5Signer = v5Provider.getSigner();
          const v5Address = await v5Signer.getAddress();
          await updateWalletState(v5Provider, v5Signer, v5Address);
        }
      } catch (error) {
        console.error("Auto-connect failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    autoConnect();
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);
  }, []);

  const updateWalletState = async (provider, signer, address) => {
    if (!provider || !signer || !address) {
      setProvider(null); setSigner(null); setWalletAddress(null); setBalance(null);
      return;
    }
    setProvider(provider);
    setSigner(signer);
    setWalletAddress(address);
    const bal = await getBalance(address, provider);
    const id = await getChainId(provider);
    const name = getNetworkName(id);
    setBalance(bal);
    setNetworkId(id);
    setNetworkName(name);
  };

  const handleAccountsChanged = async (address) => {
    if (address) {
      const v5Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const v5Signer = v5Provider.getSigner();
      await updateWalletState(v5Provider, v5Signer, address);
    } else {
      await updateWalletState(null, null, null);
    }
  };

  const handleChainChanged = async (chainId) => {
    const v5Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const v5Signer = v5Provider.getSigner();
    const v5Address = await v5Signer.getAddress();
    await updateWalletState(v5Provider, v5Signer, v5Address);
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const { provider, signer, address } = await connectMetaMask();
      
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      const targetChainId = 11155111; // Sepolia

      if (currentChainId !== targetChainId) {
        alert("Wrong network! Please switch to Sepolia testnet in MetaMask.");
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + targetChainId.toString(16) }], // 0xaa36a7
        });
        // Re-run connect after switch
        return connectWallet();
      }
      
      await updateWalletState(provider, signer, address);
      setIsLoading(false);
      setIsWalletModalOpen(false);
    } catch (error) {
      setIsLoading(false); throw error;
    }
  };

  const disconnectWallet = () => updateWalletState(null, null, null);
  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  // --- SIMULATION TRIGGER FUNCTION ---
  const simulateAttack = (txHash, value) => {
    console.log("[SIMULATION] ATTACK DETECTED!");
    const gas = (Math.random() * 5 + 10).toFixed(2); // Random gas > 10
    const newAlert = {
      id: txHash,
      type: 'critical',
      message: `New swap detected (${value} ETH) with High risk.`,
      timestamp: Date.now(),
    };
    const newChartEntry = {
      timestamp: new Date().toLocaleTimeString(),
      gasPrice: parseFloat(gas),
      threatLevel: 80,
      txVolume: parseFloat(value),
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    setChartData((prev) => [...prev.slice(-19), newChartEntry]);
    setRiskMetrics((prev) => ({
      ...prev,
      score: Math.min(prev.score + 5, 90),
      high: prev.high + 1,
      activeThreats: prev.activeThreats + 1,
    }));
  };

  const value = {
    // Live Wallet
    provider, signer, walletAddress, balance, networkId, networkName,
    isLoading, isWalletModalOpen,
    connectWallet, disconnectWallet, openWalletModal, closeWalletModal,
    
    // Simulated State & Trigger
    alerts, chartData, riskMetrics, simulateAttack 
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};