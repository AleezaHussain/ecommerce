"use client";
import { useState, useEffect } from "react";
import { getPendingManufacturers, updateManufacturerStatus } from "./fetch"; // ✅ Import necessary functions

export default function PendingManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // Stores processing manufacturer ID

  useEffect(() => {
    async function fetchManufacturers() {
      try {
        const data = await getPendingManufacturers();
        setManufacturers(data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchManufacturers();
  }, []);

  // ✅ Function to handle Accept/Reject
  async function handleStatusUpdate(tokenId, newStatus) {
    setProcessing(tokenId); // Indicate processing

    try {
      const success = await updateManufacturerStatus(tokenId, newStatus);
      if (success) {
        // ✅ Remove from pending list after successful update
        setManufacturers((prev) => prev.filter((m) => m.tokenId !== tokenId));
      }
    } catch (error) {
      console.error("❌ Error updating manufacturer status:", error);
    } finally {
      setProcessing(null); // Reset processing state
    }
  }

  return (
    <div>
      <h1>Pending Manufacturers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {manufacturers.map((manufacturer, index) => (
            <li key={index}>
              <p><strong>Name:</strong> {manufacturer.manufacturerName}</p>
              <p><strong>Wallet Address:</strong> {manufacturer.walletAddress}</p>
              <p><strong>License Number:</strong> {manufacturer.licenceNo}</p>
              <p><strong>Certification Number:</strong> {manufacturer.certificationNumber}</p>
              <p><strong>Phone Number:</strong> {manufacturer.phoneNumber}</p>
              <p><strong>Website:</strong> <a href={manufacturer.website} target="_blank" rel="noopener noreferrer">{manufacturer.website}</a></p>

              {/* ✅ Display PDF Link */}
              {manufacturer.pdfCID && (
                <p>
                  <strong>Certification PDF:</strong>{" "}
                  <a href={`https://ipfs.io/ipfs/${manufacturer.pdfCID}`} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </p>
              )}

              {/* ✅ Accept & Reject Buttons */}
              <button 
                onClick={() => handleStatusUpdate(manufacturer.tokenId, "Approved")}
                disabled={processing === manufacturer.tokenId}
              >
                {processing === manufacturer.tokenId ? "Processing..." : "✅ Accept"}
              </button>

              <button 
                onClick={() => handleStatusUpdate(manufacturer.tokenId, "Rejected")}
                disabled={processing === manufacturer.tokenId}
                style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
              >
                {processing === manufacturer.tokenId ? "Processing..." : "❌ Reject"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
