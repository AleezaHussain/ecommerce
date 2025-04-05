import { ethers } from "ethers";
import MedicineNFT from "../../../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json"; // ✅ Import ABI

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS; // ✅ Ensure this is correctly set in your .env file
const MedicineNFTABI = MedicineNFT.abi;

/**
 * Fetch pending medicines from the blockchain and retrieve their metadata from IPFS.
 * @returns {Array} - List of pending medicines with full details.
 */
export const fetchPendingMedicines = async () => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return [];
  }

  try {
    console.log("🔍 Fetching pending medicines...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, provider);

    const pendingTokenIds = await contract.getPendingMedicines();
    console.log("✅ Pending Medicine IDs:", pendingTokenIds);

    let pendingMedicines = [];
    for (const tokenId of pendingTokenIds) {
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;

      console.log(`🌍 Fetching metadata from IPFS: ${ipfsUrl}`);
      
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();

      // ✅ Extract uploaded files
      const uploadedFiles = metadata.uploadedFiles || [];

      pendingMedicines.push({
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
        status: metadata.status || "Pending",
        uploadedFiles,
      });
    }

    console.log("📜 Full Pending Medicines Data:", pendingMedicines);
    return pendingMedicines;
  } catch (error) {
    console.error("❌ Error fetching pending medicines:", error);
    alert("Failed to fetch pending medicines.");
    return [];
  }
};





/**
 * Updates the status of a medicine on the blockchain.
 * @param {string} tokenId - The token ID of the medicine.
 * @param {string} newStatus - The new status ("Accepted" or "Rejected").
 * @returns {boolean} - Returns true if the transaction is successful.
 */
export const updateMedicineStatus = async (tokenId, newStatus) => {
    if (!window.ethereum) {
      alert("❌ MetaMask not detected. Please install MetaMask.");
      return false;
    }
  
    try {
      console.log(`🔄 Updating status of Token ID ${tokenId} to ${newStatus}...`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFTABI, signer);
  
      // ✅ Convert status to contract enum value
      const statusMapping = { "Pending": 0, "Rejected": 1, "Accepted": 2 };
      const statusEnumValue = statusMapping[newStatus];
  
      // ✅ Send transaction to update status
      const tx = await contract.updateStatus(tokenId, statusEnumValue);
      const receipt = await tx.wait(); // Wait for confirmation
  
      if (receipt.status === 1) {
        console.log(`✅ Medicine status updated successfully: Token ID ${tokenId} -> ${newStatus}`);
        return true;
      } else {
        console.error("❌ Transaction failed");
        return false;
      }
    } catch (error) {
      console.error("❌ Error updating medicine status:", error);
      throw error; // Throw the error to be caught by the calling function
    }
  };