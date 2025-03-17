"use client";
import { useState } from "react";
import { fetchPendingMedicines } from "./fetchfunction"; // ✅ Import function
import { updateMedicineStatus } from "./fetchfunction"; // ✅ Import status update function

export default function PendingMedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleFetchMedicines = async () => {
    setLoading(true);
    const medicinesData = await fetchPendingMedicines();
    setMedicines(medicinesData);
    setLoading(false);
  };

  const handleUpdateStatus = async (tokenId, newStatus) => {
    setUpdating(true);
    const success = await updateMedicineStatus(tokenId, newStatus);
    
    if (success) {
      setMedicines((prev) => prev.filter((medicine) => medicine.tokenId !== tokenId)); // ✅ Remove updated item from UI
    }
    setUpdating(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Pending Medicines</h1>
      <button 
        onClick={handleFetchMedicines} 
        disabled={loading} 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginBottom: "20px" }}
      >
        {loading ? "Loading..." : "🔍 Fetch Pending Medicines"}
      </button>

      {medicines.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {medicines.map((medicine, index) => (
            <li key={index} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
              <h3>Token ID: {medicine.tokenId}</h3>
              <p><strong>Name:</strong> {medicine.name}</p>
              <p><strong>Medicine ID:</strong> {medicine.medicineId}</p>
              <p><strong>Batch Number:</strong> {medicine.batchNumber}</p>
              <p><strong>Manufacture Date:</strong> {medicine.manufactureDate}</p>
              <p><strong>Expiry Date:</strong> {medicine.expiryDate}</p>
              <p><strong>Excipients:</strong> {medicine.excipients.join(", ")}</p>
              <p><strong>Medicine Types:</strong> {medicine.types.join(", ")}</p>
              <p><strong>Description:</strong> {medicine.description}</p>
              <p><strong>Wallet Address:</strong> {medicine.walletAddress}</p>
              <p><strong>Status:</strong> {medicine.status}</p>

              {/* ✅ Display Uploaded Files */}
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

              {/* ✅ Accept & Reject Buttons */}
              <div style={{ marginTop: "15px" }}>
                <button 
                  onClick={() => handleUpdateStatus(medicine.tokenId, "Accepted")} 
                  disabled={updating}
                  style={{ padding: "8px 15px", backgroundColor: "green", color: "white", border: "none", cursor: "pointer", marginRight: "10px" }}
                >
                  ✅ Accept
                </button>

                <button 
                  onClick={() => handleUpdateStatus(medicine.tokenId, "Rejected")} 
                  disabled={updating}
                  style={{ padding: "8px 15px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
                >
                  ❌ Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending medicines found.</p>
      )}
    </div>
  );
}
