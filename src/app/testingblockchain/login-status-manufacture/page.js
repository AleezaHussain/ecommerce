"use client";
import { useState } from "react";
import { getManufacturerStatus, loginWithMetaMask } from "./check";

export default function ManufacturerAuth() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Manufacturer Status Check
  const handleCheckStatus = async () => {
    if (!walletAddress) {
      alert("❌ Please enter a wallet address!");
      return;
    }

    setLoading(true);
    const result = await getManufacturerStatus(walletAddress);
    setStatus(result);
    setLoading(false);
  };

  // ✅ Handle Manufacturer Login
  const handleLogin = async () => {
    setLoading(true);
    const result = await loginWithMetaMask();
    setLoginStatus(result);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🔍 Manufacturer Authentication</h1>

      {/* ✅ Wallet Address Input */}
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />

      <br />

      {/* ✅ Buttons for Status & Login */}
      <button onClick={handleCheckStatus} disabled={loading} style={{ marginRight: "10px", padding: "10px" }}>
        {loading ? "Checking..." : "Check Status"}
      </button>

      <button onClick={handleLogin} disabled={loading} style={{ padding: "10px" }}>
        {loading ? "Logging in..." : "Login with MetaMask"}
      </button>

      {/* ✅ Display Results */}
      {status && <p><strong>Manufacturer Status:</strong> {status}</p>}
      {loginStatus && <p><strong>Login Status:</strong> {loginStatus}</p>}
    </div>
  );
}
