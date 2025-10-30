// victim_swap.js
// This script acts as the "victim" to test your mempool monitor.

require("dotenv").config();
const { ethers } = require("ethers");

// --- CONFIGURATION (Copied from attacker.js) ---
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F"; //
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH on Sepolia

// --- SETUP (Using your .env file) ---
const provider = new ethers.providers.WebSocketProvider(
  process.env.SEPOLIA_WSS_URL //
);
// Use the SAME private key as your attacker/monitor
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider); //

const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
]; //

const routerContract = new ethers.Contract(
  UNISWAP_V2_ROUTER_ADDRESS,
  ROUTER_ABI,
  signer
);

async function sendVictimTransaction() {
  console.log("--- F1 Victim Script ---");
  console.log(`Swapper Address: ${signer.address}`);

  try {
    // --- TRANSACTION DETAILS ---
    const amountIn = ethers.utils.parseEther("0.001"); // 0.001 ETH
    const path = [WETH_ADDRESS, F1T_TOKEN_ADDRESS];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

    // !!! THIS IS THE IMPORTANT PART !!!
    // We set a very low gas price to simulate a "slow" victim.
    // Your monitor will only attack transactions under 15 Gwei
    const victimGasPrice = ethers.utils.parseUnits("5", "gwei"); // 5 Gwei

    console.log(`Sending victim swap of ${ethers.utils.formatEther(amountIn)} ETH`);
    console.log(`Path: ${path[0]} -> ${path[1]}`);
    console.log(`Gas Price: ${ethers.utils.formatUnits(victimGasPrice, "gwei")} Gwei`);

    const tx = await routerContract.swapExactETHForTokens(
      0, // amountOutMin
      path,
      signer.address, // to
      deadline,
      {
        value: amountIn,
        gasPrice: victimGasPrice,
        gasLimit: 300000 
      }
    );

    console.log("\n✅ Victim Transaction Sent!");
    console.log(`   Hash: ${tx.hash}`);
    console.log("   Waiting for confirmation...");
    
    await tx.wait();
    console.log("✅ Victim Transaction Confirmed!");

  } catch (err) {
    console.error("\n❌ Error sending victim transaction:");
    console.error(err.message);
  }
}

sendVictimTransaction();