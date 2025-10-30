// --- FULLY CORRECTED FOR ETHERS V5 SIGNER WORKFLOW ---
const express = require("express");
const { ethers } = require("ethers");
const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const router = express.Router();

router.post("/send-protected-tx", async (req, res) => {
  const { recipient, amount } = req.body;
  if (!recipient || !amount) {
    return res.status(400).send("recipient and amount are required");
  }
  console.log("🛡️ DRS Protection: Received request for private tx...");
  console.log(`   To: ${recipient}, Amount: ${amount} ETH`);

  try {
    const httpProvider = new ethers.providers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );

    // This signer is for *authenticating* with Flashbots AND *signing* the tx
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

    // --- NEW FIX: Let the signer populate the transaction ---
    console.log("   Populating transaction (nonce, gas, etc)...");
    
    // 1. Define the core transaction details
    const tx = {
      to: recipient,
      value: ethers.utils.parseEther(amount),
      gasLimit: 21000,
    };

    // 2. Let the wallet/signer automatically fill in the nonce and gas price
    const populatedTx = await authSigner.populateTransaction(tx);
    
    console.log(`   Transaction populated. Nonce: ${populatedTx.nonce}`);
    console.log(`   Sending private tx targeting next block...`);

    // 3. Send the now-populated transaction
    const flashbotsResponse = await flashbotsProvider.sendPrivateTransaction(
      {
        signer: authSigner,
        transaction: populatedTx, // Pass the populated transaction
      },
      { targetBlockNumber: (await httpProvider.getBlockNumber()) + 1 }
    );
    // --- END FIX ---

    if (flashbotsResponse.error) {
      console.error("   [ERROR] Flashbots Error:", flashbotsResponse.error.message);
      return res.status(500).send(flashbotsResponse.error.message);
    }
    
    const txHash = flashbotsResponse.transaction.hash;
    
    console.log(`✅ Private Tx submitted! Hash: ${txHash}`);
    res.status(200).json({ hash: txHash });

  } catch (err) {
    console.error("   [CRASH] Failed to send private tx:", err.message);
    console.error(err.stack); // Also log the stack trace
    res.status(500).send(err.message);
  }
});

module.exports = router;