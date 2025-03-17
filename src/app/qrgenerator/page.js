"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import

const QRGeneratorPage = () => {
  const [ipfsHash, setIpfsHash] = useState("");
  const [qrData, setQrData] = useState("");

  const generateQR = () => {
    if (ipfsHash.trim() === "") {
      alert("❌ Please enter a valid IPFS hash.");
      return;
    }
    setQrData(ipfsHash);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">IPFS QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter IPFS Hash (e.g., Qm...XYZ)"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        className="p-3 border border-gray-400 rounded-md w-full max-w-md mb-4 text-lg"
      />

      <button
        onClick={generateQR}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
      >
        Generate QR Code
      </button>

      {qrData && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-md">
          <QRCodeCanvas value={qrData} size={200} />
          <p className="mt-3 text-gray-700 text-lg">Scan this QR to get the IPFS Hash</p>
        </div>
      )}
    </div>
  );
};

export default QRGeneratorPage;
