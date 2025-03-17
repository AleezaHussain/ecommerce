import { ethers } from "ethers";
import MedicineNFT from "../../../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json"; // ✅ Import ABI

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const MedicineNFTABI = MedicineNFT.abi;

/**
 * Fetches accepted or rejected medicines from the blockchain.
 * @param {string} status - The status to filter by ("Accepted" or "Rejected").
 * @returns {Array} - List of medicines with full details.
 */
export const fetchMedicinesByStatus = async (status) => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return [];
  }

  try {
    console.log(`🔍 Fetching ${status} medicines...`);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, provider);

    // ✅ Use the correct function names
    let tokenIds;
    if (status === "Accepted") {
      tokenIds = await contract.getApprovedMedicines(); // ✅ Fetch approved medicines
    } else if (status === "Rejected") {
      tokenIds = await contract.getRejectedMedicines(); // ✅ Fetch rejected medicines
    } else {
      console.error(`❌ Invalid status: ${status}`);
      return [];
    }

    console.log(`✅ ${status} Medicine IDs:`, tokenIds);

    let medicines = [];
    for (const tokenId of tokenIds) {
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;

      console.log(`🌍 Fetching metadata from IPFS: ${ipfsUrl}`);
      
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();

      // ✅ Extract uploaded files
      const uploadedFiles = metadata.uploadedFiles || [];

      medicines.push({
        tokenId: tokenId.toString(),
        name: metadata.name || "Unknown",
        medicineId: metadata.medicineId || "N/A",
        batchNumber: metadata.batchNumber || "N/A",
        manufactureDate: metadata.manufactureDate || "N/A",
        expiryDate: metadata.expiryDate || "N/A",
        excipients: metadata.excipients || [],
        types: metadata.types || [],
        description: metadata.description || "No description available",
        walletAddress: metadata.walletAddress || "N/A",
        status,
        uploadedFiles,
      });
    }

    console.log(`📜 Full ${status} Medicines Data:`, medicines);
    return medicines;
  } catch (error) {
    console.error(`❌ Error fetching ${status} medicines:`, error);
    alert(`Failed to fetch ${status} medicines.`);
    return [];
  }
};
