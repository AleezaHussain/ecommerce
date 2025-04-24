  import { ethers } from "ethers";
  import MedicineNFT from "../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json";

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
  const ABI = MedicineNFT.abi;

  export const verifyMedicineByQRAndFetchDetails = async (ipfsHash) => {
    try {
      const response = await fetch(`/api/qrcode/${ipfsHash}`);
      const result = await response.json();

      if (response.status === 200 && result.status === "Accepted") {
        return {
          status: "success",
          medicine: {
            ...result,
            ipfsHash,
            isNotForSale: result.message === "Verified on blockchain but not in DB"
          },
        };
      }
      else if (response.status === 403 && result.existsOnChain) {
        return {
          status: "rejected",
          message: "Medicine does not exist",
          tooltip: "Medicine found in blockchain but status: Rejected",
          medicine: {
            name: result.name,
            ipfsHash: result.ipfsHash,
          },
        };
      } else if (response.status === 200 && result.message === "Verified on blockchain but not in DB") {
        return {
          status: "success", // Changed to success since it's approved
          message: " Medicine approved but not currently in sale",
          medicine: {
            ...result,
            ipfsHash,
            isNotForSale: true
          },
        };
      }
      else if (response.status === 404) {
        return { status: "not_found", message: "❌ Medicine not registered on PharmaGuard 24/7" };
      }

      return { status: "error", message: result.message || "Verification failed" };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };

