const { ethers } = require("ethers");
const { WebSocketServer } = require("ws");

// CONFIG (Same as attacker)
const F1T_TOKEN_ADDRESS = "0x43E6e30A1d68AAAbA9Fa68327b37607C6b3B6f7F";
const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
];
const iface = new ethers.utils.Interface(ROUTER_ABI);
const provider = new ethers.providers.WebSocketProvider(process.env.SEPOLIA_WSS_URL);

let wss; // Will be our WebSocket Server

function startMempoolMonitor(httpServer) {
  console.log("📡 F1 Telemetry: ON AIR");
  wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    console.log("Dashboard client connected to telemetry.");
  });

  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx || !tx.to) return;

      // Check if it's our target swap
      if (
        tx.to.toLowerCase() === UNISWAP_V2_ROUTER_ADDRESS.toLowerCase() &&
        tx.data.startsWith("0x7ff36ab5")
      ) {
        const decodedTx = iface.decodeFunctionData(
          "swapExactETHForTokens",
          tx.data
        );
        const path = decodedTx.path;

        if (path.length > 0 && path[path.length - 1].toLowerCase() === F1T_TOKEN_ADDRESS.toLowerCase()) {
          
          // --- F1 THEME: "AI Risk Meter" Simulation ---
          let risk = "Low";
          const gasGwei = parseFloat(ethers.utils.formatUnits(tx.gasPrice, "gwei"));
          if (gasGwei > 20) risk = "High"; // High gas = high risk
          else if (gasGwei > 10) risk = "Medium";

          const telemetryData = {
            hash: tx.hash,
            from: tx.from,
            value: ethers.utils.formatEther(tx.value),
            gas: gasGwei.toFixed(2),
            risk: risk,
          };

          // Broadcast this juicy data to all connected dashboards
          broadcast(JSON.stringify(telemetryData));
        }
      }
    } catch (err) {
      // Ignore
    }
  });
}

// Helper function to send data to all connected clients
function broadcast(data) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = WebSocket.OPEN
      client.send(data);
    }
  });
}

module.exports = { startMempoolMonitor };