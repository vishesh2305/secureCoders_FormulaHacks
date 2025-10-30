// --- FULLY CORRECTED FOR ETHERS V5 FLASHBOTS ---
const express = require("express");
const { ethers } = require("ethers");
const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const router = express.Router();

router.post("/send-protected-tx", async (req, res) => {
  const { signedRawTransaction } = req.body;
  if (!signedRawTransaction) {
    return res.status(400).send("signedRawTransaction is required");
  }
  console.log("🛡️ DRS Protection: Received request for private tx...");

  try {
    const httpProvider = new ethers.providers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    const authSigner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY,
      httpProvider
    );
    const flashbotsProvider = await FlashbotsBundleProvider.create(
      httpProvider,
      authSigner,
      "https://relay-sepolia.flashbots.net",
      "sepolia"
    );

    const blockNumber = await httpProvider.getBlockNumber();
    console.log(`   Sending private tx, targeting block: ${blockNumber + 1}`);
    
    // FIX 1: The method just wants the tx object
    const flashbotsResponse = await flashbotsProvider.sendPrivateTransaction(
      { tx: signedRawTransaction },
      { targetBlockNumber: blockNumber + 1 }
    );

    if (flashbotsResponse.error) {
      console.error("   [ERROR] Flashbots Error:", flashbotsResponse.error.message);
      return res.status(500).send(flashbotsResponse.error.message);
    }
    
    // FIX 2: The hash is inside the 'transaction' object
    const txHash = flashbotsResponse.transaction.hash;
    
    console.log(`✅ Private Tx submitted! Hash: ${txHash}`);
    res.status(200).json({ hash: txHash });

  } catch (err) {
    console.error("   [CRASH] Failed to send private tx:", err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;