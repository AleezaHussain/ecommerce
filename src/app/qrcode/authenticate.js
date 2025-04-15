
import { ethers } from "ethers";
import MedicineNFT from "../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const ABI = MedicineNFT.abi;

// Updated verifyMedicineByQRAndFetchDetails function
export const verifyMedicineByQRAndFetchDetails = async (ipfsHash) => {
  try {
    const response = await fetch(`/api/qrcode/${ipfsHash}`);
    const result = await response.json();

    if (response.status === 200) {
      return {
        status: "success",
        medicine: {
          ...result,
          ipfsHash,
        }
      };
    } else if (response.status === 403 && result.existsOnChain) {
      // Medicine exists but not approved
      const statusText = 
        result.status === 0 ? "Pending Approval" :
        result.status === 1 ? "Rejected" : "Unknown";
      
      return { 
        status: "unapproved", 
        message: `Medicine found but status: ${statusText}`,
        ipfsHash
      };
    } else if (response.status === 404) {
      return { status: "not_found", message: "Medicine not registered on PharmaGuard 24/7" };
    }

    return { status: "error", message: result.message || "Verification failed" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};