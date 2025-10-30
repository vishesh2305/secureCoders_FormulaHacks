// Web3 utility functions for F1 DeFi Security Dashboard
// --- FULLY CORRECTED FOR ETHERS V5 & SEPOLIA ---

import { ethers } from 'ethers';

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{provider, signer, address}>}
 */
export const connectMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // FIX 1: Use Ethers v5 syntax
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const address = accounts[0];

    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

/**
 * Get ETH balance for an address
 * @param {string} address - Ethereum address
 * @param {object} provider - Ethers provider
 * @returns {Promise<string>} - Balance in ETH
 */
export const getBalance = async (address, provider) => {
  try {
    const balance = await provider.getBalance(address);
    // FIX 2: Use Ethers v5 syntax
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.0';
  }
};

/**
 * Get current network chain ID
 * @param {object} provider - Ethers provider
 * @returns {Promise<number>}
 */
export const getChainId = async (provider) => {
  try {
    const network = await provider.getNetwork();
    // Ethers v5 syntax
    return Number(network.chainId);
  } catch (error) {
    console.error('Error getting chain ID:', error);
    // FIX 3: Default to Sepolia, not Mainnet
    return 11155111; 
  }
};

/**
 * Get network name from chain ID
 * @param {number} chainId
 * @returns {string}
 */
export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Mainnet',
    11155111: 'Sepolia', // FIX 4: Added Sepolia
    137: 'Polygon',
    56: 'BSC',
  };
  return networks[chainId] || 'Unknown Network';
};

/**
 * Listen for account changes
 * @param {function} callback - Callback function when account changes
 */
export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
};

/**
 * Listen for chain changes
 * @param {function} callback - Callback function when chain changes
 */
export const onChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      // Chain ID is returned as hex string
      callback(parseInt(chainId, 16));
    });
  }
};

/**
 * Switch to a different network
 * @param {number} chainId - Target chain ID
 */
export const switchNetwork = async (chainId) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    console.error('Error switching network:', error);
    throw error;
  }
};

/**
 * Check if wallet is already connected
 * @returns {Promise<boolean>}
 */
export const isWalletConnected = async () => {
  if (!window.ethereum) {
    return false;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};