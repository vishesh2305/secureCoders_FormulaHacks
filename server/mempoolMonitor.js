// --- THIS FILE NOW CONTROLS TELEMETRY AND THE ATTACKER BOT ---
// --- UPDATED VERSION: Uses standard "pending" subscription AND sends history to new clients ---

const { ethers } = require("ethers");
const { WebSocketServer } = require("ws");

// --- CONFIGURATION ---
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // WETH on Sepolia

// --- ABIs ---
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
];
const iface = new ethers.utils.Interface(ROUTER_ABI);

// --- PROVIDERS & SIGNER ---
const provider = new ethers.providers.WebSocketProvider(
  process.env.SEPOLIA_WSS_URL
);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const routerContract = new ethers.Contract(
  UNISWAP_V2_ROUTER_ADDRESS,
  ROUTER_ABI,
  signer
);

let wss; // Our WebSocket Server for the dashboard
let recentAlerts = []; // <-- NEW: Store history

// --- NEW: This function subscribes to the STANDARD mempool ---
async function watchStandardMempool() {
  console.log("   Subscribing to STANDARD public mempool (slower, but reliable)...");

  provider.on("pending", async (txHash) => {
    
    let tx;
    try {
      tx = await provider.getTransaction(txHash);

      if (!tx || !tx.to) {
        return;
      }
      
      if (tx.to.toLowerCase() === UNISWAP_V2_ROUTER_ADDRESS.toLowerCase() && 
          tx.data.startsWith("0x7ff36ab5")) { 
        
        const decodedTx = iface.decodeFunctionData(
          "swapExactETHForTokens",
          tx.data
        );
        const path = decodedTx.path;

        if (path.length > 0 && path[path.length - 1].toLowerCase() === F1T_TOKEN_ADDRESS.toLowerCase()) {
          
          console.log(`\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨`);
          console.log(`🚨 TARGET ACQUIRED!`);
          console.log(`   Victim Tx: ${tx.hash}`);
          const gasGwei = parseFloat(ethers.utils.formatUnits(tx.gasPrice, "gwei"));
          const valueEth = ethers.utils.formatEther(tx.value);
          console.log(`   Victim Gas: ${gasGwei.toFixed(2)} Gwei`);

          // --- 1. PREPARE & BROADCAST TELEMETRY ---
          let type = 'info';
          if (gasGwei >= 10) type = 'warning';
          if (gasGwei >= 15) type = 'critical';

          const telemetryData = {
            id: tx.hash,
            type: type,
            message: `Victim TX detected: ${Number(valueEth).toFixed(4)} ETH @ ${gasGwei.toFixed(2)} Gwei`,
            timestamp: Date.now(),
            value: valueEth,
            gas: gasGwei.toFixed(2),
          };
          
          // Send to all *currently connected* clients
          broadcast(JSON.stringify(telemetryData));
          
          // <-- NEW: Add to history and trim
          recentAlerts.unshift(telemetryData);
          recentAlerts = recentAlerts.slice(0, 20); // Keep only the last 20

          console.log("   [DEBUG] Broadcasting telemetry to dashboard...");

          // --- 2. LAUNCH ATTACK ---
          if (gasGwei < 15) { // Only attack slow transactions
            const attackGasPrice = tx.gasPrice.add(ethers.utils.parseUnits("2", "gwei"));
            console.log(`🚀 LAUNCHING ATTACK with ${ethers.utils.formatUnits(attackGasPrice, "gwei")} Gwei...`);
            
            await routerContract.swapExactETHForTokens(
              0,
              [WETH_ADDRESS, F1T_TOKEN_ADDRESS],
              signer.address,
              Math.floor(Date.now() / 1000) + 60 * 10,
              {
                value: tx.value,
                gasPrice: attackGasPrice,
                gasLimit: 300000,
              }
            );
            console.log(`✅ ATTACK SENT!`);
          } else {
            console.log("   [DEBUG] Victim gas is too high, not attacking.");
          }
          console.log(`🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n`);
        }
      }
    } catch (err) {
      if (err.message.includes("TransactionTooCommon") || err.message.includes("already known") || err.message.includes("does not exist") || err.message.includes("request failed")) {
        // Ignore common network noise
      } else if (txHash) {
        console.warn(`[WARN] Failed to process ${txHash}: ${err.message}`);
      }
    }
  });
}

// --- MAIN FUNCTION (Now simplified) ---
function startMempoolMonitor(httpServer) {
  console.log("📡 F1 Telemetry: ON AIR");
  console.log("🏎️  F1 Attack Bot: Engaged");
  console.log("-----------------------------------------");

  // Attach WebSocket server
  wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", (ws) => {
    console.log("   [DEBUG] Dashboard client connected to telemetry.");
    // <-- NEW: Send the current alert history to the new client
    ws.send(JSON.stringify(recentAlerts));
  });

  // Call our new standard subscription function
  watchStandardMempool();
}

// Helper function to send data to all connected clients
function broadcast(data) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(data);
    }
  });
}

module.exports = { startMempoolMonitor };