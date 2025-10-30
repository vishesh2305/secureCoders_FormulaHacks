const express = require("express");
const { ethers } = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const router = express.Router();

// This is the core "private tunnel" endpoint
router.post("/send-protected-tx", async (req, res) => {
  const { signedRawTransaction } = req.body;

  if (!signedRawTransaction) {
    return res.status(400).send("signedRawTransaction is required");
  }

  console.log("🛡️ DRS Protection: Received request for private tx...");

  try {
    // 1. Setup providers
    // We use the HTTPS RPC for sending, not WSS
    const httpProvider = new ethers.providers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    // This wallet *must* have ETH. It's used to sign the *bundle* (not the tx itself).
    const authSigner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY,
      httpProvider
    );

    // 2. Connect to the Sepolia Flashbots Relay
    const flashbotsProvider = await FlashbotsBundleProvider.create(
      httpProvider,
      authSigner,
      "https://relay-sepolia.flashbots.net", // Sepolia Relay URL
      "sepolia" // Network name
    );

    // 3. Send the private transaction
    // We are sending a single-tx bundle
    const blockNumber = await httpProvider.getBlockNumber();
    
    console.log("Sending private tx to Flashbots relay...");
    const flashbotsResponse = await flashbotsProvider.sendPrivateTransaction(
      {
        tx: signedRawTransaction,
        signer: authSigner, // Not used for a single tx, but good practice
      },
      { targetBlockNumber: blockNumber + 1 } // Target the next block
    );

    if (flashbotsResponse.error) {
      console.error("Flashbots Error:", flashbotsResponse.error.message);
      return res.status(500).send(flashbotsResponse.error.message);
    }

    const txHash = flashbotsResponse.transactionHash;
    console.log(`✅ Private Tx submitted! Hash: ${txHash}`);
    res.status(200).json({ hash: txHash });

  } catch (err) {
    console.error("Failed to send private tx:", err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;