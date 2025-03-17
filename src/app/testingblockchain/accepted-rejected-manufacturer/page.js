"use client";
import { useState, useEffect } from "react";
import { getApprovedManufacturers, getRejectedManufacturers } from "./fetch";

export default function ApprovedRejectedManufacturers() {
  const [approvedManufacturers, setApprovedManufacturers] = useState([]);
  const [rejectedManufacturers, setRejectedManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const approved = await getApprovedManufacturers();
        const rejected = await getRejectedManufacturers();
        setApprovedManufacturers(approved);
        setRejectedManufacturers(rejected);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Approved & Rejected Manufacturers</h1>

      {loading ? <p>Loading...</p> : (
        <>
          <h2>✅ Approved Manufacturers</h2>
          {approvedManufacturers.length === 0 ? <p>No approved manufacturers found.</p> : (
            <ul>
              {approvedManufacturers.map((manufacturer, index) => (
                <li key={index}>
                  <p><strong>Name:</strong> {manufacturer.manufacturerName}</p>
                  <p><strong>Wallet Address:</strong> {manufacturer.walletAddress}</p>
                  <p><strong>License Number:</strong> {manufacturer.licenceNo}</p>
                  <p><strong>Certification Number:</strong> {manufacturer.certificationNumber}</p>
                  <p><strong>Phone Number:</strong> {manufacturer.phoneNumber}</p>
                  <p><strong>Website:</strong> <a href={manufacturer.website} target="_blank" rel="noopener noreferrer">{manufacturer.website}</a></p>
                  <p><strong>PDF:</strong> <a href={`https://ipfs.io/ipfs/${manufacturer.pdfCID}`} target="_blank" rel="noopener noreferrer">View PDF</a></p>
                </li>
              ))}
            </ul>
          )}

          <h2>❌ Rejected Manufacturers</h2>
          {rejectedManufacturers.length === 0 ? <p>No rejected manufacturers found.</p> : (
            <ul>
              {rejectedManufacturers.map((manufacturer, index) => (
                <li key={index}>
                  <p><strong>Name:</strong> {manufacturer.manufacturerName}</p>
                  <p><strong>Wallet Address:</strong> {manufacturer.walletAddress}</p>
                  <p><strong>License Number:</strong> {manufacturer.licenceNo}</p>
                  <p><strong>Certification Number:</strong> {manufacturer.certificationNumber}</p>
                  <p><strong>Phone Number:</strong> {manufacturer.phoneNumber}</p>
                  <p><strong>Website:</strong> <a href={manufacturer.website} target="_blank" rel="noopener noreferrer">{manufacturer.website}</a></p>
                  <p><strong>PDF:</strong> <a href={`https://ipfs.io/ipfs/${manufacturer.pdfCID}`} target="_blank" rel="noopener noreferrer">View PDF</a></p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
