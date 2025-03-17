import { BrowserProvider, Contract } from "ethers";
import ManufacturerNFTStorage from "../../../../artifacts/blockchain/contracts/manufacturerregistration.sol/ManufacturerNFTStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MANUFACTURE_CONTRACT_ADDRESS;
const ManufacturerNFTABI = ManufacturerNFTStorage.abi;

/**
 * Fetches manufacturers by status from the blockchain and retrieves their metadata from IPFS.
 * @param {string} status - The status to filter manufacturers by ("Pending", "Approved", "Rejected")
 * @returns {Array} - List of manufacturers with full details based on the provided status.
 */
async function getManufacturersByStatus(status) {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return [];
  }

  try {
    console.log(`🔍 Fetching Manufacturers with status: ${status}...`);
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(CONTRACT_ADDRESS, ManufacturerNFTABI, provider);

    // Get manufacturers based on status
    let manufacturerData;
    if (status === "Approved") {
      manufacturerData = await contract.getApprovedManufacturers(); // Approved status
    } else if (status === "Rejected") {
      manufacturerData = await contract.getRejectedManufacturers(); // Rejected status
    } else {
      manufacturerData = await contract.getPendingManufacturers(); // Pending status
    }

    const [tokenIds, jsonCIDs, pdfCIDs] = manufacturerData;
    console.log(`✅ Manufacturer Data with status ${status}:`, { tokenIds, jsonCIDs, pdfCIDs });

    if (!tokenIds || tokenIds.length === 0) {
      console.warn(`⚠ No manufacturers found with status ${status}.`);
      return [];
    }

    // Fetch metadata from IPFS for each manufacturer
    const manufacturerDetails = await Promise.all(
      tokenIds.map(async (tokenId, index) => {
        const jsonCID = jsonCIDs[index];
        const pdfCID = pdfCIDs[index];

        console.log(`🌍 Fetching metadata from IPFS: ${jsonCID}`);

        try {
          const response = await fetch(`https://ipfs.io/ipfs/${jsonCID}`);
          if (!response.ok) throw new Error(`Failed to fetch IPFS data for ${jsonCID}`);

          const data = await response.json();
          console.log("✅ IPFS Data Retrieved:", data);

          return {
            ...data,
            tokenId: tokenId.toString(),
            pdfCID
          };
        } catch (fetchError) {
          console.error("❌ Failed to fetch data from IPFS for:", jsonCID, fetchError);
          return null;
        }
      })
    );

    console.log(`✅ Final Manufacturer Details with status ${status}:`, manufacturerDetails);
    return manufacturerDetails.filter(data => data !== null);
  } catch (error) {
    console.error(`❌ Error fetching manufacturers with status ${status}:`, error);
    throw new Error(`Failed to fetch manufacturers with status ${status}`);
  }
}

/**
 * Fetches approved manufacturers from the blockchain and retrieves their metadata from IPFS.
 * @returns {Array} - List of approved manufacturers with full details.
 */
export async function getApprovedManufacturers() {
  return await getManufacturersByStatus("Approved"); // Approved status is "Approved"
}

/**
 * Fetches rejected manufacturers from the blockchain and retrieves their metadata from IPFS.
 * @returns {Array} - List of rejected manufacturers with full details.
 */
export async function getRejectedManufacturers() {
  return await getManufacturersByStatus("Rejected"); // Rejected status is "Rejected"
}

/**
 * Fetches pending manufacturers from the blockchain and retrieves their metadata from IPFS.
 * @returns {Array} - List of pending manufacturers with full details.
 */
export async function getPendingManufacturers() {
  return await getManufacturersByStatus("Pending"); // Pending status is "Pending"
}
