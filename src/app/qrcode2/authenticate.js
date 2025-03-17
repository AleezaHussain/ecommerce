import { ethers } from "ethers";
import MedicineNFT from "../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json"; // ✅ Import ABI

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS; // Ensure this is correctly set in your .env file
const MedicineNFTABI = MedicineNFT.abi;

/**
 * Verifies medicine using the scanned IPFS hash.
 */
export const verifyMedicineByQR = async (qrCodeData) => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return false;
  }

  try {
    let ipfsHash = qrCodeData.trim(); // Directly use the scanned QR data

    // Validate IPFS hash format
    if (!ipfsHash.match(/^Qm[1-9A-Za-z]{44}$|^bafy[1-9A-Za-z]{48,}$/)) {
      alert("⚠ Invalid QR code. Expected an IPFS hash.");
      console.warn("⚠ Invalid IPFS hash format:", ipfsHash);
      return false;
    }

    console.log(`🔍 Verifying extracted IPFS hash:`, ipfsHash);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, provider);

    // Call blockchain function with the correct hash
    console.log("📡 Calling blockchain function with hash:", ipfsHash);
    const isValid = await contract.verifyMedicineByQR(ipfsHash);
    
    console.log("🔗 Blockchain raw response:", isValid);

    if (isValid) {
      console.log("✅ Medicine is authentic.");
      alert("✔ Medicine is verified and authentic!");
    } else {
      console.log("❌ Medicine is NOT authentic.");
      alert("⚠ Warning: This medicine is not verified or not accepted!");
    }

    return isValid;
  } catch (error) {
    console.error("❌ Error verifying QR code:", error);
    alert("Failed to verify QR code.");
    return false;
  }
};
