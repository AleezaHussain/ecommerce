"use client";
import { useState } from "react";
import { fetchMedicinesByStatus } from "./fetch"; // ✅ Import function

export default function AcceptedRejectedPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Accepted"); // Default to Accepted

  const handleFetchMedicines = async (status) => {
    setLoading(true);
    setCurrentStatus(status);
    const medicinesData = await fetchMedicinesByStatus(status);
    setMedicines(medicinesData);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{currentStatus} Medicines</h1>

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={() => handleFetchMedicines("Accepted")}
          disabled={loading}
          style={{ padding: "10px 15px", marginRight: "10px", cursor: "pointer" }}
        >
          ✅ View Accepted
        </button>

        <button 
          onClick={() => handleFetchMedicines("Rejected")}
          disabled={loading}
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          ❌ View Rejected
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}

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
            </li>
          ))}
        </ul>
      ) : (
        <p>No {currentStatus.toLowerCase()} medicines found.</p>
      )}
    </div>
  );
}
