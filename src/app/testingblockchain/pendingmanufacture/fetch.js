import { BrowserProvider, Contract } from "ethers";
import ManufacturerNFTStorage from "../../../../artifacts/blockchain/contracts/manufacturerregistration.sol/ManufacturerNFTStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MANUFACTURE_CONTRACT_ADDRESS;
const ManufacturerNFTABI = ManufacturerNFTStorage.abi;

/**
 * Fetches pending manufacturers from the blockchain and retrieves their metadata from IPFS.
 * @returns {Array} - List of pending manufacturers with full details.
 */
export async function getPendingManufacturers() {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return [];
  }

  try {
    console.log("🔍 Calling getPendingManufacturers() on contract...");
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(CONTRACT_ADDRESS, ManufacturerNFTABI, provider);

    // ✅ Get both token IDs, JSON CIDs, and PDF CIDs from the contract
    const [pendingTokenIds, pendingJSONCIDs, pendingPDFCIDs] = await contract.getPendingManufacturers();
    console.log("✅ Retrieved Pending Manufacturers:", { pendingTokenIds, pendingJSONCIDs, pendingPDFCIDs });

    if (!pendingTokenIds || pendingTokenIds.length === 0) {
      console.warn("⚠ No pending manufacturers found.");
      return [];
    }

    // ✅ Fetch data from IPFS using token ID
    const manufacturerDetails = await Promise.all(
      pendingTokenIds.map(async (tokenId, index) => {
        const jsonCID = pendingJSONCIDs[index];
        const pdfCID = pendingPDFCIDs[index];

        console.log(`🌍 Fetching metadata from IPFS: ${jsonCID}`);

        try {
          const response = await fetch(`https://ipfs.io/ipfs/${jsonCID}`);
          if (!response.ok) throw new Error(`Failed to fetch IPFS data for ${jsonCID}`);

          const data = await response.json();
          console.log("✅ IPFS Data Retrieved:", data);

          return { 
            ...data, 
            tokenId: tokenId.toString(), 
            pdfCID // ✅ Include PDF CID
          };
        } catch (fetchError) {
          console.error("❌ Failed to fetch data from IPFS for:", jsonCID, fetchError);
          return null;
        }
      })
    );

    console.log("✅ Final Manufacturer Details:", manufacturerDetails);
    return manufacturerDetails.filter(data => data !== null);
  } catch (error) {
    console.error("❌ Error fetching pending manufacturers:", error);
    throw new Error("Failed to fetch pending manufacturers");
  }
}

/**
 * Updates the status of a manufacturer.
 * @param {number} tokenId - The token ID of the manufacturer to update.
 * @param {string} newStatus - The new status for the manufacturer ("Pending", "Approved", "Rejected").
 * @returns {boolean} - Returns true if the update was successful, otherwise false.
 */
export async function updateManufacturerStatus(tokenId, newStatus) {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return false;
  }

  try {
    console.log(`🔄 Updating status of Token ID ${tokenId} to ${newStatus}...`);

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, ManufacturerNFTABI, signer);

    // Mapping status strings to the respective enum integer values
    const statusMapping = {
      "Pending": 0,
      "Approved": 1,
      "Rejected": 2
    };

    // Ensure that the status is valid and in the correct format
    if (!(newStatus in statusMapping)) {
      console.error(`🚨 Invalid status: ${newStatus}`);
      alert("Error: Invalid status provided.");
      return false;
    }

    const statusEnumValue = statusMapping[newStatus]; // Convert to enum integer value

    console.log(`📌 Sending transaction: Token ID ${tokenId}, Status ${statusEnumValue}`);
    const tx = await contract.updateManufacturerStatus(tokenId, statusEnumValue); // Pass the integer value to the contract
    console.log("🔄 Transaction Sent:", tx);

    const receipt = await tx.wait();
    console.log("✅ Transaction Mined:", receipt);

    alert(`Manufacturer ${tokenId} successfully updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("❌ Blockchain transaction failed:", error);
    if (error.reason) {
      alert(`Transaction Failed: ${error.reason}`);
    }
    return false;
  }
}

/**
 * Validates if the given CID is in a proper IPFS format.
 * @param {string} cid - The IPFS CID to check.
 * @returns {boolean} - Returns true if the CID is valid.
 */
function isValidCID(cid) {
  const cidRegex = /^[a-zA-Z0-9]{46,}$/; // Matches CIDv0 and CIDv1 formats
  return cidRegex.test(cid);
}
