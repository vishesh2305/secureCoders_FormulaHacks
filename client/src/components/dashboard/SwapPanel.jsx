// --- HYBRID DEMO VERSION: Live TX + Simulation Trigger + CORRECT SIGNING ---
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../context/WalletContext';
import { 
  ROUTER_INTERFACE,
  UNISWAP_V2_ROUTER_ADDRESS,
  WETH_ADDRESS,
  F1T_TOKEN_ADDRESS,
  PROTECTED_TX_API_URL
} from '../../constants';
import './SwapPanel.css';

export const SwapPanel = () => {
  const { provider, signer, walletAddress, simulateAttack } = useWallet();
  const [amount, setAmount] = useState('0.001');
  const [isProtected, setIsProtected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSwap = async (e) => {
    e.preventDefault();
    if (!signer || !walletAddress || !provider) { // Check for provider too
      alert("Please connect your wallet first.");
      return;
    }
    setLoading(true);
    const gasLimit = 300000;

    try {
      const ethAmount = ethers.utils.parseEther(amount);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
      const path = [WETH_ADDRESS, F1T_TOKEN_ADDRESS];

      if (isProtected) {
        // --- SOLUTION: "DRS PROTECTION" ON (LIVE) ---
        console.log("DRS ON: Sending PROTECTED transaction...");
        
        const txData = ROUTER_INTERFACE.encodeFunctionData("swapExactETHForTokens", [0, path, walletAddress, deadline]);
        
        // --- FIX 2: Create the raw transaction params for MetaMask ---
        const txParams = {
          from: walletAddress,
          to: UNISWAP_V2_ROUTER_ADDRESS,
          data: txData,
          value: ethAmount.toHexString(), // Must be hex
          gas: ethers.utils.hexlify(gasLimit), // Must be hex
          // Note: We don't specify gasPrice, MetaMask will add it.
        };

        // --- FIX 3: Use provider.send("eth_signTransaction", ...) ---
        // This is the correct way to ask MetaMask to sign a transaction
        // without sending it.
        console.log("   Asking MetaMask to sign the transaction...");
        const signedTx = await provider.send("eth_signTransaction", [txParams]);
        console.log("   Transaction signed!");

        const response = await fetch(PROTECTED_TX_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signedRawTransaction: signedTx }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Relay Error');
        alert(`PROTECTED Tx Sent! Hash: ${data.hash}\nCheck the dashboard, it saw nothing!`);

      } else {
        // --- PROBLEM: "DRS PROTECTION" OFF (LIVE) ---
        console.log("DRS OFF: Sending PUBLIC transaction (vulnerable)...");
        
        const routerContract = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, ROUTER_INTERFACE, signer);
        
        const txResponse = await routerContract.swapExactETHForTokens(
          0, path, walletAddress, deadline,
          { value: ethAmount, gasLimit: gasLimit }
        );
        
        // --- TRIGGER SIMULATION ON SUCCESS ---
        simulateAttack(txResponse.hash, amount);
        alert(`PUBLIC Tx Sent! Hash: ${txResponse.hash}\nCheck the dashboard! An attack was detected!`);
      }
    } catch (err) {
      console.error(err);
      // Check for MetaMask user rejection
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        alert("Transaction rejected.");
      } else {
        alert(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the JSX is identical to your file, no changes needed)
  return (
    <div className="swap-panel-card">
      <form onSubmit={handleSwap}>
        <div className="swap-header">
          <h3 className="swap-title">DRIVER'S SEAT</h3>
        </div>
        <div className="swap-body">
          <div className="swap-group">
            <label htmlFor="amount">Swap ETH</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="swap-input"
            />
            <span className="swap-token">ETH</span>
          </div>
          <div className="swap-group">
            <label>For F1T</label>
            <input
              type="text"
              value="~10,000"
              readOnly
              className="swap-input disabled"
            />
            <span className="swap-token">F1T</span>
          </div>
          <div className="drs-toggle">
            <label htmlFor="drs-toggle-btn" className="drs-label">
              🛡️ DRS Protection (MEV Shield)
            </label>
            <button
              type="button"
              id="drs-toggle-btn"
              onClick={() => setIsProtected(!isProtected)}
              className={`drs-button ${isProtected ? 'active' : ''}`}
            >
              {isProtected ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="execute-swap-btn"
          >
            {loading ? 'SENDING...' : 'EXECUTE SWAP'}
          </button>
        </div>
      </form>
    </div>
  );
};