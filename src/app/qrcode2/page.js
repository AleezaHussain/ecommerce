"use client";
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { verifyMedicineByQR } from "./authenticate"; // Import blockchain verification function

export default function QRScannerPage() {
  const [qrResult, setQrResult] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeSupportedFormats.QR_CODE],
      defaultCameraId: "environment",
    });

    scanner.render(
      async (decodedText) => {
        setQrResult(decodedText);
        const isAuthentic = await verifyMedicineByQR(decodedText); // Call blockchain function
        setVerificationStatus(isAuthentic ? "✔ Authentic Medicine" : "⚠ Not Verified!");
        scanner.clear();
      },
      (errorMessage) => {
        console.warn("QR Scan Error:", errorMessage);
      }
    );

    scannerRef.current = scanner;
    return () => scanner.clear();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

      {/* QR Scanner */}
      <div id="reader" className="w-64 h-64"></div>

      {/* Show scanned QR code data */}
      {qrResult && (
        <p className="mt-4 text-blue-600 font-bold">Scanned Data: {qrResult}</p>
      )}

      {/* Show verification status */}
      {verificationStatus && (
        <p className={`mt-2 font-bold ${verificationStatus.includes("✔") ? "text-green-600" : "text-red-600"}`}>
          {verificationStatus}
        </p>
      )}
    </div>
  );
}
