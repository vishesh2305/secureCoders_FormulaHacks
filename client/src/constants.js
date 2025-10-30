import { ethers } from 'ethers';

// --- CONTRACTS & ADDRESSES ---
export const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
export const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH on Sepolia

// --- ABIS ---
export const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
];
// Helper for Ethers.js v5
export const ROUTER_INTERFACE = new ethers.utils.Interface(ROUTER_ABI);

// --- BACKEND API ---
export const TELEMETRY_WEBSOCKET_URL = "ws://localhost:8080";
export const PROTECTED_TX_API_URL = "http://localhost:8080/api/send-protected-tx";