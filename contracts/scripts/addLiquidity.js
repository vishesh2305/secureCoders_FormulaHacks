const hre = require("hardhat");
const { ethers } = hre;

// --- CONFIGURATION ---
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

// This is the minimum ABI we need to talk to the Router
const ROUTER_ABI = [
  "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
];

// --- SCRIPT ---

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // 1. Get an instance of your F1T token contract
  const f1t = await ethers.getContractAt(
    "F1FanToken", // The artifact name from compilation
    F1T_TOKEN_ADDRESS,
    signer
  );

  // 2. Get an instance of the Uniswap Router contract
  const router = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, ROUTER_ABI, signer);

  // --- 1. APPROVE ---
  console.log("Step 1: Approving Uniswap Router...");
  
  // THIS IS THE CORRECTED LINE FOR ETHERS V5
  const approveAmount = ethers.constants.MaxUint256; // Approve "infinite" amount

  const approveTx = await f1t.approve(UNISWAP_V2_ROUTER_ADDRESS, approveAmount);
  await approveTx.wait();
  console.log("✅ Approved successfully. Tx Hash:", approveTx.hash);

  // --- 2. ADD LIQUIDITY ---
  console.log("Step 2: Adding Liquidity...");

  // We must use parseEther/parseUnits from ethers.utils for v5
  const ethAmountToAdd = ethers.utils.parseEther("0.01"); // 0.01 ETH
  const tokenAmountToAdd = ethers.utils.parseUnits("10000", 18); // 10,000 F1T

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  const addLiqTx = await router.addLiquidityETH(
    F1T_TOKEN_ADDRESS,
    tokenAmountToAdd,
    0, // amountTokenMin (we don't care about slippage)
    0, // amountETHMin (we don't care about slippage)
    signer.address,
    deadline,
    { value: ethAmountToAdd } // This is the 0.01 ETH we are sending
  );

  await addLiqTx.wait();
  console.log("---------------------------------");
  console.log("✅✅ Liquidity Added Successfully!");
  console.log("Tx Hash:", addLiqTx.hash);
  console.log("---------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});