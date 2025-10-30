// This is the new component for our demo logic
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../hooks/useWallet';
import { 
  ROUTER_INTERFACE,
  UNISWAP_V2_ROUTER_ADDRESS,
  WETH_ADDRESS,
  F1T_TOKEN_ADDRESS,
  PROTECTED_TX_API_URL
} from '../../constants';
import './SwapPanel.css';

export const SwapPanel = () => {
  const { signer, walletAddress } = useWallet();
  const [amount, setAmount] = useState('0.001');
  const [isProtected, setIsProtected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSwap = async (e) => {
    e.preventDefault();
    if (!signer || !walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    setLoading(true);

    // --- FIX: We set a manual gas limit to skip the buggy estimateGas() call ---
    const gasLimit = 300000;

    try {
      const ethAmount = ethers.utils.parseEther(amount);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 mins
      const path = [WETH_ADDRESS, F1T_TOKEN_ADDRESS];

      // --- THIS IS THE CORE DEMO LOGIC ---
      if (isProtected) {
        // --- SOLUTION: "DRS PROTECTION" ON ---
        console.log("DRS ON: Sending PROTECTED transaction...");
        
        // 1. Craft the transaction
        const txData = ROUTER_INTERFACE.encodeFunctionData("swapExactETHForTokens", [
          0,
          path,
          walletAddress,
          deadline,
        ]);
        
        const tx = {
          to: UNISWAP_V2_ROUTER_ADDRESS,
          data: txData,
          value: ethAmount,
          from: walletAddress,
          gasLimit: gasLimit // <-- FIX #1 ADDED HERE
        };

        // 2. Sign the transaction *locally*
        const signedTx = await signer.signTransaction(tx);

        // 3. Send the *signed* tx to our private backend relay
        const response = await fetch(PROTECTED_TX_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signedRawTransaction: signedTx }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Relay Error');

        alert(`PROTECTED Tx Sent! Hash: ${data.hash}\nCheck your attacker bot, it saw nothing!`);

      } else {
        // --- PROBLEM: "DRS PROTECTION" OFF ---
        console.log("DRS OFF: Sending PUBLIC transaction (vulnerable)...");
        
        const routerContract = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, ROUTER_INTERFACE, signer);
        
        // 1. Send the transaction to the *public mempool*
        const txResponse = await routerContract.swapExactETHForTokens(
          0,
          path,
          walletAddress,
          deadline,
          { 
            value: ethAmount, 
            gasLimit: gasLimit // <-- FIX #2 ADDED HERE (removed bad gasPrice)
          }
        );
        
        alert(`PUBLIC Tx Sent! Hash: ${txResponse.hash}\nCheck your attacker bot's terminal!`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

          {/* --- THE F1 "DRS" TOGGLE --- */}
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
            {loading ? 'Sending...' : 'EXECUTE SWAP'}
          </button>
        </div>
      </form>
    </div>
  );
};