import { BrowserProvider, Contract } from "ethers";
import { uploadJSONToPinata, uploadPDFFromURLToPinata } from "../../../../pages/api/ipfs/uploadToIPFS";
import ManufacturerNFTStorage from "../../../../artifacts/blockchain/contracts/manufacturerregistration.sol/ManufacturerNFTStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MANUFACTURE_CONTRACT_ADDRESS;
const ManufacturerNFTABI = ManufacturerNFTStorage.abi;

export async function storeManufacturerData(formData) {
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
    console.log("📂 JSON CID:", jsonCID);
    console.log("📄 PDF CID:", pdfCID);

    // ✅ FIX: Proper CID validation before storing on blockchain
    function isValidCID(cid) {
      const cidRegex = /^[a-zA-Z0-9]{46,}$/; // Matches IPFS CIDv0 and CIDv1 formats
      return cidRegex.test(cid);
    }

    if (!isValidCID(jsonCID)) {
      console.error("❌ Invalid JSON CID format!", jsonCID);
      return;
    }

    if (!isValidCID(pdfCID)) {
      console.error("❌ Invalid PDF CID format!", pdfCID);
      return;
    }

    await storeOnBlockchain(formData.walletAddress, jsonCID, pdfCID);
  } catch (error) {
    console.error("❌ Error storing data:", error);
    throw new Error("Failed to store manufacturer data");
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
    alert("✅ Manufacturer stored on blockchain!");
  } catch (error) {
    console.error("❌ Error storing on blockchain:", error);
    throw new Error("Failed to store on blockchain");
  }
}
