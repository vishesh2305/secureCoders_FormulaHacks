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
import { ethers } from 'ethers'; // Import ethers for v5 syntax

// Define the context
export const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkId, setNetworkId] = useState(11155111); // FIX: Default to Sepolia
  const [networkName, setNetworkName] = useState('Sepolia'); // FIX: Default to Sepolia
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      try {
        if (await isWalletConnected()) {
          console.log("Auto-connecting wallet...");
          
          // --- FIX: Use Ethers v5 syntax for auto-connect ---
          const v5Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          const v5Signer = v5Provider.getSigner();
          const v5Address = await v5Signer.getAddress();
          
          setProvider(v5Provider);
          setSigner(v5Signer);
          setWalletAddress(v5Address);

          const bal = await getBalance(v5Address, v5Provider);
          const id = await getChainId(v5Provider);
          const name = getNetworkName(id);

          setBalance(bal);
          setNetworkId(id);
          setNetworkName(name);

          // Auto-check network on load
          if (id !== 11155111) {
            alert("Wrong network. Please switch to Sepolia in MetaMask.");
          }
        }
      } catch (error) {
        console.error("Auto-connect failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    autoConnect();

    // Setup listeners
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Update state when account changes
  const handleAccountsChanged = (address) => {
    if (address) {
      updateWalletState(address);
    } else {
      disconnectWallet();
    }
  };

  // Update state when chain changes
  const handleChainChanged = (chainId) => {
    updateWalletState(walletAddress);
  };

  // Helper to refresh wallet state
  const updateWalletState = async (address) => {
    if (!address) return;
    try {
      // --- FIX: Use Ethers v5 syntax ---
      const v5Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const v5Signer = v5Provider.getSigner();
      
      setProvider(v5Provider);
      setSigner(v5Signer);
      setWalletAddress(address);

      const bal = await getBalance(address, v5Provider);
      const id = await getChainId(v5Provider);
      const name = getNetworkName(id);

      setBalance(bal);
      setNetworkId(id);
      setNetworkName(name);
    } catch (error) {
      console.error("Error updating wallet state:", error);
      disconnectWallet();
    }
  };

  // --- THIS IS THE MAIN FIX FOR FORCING SEPOLIA ---
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const { provider, signer, address } = await connectMetaMask();
      
      // --- NEW NETWORK CHECK ---
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      const targetChainId = 11155111; // Sepolia

      if (currentChainId !== targetChainId) {
        alert("Wrong network! Please switch to Sepolia testnet in MetaMask.");
        try {
          // Request to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + targetChainId.toString(16) }], // 0xaa36a7
          });
          // After switching, we must re-initialize provider to get new network
          // We'll call updateWalletState which uses the new provider
          await updateWalletState(address);
          setIsLoading(false);
          setIsWalletModalOpen(false);
          return; // Exit function after successful switch
          
        } catch (switchError) {
          // User rejected the switch
          console.error("User rejected network switch:", switchError);
          setIsLoading(false);
          throw new Error("Please switch to Sepolia network to continue.");
        }
      }
      // --- END NEW NETWORK CHECK ---

      // If already on Sepolia, just set state normally
      setProvider(provider);
      setSigner(signer);
      setWalletAddress(address);

      const bal = await getBalance(address, provider);
      const id = await getChainId(provider);
      const name = getNetworkName(id);

      setBalance(bal);
      setNetworkId(id);
      setNetworkName(name);

      setIsLoading(false);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
    setBalance(null);
    setNetworkId(11155111); // Default back to Sepolia
    setNetworkName('Sepolia');
  };

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  const value = {
    provider,
    signer,
    walletAddress,
    balance,
    networkId,
    networkName,
    isLoading,
    isWalletModalOpen,
    connectWallet,
    disconnectWallet,
    openWalletModal,
    closeWalletModal,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};