// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  // 1. Get the signer
  // This automatically picks the wallet from your 'accounts' in hardhat.config.js
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  // 2. Get the ContractFactory
  // This is a "factory" that knows how to create instances of your token
  const F1FanToken = await hre.ethers.getContractFactory("F1FanToken");

  // 3. Deploy the contract
  console.log("Deploying F1FanToken...");
  const f1FanToken = await F1FanToken.deploy();

  // 4. Wait for the contract to be mined
  // This is like waiting for the transaction to be confirmed on the blockchain
  await f1FanToken.deployed();

  // 5. Print the success message and contract address
  console.log("---------------------------------");
  console.log("✅ F1FanToken deployed successfully!");
  console.log("Contract address:", f1FanToken.address);
  console.log("Deployed by:", deployer.address);
  console.log("---------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});