require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // This line loads your .env file

// This line imports the task function
const { task } = require("hardhat/config"); 

// Get the environment variables
const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.WALLET_PRIVATE_KEY;

if (!sepoliaRpcUrl || !privateKey) {
  console.error("Please set SEPOLIA_RPC_URL and WALLET_PRIVATE_KEY in your .env file");
  process.exit(1); // Exit the script with an error
}

console.log("✅ Config Loaded Successfully:");
console.log("RPC URL:", sepoliaRpcUrl);

// --- THIS IS THE NEW TASK WE ARE ADDING ---
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  console.log("Account loaded from private key:");
  for (const signer of signers) {
    console.log(signer.address);
  }
});
// -------------------------------------------

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat", // Added for clarity
  networks: {
    // Define the sepolia network
    sepolia: {
      url: sepoliaRpcUrl, // The RPC URL we got from .env
      accounts: [privateKey] // The wallet private key from .env
    },
    // This is the default in-memory network
    hardhat: {
    }
  }
};