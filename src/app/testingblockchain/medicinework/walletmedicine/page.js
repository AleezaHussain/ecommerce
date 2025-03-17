"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchMedicinesByManufacturerAndStatus } from "./fetch";

export default function MyMedicinesPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [medicines, setMedicines] = useState({
    pending: [],
    accepted: [],
    rejected: []
  });
  const [loading, setLoading] = useState(false);

  // ✅ Detect MetaMask Wallet Address on Page Load
  useEffect(() => {
    const detectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          console.log("✅ Detected Wallet Address:", address);
          setWalletAddress(address);
          fetchAllMedicines(address);
        } catch (error) {
          console.error("❌ Error detecting wallet:", error);
        }
      } else {
        alert("❌ MetaMask not detected. Please install MetaMask.");
      }
    };

    detectWallet();
  }, []);

  // ✅ Fetch Accepted, Rejected & Pending Medicines for the Wallet
  const fetchAllMedicines = async (address) => {
    setLoading(true);
    const pending = await fetchMedicinesByManufacturerAndStatus(address, "Pending");
    const accepted = await fetchMedicinesByManufacturerAndStatus(address, "Accepted");
    const rejected = await fetchMedicinesByManufacturerAndStatus(address, "Rejected");

    setMedicines({ pending, accepted, rejected });
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>My Medicines</h1>

      {walletAddress ? (
        <p><strong>Connected Wallet:</strong> {walletAddress}</p>
      ) : (
        <p>🔍 Detecting wallet...</p>
      )}

      <button 
        onClick={() => fetchAllMedicines(walletAddress)} 
        disabled={loading || !walletAddress} 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginBottom: "20px" }}
      >
        {loading ? "Loading..." : "🔄 Refresh Medicines"}
      </button>

      <MedicineList title="Pending Medicines" medicines={medicines.pending} color="orange" />
      <MedicineList title="Accepted Medicines" medicines={medicines.accepted} color="green" />
      <MedicineList title="Rejected Medicines" medicines={medicines.rejected} color="red" />
    </div>
  );
}

// ✅ Component to Display Medicines
const MedicineList = ({ title, medicines, color }) => (
  <div style={{ marginTop: "20px" }}>
    <h2 style={{ color }}>{title} ({medicines.length})</h2>
    {medicines.length > 0 ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {medicines.map((medicine, index) => (
          <li key={index} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
            <h3>Token ID: {medicine.tokenId}</h3>
            <p><strong>Name:</strong> {medicine.name}</p>
            <p><strong>Medicine ID:</strong> {medicine.medicineId}</p>
            <p><strong>Batch Number:</strong> {medicine.batchNumber}</p>
            <p><strong>Description:</strong> {medicine.description}</p>
            <p><strong>Status:</strong> {medicine.status}</p>

            {medicine.uploadedFiles.length > 0 && (
              <div>
                <h4>Uploaded Files:</h4>
                {medicine.uploadedFiles.map((file, i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <p><strong>File Name:</strong> {file.fileName}</p>
                    {file.mimeType.includes("image") ? (
                      <img src={`https://ipfs.io/ipfs/${file.ipfsHash}`} alt={file.fileName} style={{ maxWidth: "100px", marginRight: "10px" }} />
                    ) : (
                      <a href={`https://ipfs.io/ipfs/${file.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                        📄 View {file.fileName}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No {title.toLowerCase()} found.</p>
    )}
  </div>
);
