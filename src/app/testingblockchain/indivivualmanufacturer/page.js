"use client";
import React, { useState, useEffect } from "react";
import useManufacturerDetails from "./fetch";

export default function ManufacturerDetails() {
  const { walletAddress, manufacturerDetails, loading, error } = useManufacturerDetails();
  const [manufacturerData, setManufacturerData] = useState(null);
  const [dataError, setDataError] = useState(null);

  // Fetch the manufacturer data from IPFS if manufacturerDetails exist
  useEffect(() => {
    if (manufacturerDetails && manufacturerDetails.jsonCID) {
      async function fetchManufacturerData() {
        try {
          const response = await fetch(`https://ipfs.io/ipfs/${manufacturerDetails.jsonCID}`);
          if (!response.ok) throw new Error("Failed to fetch manufacturer data");
          const data = await response.json();
          setManufacturerData(data); // Store the data
        } catch (err) {
          setDataError("Error fetching manufacturer data from IPFS.");
        }
      }

      fetchManufacturerData();
    }
  }, [manufacturerDetails]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Manufacturer Details</h1>
      <p><strong>Wallet Address:</strong> {walletAddress}</p>
      {manufacturerDetails ? (
        <div>
          <p><strong>JSON CID:</strong> {manufacturerDetails.jsonCID}</p>
          <p><strong>PDF CID:</strong> {manufacturerDetails.pdfCID}</p>
          <p><strong>Status:</strong> {manufacturerDetails.status === "0" ? "Pending" : manufacturerDetails.status === "1" ? "Approved" : "Rejected"}</p>
        </div>
      ) : (
        <p>No manufacturer details found.</p>
      )}

      {/* Show manufacturer data if available */}
      {manufacturerData ? (
        <div>
          <h2>Manufacturer Information:</h2>
          <p><strong>Name:</strong> {manufacturerData.manufacturerName}</p>
          <p><strong>License Number:</strong> {manufacturerData.licenseNo}</p>
          <p><strong>Certification Number:</strong> {manufacturerData.certificationNumber}</p>
          <p><strong>Phone Number:</strong> {manufacturerData.phoneNumber}</p>
          <p><strong>Website:</strong> <a href={manufacturerData.website} target="_blank" rel="noopener noreferrer">{manufacturerData.website}</a></p>

          {/* Display PDF Link if available */}
          {manufacturerDetails.pdfCID && (
            <p>
              <strong>Certification PDF:</strong>{" "}
              <a href={`https://ipfs.io/ipfs/${manufacturerDetails.pdfCID}`} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </p>
          )}
        </div>
      ) : (
        <p>{dataError || "Fetching manufacturer data from IPFS..."}</p>
      )}
    </div>
  );
}
