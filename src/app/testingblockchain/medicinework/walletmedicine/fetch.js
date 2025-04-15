import { ethers } from "ethers";
import MedicineNFT from "../../../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const MedicineNFTABI = MedicineNFT.abi;

/**
 * Fetch all medicines for a manufacturer and return them categorized by status.
 * @param {string} walletAddress - The wallet address of the manufacturer.
 * @returns {Object} - An object containing categorized medicines.
 */
export const fetchMedicinesByManufacturerAndStatus = async (walletAddress) => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return { pending: [], accepted: [], rejected: [] };
  }

  try {
    console.log(`🔍 Fetching all medicines for manufacturer: ${walletAddress}`);

    // Setup provider and contract instance
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, provider);

    // Get all medicine token IDs and their statuses
    const [tokenIds, statuses] = await contract.getAllMedicinesByManufacturer(walletAddress);

    console.log(`✅ Medicine Token IDs retrieved:`, tokenIds);
    console.log(`✅ Corresponding statuses:`, statuses);

    let pending = [];
    let accepted = [];
    let rejected = [];

    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i].toString();
      const statusEnumValue = Number(statuses[i]);

      // Fetch metadata from IPFS
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;

      console.log(`🌍 Fetching metadata from IPFS: ${ipfsUrl}`);
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();

      console.log(`📜 Extracted Metadata from IPFS:`, metadata);

      // Map all necessary metadata fields
      const medicine = {
        tokenId,
        name: metadata.name || "Unknown Medicine",
        medicineId: metadata.medicineId || "N/A",
        batchNumber: metadata.batchNumber || "N/A",
        manufactureDate: metadata.manufactureDate || "N/A",  // ✅ New field
        expiryDate: metadata.expiryDate || "N/A",
        ingredients: metadata.excipients || [],              // ✅ Using excipients as ingredients
        types: metadata.types || [],                         // ✅ New field
        description: metadata.description || "No description available",
        uploadedFiles: metadata.uploadedFiles || [],
        status: statusEnumValue,
      };

      // Categorize medicines
      if (statusEnumValue === 0) pending.push(medicine);
      else if (statusEnumValue === 1) rejected.push(medicine);
      else if (statusEnumValue === 2) accepted.push(medicine);
    }

    console.log(`📌 Categorized Medicines:`, { pending, accepted, rejected });

    return { pending, accepted, rejected };
  } catch (error) {
    console.error(`❌ Error fetching medicines:`, error);
    alert(`Failed to fetch medicines.`);
    return { pending: [], accepted: [], rejected: [] };
  }
};

/**
 * Custom hook to detect wallet and return wallet address.
 */
export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLoading, setWalletLoading] = useState(true);

  useEffect(() => {
    const detectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          console.log("✅ Detected Wallet Address:", address);
          setWalletAddress(address);
        } catch (error) {
          console.error("❌ Error detecting wallet:", error);
        }
      } else {
        alert("❌ MetaMask not detected. Please install MetaMask.");
      }
      setWalletLoading(false);
    };

    detectWallet();
  }, []);

  return { walletAddress, walletLoading };
};
