const hre = require("hardhat");
const { ethers } = hre;

// --- CONFIGURATION ---
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH on Sepolia

// ABI for the swap
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const router = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, ROUTER_ABI, signer);

  const ethAmountToSwap = ethers.utils.parseEther("0.001");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes


  const slowGasPrice = ethers.utils.parseUnits("10", "gwei");
  console.log("Sending 'victim' swap with a SLOW gas price: 10 Gwei...");
  console.log(`Swapping 0.001 ETH for F1T token...`);

  const tx = await router.swapExactETHForTokens(
    0, 
    [WETH_ADDRESS, F1T_TOKEN_ADDRESS], 
    signer.address,
    deadline,
    {
      value: ethAmountToSwap,
      gasPrice: slowGasPrice // We've added this line
    }
  );

  console.log("---------------------------------");
  console.log(`✅ 'Victim' Tx sent! Hash: ${tx.hash}`);
  console.log("Watch your attacker bot's terminal!");
  console.log("---------------------------------");

  // Wait for it to be mined (this will take a few seconds now)
  await tx.wait();
  console.log("Transaction mined.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});