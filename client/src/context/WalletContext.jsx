// client/src/context/WalletContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { ethers } from 'ethers';

// 1. Create the Context
const WalletContext = createContext(null);

// 2. Create the Provider Component
export const WalletProvider = ({ children }) => {
  // --- State ---
  
  // Wallet Connection State
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Live Telemetry State
  const [alerts, setAlerts] = useState([]);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // --- WebSocket Connection ---
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log('WebSocket connected to telemetry server.');
      setIsWsConnected(true);
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newAlert = {
          id: data.hash,
          type: data.risk || 'Info',
          message: `Swap from ${data.from.substring(0, 6)}...${data.from.substring(data.from.length - 4)} for ${parseFloat(data.value).toFixed(4)} ETH (${data.gas} Gwei)`,
        };
        setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected.');
      setIsWsConnected(false);
    };
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsWsConnected(false);
    };
    return () => {
      ws.close();
    };
  }, []);

  // --- Derived State (Calculated from 'alerts') ---
  const threatCounts = useMemo(() => {
    const high = alerts.filter((a) => a.type === 'High').length;
    const medium = alerts.filter((a) => a.type === 'Medium').length;
    const low = alerts.filter((a) => a.type === 'Low').length;
    return { high, medium, low };
  }, [alerts]);

  const riskScore = useMemo(() => {
    const score = (threatCounts.high * 10) + (threatCounts.medium * 5) + (threatCounts.low * 1);
    return Math.min(Math.round((score / 50) * 100), 100);
  }, [threatCounts]);

  // --- Wallet Functions ---
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install it to use this app.');
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const web3Signer = web3Provider.getSigner();
      setSigner(web3Signer);
      const userAddress = await web3Signer.getAddress();
      setAddress(userAddress);
      setIsConnected(true);
      console.log('Wallet connected:', userAddress);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setIsConnected(false);
      setAddress(null);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setProvider(null);
    setSigner(null);
    console.log('Wallet disconnected');
  };

  // ---
  // --- THIS IS THE NEW FUNCTION THAT FIXES THE ERROR ---
  // ---
  const simulateAttack = (txHash, amount) => {
    console.log(`[SIMULATION] Public TX ${txHash} detected. Simulating attack.`);

    // Create a fake, high-risk alert
    const simulatedAlert = {
      id: txHash, // Use the real TX hash as the ID
      type: 'High', // Mark it as High risk
      message: `[SIMULATED ATTACK] Sandwich attack detected on your ${amount} ETH swap!`,
    };

    // Add the fake alert to the top of the list
    setAlerts((prevAlerts) => [simulatedAlert, ...prevAlerts]);
  };


  // --- Context Value ---
  // This is the object that all components will consume
  const value = {
    // Connection
    isConnected,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    
    // Telemetry
    isWsConnected,
    alerts,
    
    // Derived Stats for Dashboards
    riskScore,
    highThreats: threatCounts.high,
    mediumThreats: threatCounts.medium,
    lowThreats: threatCounts.low,

    // Aliases
    address,
    walletAddress: address,

    // --- ADD THE NEW FUNCTION HERE ---
    simulateAttack, // <-- This makes it available to useWallet()
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// 3. Create and Export the Custom Hook
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};