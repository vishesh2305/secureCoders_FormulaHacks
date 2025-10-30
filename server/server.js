require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

// Import our custom modules
const { startMempoolMonitor } = require("./mempoolMonitor");
const flashbotsRelayRoutes = require("./flashbotsRelay");

const app = express();
const port = 8080; // We'll run our backend on this port

// --- Middleware ---
app.use(cors()); // Allow our React app to call this server
app.use(express.json()); // Allow server to read JSON from requests

// --- API Routes ---
app.use("/api", flashbotsRelayRoutes); // Mount our Flashbots API

// Health check endpoint
app.get("/", (req, res) => {
  res.send("F1 Security Backend is online!");
});

// --- Server Setup ---
// We need an HTTP server to share with both Express and WebSockets
const httpServer = http.createServer(app);

// --- Start the Telemetry ---
// Pass the HTTP server to our monitor so it can attach
startMempoolMonitor(httpServer);

// --- Start the Server ---
httpServer.listen(port, () => {
  console.log(`🏁 F1 Security Server listening on http://localhost:${port}`);
});