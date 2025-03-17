import { ethers } from "ethers";
import MedicineNFT from "../../../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const MedicineNFTABI = MedicineNFT.abi;

/**
 * Fetch medicines for a manufacturer filtered by status.
 * @param {string} walletAddress - The wallet address of the manufacturer.
 * @param {string} status - The medicine status to filter by.
 * @returns {Array} - List of medicines matching the criteria.
 */
export const fetchMedicinesByManufacturerAndStatus = async (walletAddress, status) => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return [];
  }

  try {
    console.log(`🔍 Fetching ${status} medicines for ${walletAddress}...`);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, provider);

    // ✅ Convert status to contract enum
    const statusMapping = { "Pending": 0, "Rejected": 1, "Accepted": 2 };
    const statusEnumValue = statusMapping[status];

    const tokenIds = await contract.getMedicinesByManufacturerAndStatus(walletAddress, statusEnumValue);
    console.log(`✅ ${status} Medicine IDs:`, tokenIds);

    let medicines = [];
    for (const tokenId of tokenIds) {
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;

      console.log(`🌍 Fetching metadata from IPFS: ${ipfsUrl}`);
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();

      medicines.push({
        tokenId: tokenId.toString(),
        name: metadata.name || "Unknown",
        medicineId: metadata.medicineId || "N/A",
        batchNumber: metadata.batchNumber || "N/A",
        description: metadata.description || "No description available",
        status,
        uploadedFiles: metadata.uploadedFiles || [],
      });
    }

    return medicines;
  } catch (error) {
    console.error(`❌ Error fetching ${status} medicines:`, error);
    alert(`Failed to fetch ${status} medicines.`);
    return [];
  }
};
