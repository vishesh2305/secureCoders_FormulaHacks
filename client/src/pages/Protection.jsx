// src/pages/Protection.jsx

import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import DashboardPlaceholder from '../components/dashboard/DashboardPlaceholder';
// We no longer need ethers here
import './Protection.css'; 

const Protection = () => {
  const { isConnected } = useWallet(); // We only need to check if connected
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSendProtectedTx = async () => {
    setStatus('loading');
    setMessage('Sending transaction details to secure relay...');

    try {
      // 1. Send the UNSIGNED transaction details to our backend
      const response = await fetch('http://localhost:8080/api/send-protected-tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the form data as JSON
        body: JSON.stringify({ recipient, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not OK, data is the error message
        throw new Error(data || 'Backend failed to send transaction');
      }

      // Success
      setStatus('success');
      setMessage(`✅ Protected TX submitted by server! Hash: ${data.hash}`);
      setRecipient('');
      setAmount('');

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.message);
    }
  };

  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">MEV Protection</h1>
          <p className="page-subtitle">
            Wallet required to configure protection settings
          </p>
        </div>
        <DashboardPlaceholder />
      </>
    );
  }

  // --- Render full component ---
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">MEV Protection (DRS)</h1>
        <p className="page-subtitle">
          Send private transactions via the F1 Security Relay
        </p>
      </div>

      <div className="protection-container">
        {/* Left Card: Form */}
        <div className="protection-card">
          <h3 className="protection-title">🛡️ New Protected Transaction</h3>
          <p className="protection-description">
            This transaction will be built, signed, and sent **by the server** directly to miners via Flashbots, protecting it from the mempool.
          </p>

          <div className="form-group">
            <label htmlFor="recipient">Recipient Address</label>
            <input
              type="text"
              id="recipient"
              className="form-input"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (ETH)</label>
            <input
              type="text"
              id="amount"
              className="form-input"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="submit-button"
            onClick={handleSendProtectedTx}
            disabled={status === 'loading' || !recipient || !amount}
          >
            {status === 'loading' ? 'Submitting...' : 'Send Protected Transaction'}
          </button>

          {message && (
            <div className={`status-message ${status}`}>
              {message}
            </div>
          )}
        </div>

        {/* Right Card: Info */}
        <div className="protection-card">
          <h3 className="protection-title">🚦 How This Works (New)</h3>
          <p className="protection-description">
            Because browser wallets block `eth_signTransaction`, we use a new workflow:
            <br /><br />
            1. You enter the transaction details (To, Amount) here.
            <br />
            2. This form sends those details to your backend.
            <br />
            3. The backend server (using `WALLET_PRIVATE_KEY`) populates, **signs**, and sends the transaction privately using the Flashbots provider.
            <br /><br />
            **Note:** The transaction is sent from the *server's address*, not your connected MetaMask wallet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Protection;