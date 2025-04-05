import { BrowserProvider, Contract } from "ethers";
import { uploadJSONToPinata, uploadPDFFromURLToPinata } from "../../../../pages/api/ipfs/uploadToIPFS";
import ManufacturerNFTStorage from "../../../../artifacts/blockchain/contracts/manufacturerregistration.sol/ManufacturerNFTStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MANUFACTURE_CONTRACT_ADDRESS;
const ManufacturerNFTABI = ManufacturerNFTStorage.abi;

export async function storeManufacturerData(formData, setInfoMsgCallback) {
  try {
    console.log("Uploading data to IPFS...");

    const jsonCID = await uploadJSONToPinata({
      email: formData.email,
      manufacturerName: formData.manufacturerName,
      dateOfIssue: formData.dateOfIssue,
      licenceNo: formData.licenceNo,
      phoneNumber: formData.phoneNumber,
      physicalAddress: formData.physicalAddress,
      website: formData.website,
      walletAddress: formData.walletAddress,
      certificationNumber: formData.certificationNumber,
      status: "Pending",
    });

    const pdfCID = await uploadPDFFromURLToPinata(URL.createObjectURL(formData.pdf));

    console.log("✅ IPFS Upload Complete");
    setInfoMsgCallback({ open: true, message: "Please confirm transaction in MetaMask..." });

    // Validate CIDs
    function isValidCID(cid) {
      const cidRegex = /^[a-zA-Z0-9]{46,}$/;
      return cidRegex.test(cid);
    }

    if (!isValidCID(jsonCID) || !isValidCID(pdfCID)) {
      throw new Error("Invalid IPFS CID format");
    }

    await storeOnBlockchain(formData.walletAddress, jsonCID, pdfCID, setInfoMsgCallback);
  } catch (error) {
    console.error("❌ Error storing data:", error);
    setInfoMsgCallback({ open: false, message: "" });
    throw error;
  }
}

async function storeOnBlockchain(walletAddress, jsonCID, pdfCID) {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, ManufacturerNFTABI, signer);

  console.log("📝 Storing on Blockchain...");
  console.log("🆔 Wallet Address:", walletAddress);
  console.log("📂 JSON CID (IPFS):", jsonCID);
  console.log("📄 PDF CID (IPFS):", pdfCID);

  try {
    const tx = await contract.storeManufacturer(walletAddress, jsonCID, pdfCID);
    console.log("📡 Transaction Sent:", tx);

    await tx.wait();
    console.log("✅ Transaction Confirmed:", tx.hash);
  } catch (error) {
    console.error("❌ Error storing on blockchain:", error);
    throw new Error("Failed to store on blockchain");
  }
}
