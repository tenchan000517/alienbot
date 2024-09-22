// src/components/WalletConnect.js
import React, { useState } from 'react';

const WalletConnect = ({ onConnect }) => {
  const [address, setAddress] = useState('');

  const handleConnect = () => {
    // TODO: Implement actual TON wallet connection logic
    onConnect(address);
  };

  return (
    <div className="wallet-connect">
      <h2>Connect your TON wallet</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address"
      />
      <button onClick={handleConnect}>Connect Wallet</button>
    </div>
  );
};

export default WalletConnect;