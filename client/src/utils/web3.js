// --- FULLY CORRECTED FOR ETHERS V5 & SEPOLIA ---
import { ethers } from 'ethers';

export const connectMetaMask = async () => {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = accounts[0];
    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

export const getBalance = async (address, provider) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.0';
  }
};

export const getChainId = async (provider) => {
  try {
    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return 11155111; // Default to Sepolia
  }
};

export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Mainnet',
    11155111: 'Sepolia', // Added Sepolia
    137: 'Polygon',
  };
  return networks[chainId] || 'Unknown Network';
};

export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
};

export const onChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(parseInt(chainId, 16));
    });
  }
};

export const isWalletConnected = async () => {
  if (!window.ethereum) return false;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};