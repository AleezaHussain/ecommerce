import { storeMedicineOnIPFS } from "../../../pages/api/ipfs/medicine"; // Import IPFS function
import { ethers } from "ethers"; // ✅ Import ethers v6
import MedicineNFT from "../../../blockchain/artifacts/contracts/medicine.sol/MedicineNFT.json"; // ✅ Import ABI


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
// ✅ Replace with deployed MedicineNFT contract address
const MedicineNFTABI = MedicineNFT.abi; 
export const handleSubmit = async (e, medicine, setMedicine) => {
  e.preventDefault();
  console.log("🚀 Uploading medicine data to IPFS...");

  console.log("📂 Files Before Submission:", medicine.files);
  console.log("📜 Medicine Data Before Upload:", JSON.stringify(medicine, null, 2));

  // ✅ Store data & files on IPFS and get all hashes
  const ipfsData = await storeMedicineOnIPFS(medicine);

  if (!ipfsData || !ipfsData.jsonIpfsHash) {
    alert("❌ Error uploading data to IPFS.");
    return;
  }

  console.log("✅ Medicine Data Stored on IPFS:", ipfsData);

  // ✅ Extract IPFS Hash for JSON
  const ipfsHash = ipfsData.jsonIpfsHash;
  console.log("🔗 IPFS Hash of Metadata:", ipfsHash);

  // ✅ Store Data on Blockchain (Mint NFT)
  const tokenId = await mintMedicineNFT(medicine.medicineId, ipfsHash);
  if (!tokenId) {
    alert("❌ Failed to mint Medicine NFT.");
    return;
  }

  console.log(`🎉 Medicine NFT Minted! Token ID: ${tokenId}`);
  // alert(`Medicine successfully stored on blockchain!\nToken ID: ${tokenId}`);

  // ✅ Reset form fields (except wallet address)
  setMedicine((prev) => ({
    ...prev,
    certificate: [],
    name: "",
    medicineId: "",
    batchNumber: "",
    manufactureDate: "",
    expiryDate: "",
    excipients: [""],
    types: [],
    excipientExpiryDate: "",
    description: "",
    files: [],
    status: "pending",
  }));
};

// ✅ Function to mint Medicine NFT on Blockchain
const mintMedicineNFT = async (manufacturerId, ipfsHash) => {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install MetaMask.");
    return null;
  }

  try {
    console.log("🔗 Connecting to MetaMask...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MedicineNFT.abi, signer);

    console.log("📜 Minting Medicine NFT...");
    const tx = await contract.mintMedicine(manufacturerId, ipfsHash);
    const receipt = await tx.wait(); // ✅ Wait for confirmation

    console.log("✅ Transaction Receipt:", receipt);

    // ✅ Fix: Extract Token ID from event logs
    const iface = new ethers.Interface(MedicineNFT.abi);
    let tokenId = null;
    for (let log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === "MedicineMinted") {
          tokenId = parsedLog.args[0].toString();
          break;
        }
      } catch (error) {
        // Ignore logs that don't match the event format
      }
    }

    if (!tokenId) {
      console.error("❌ Error: No MedicineMinted event found in logs.");
      return null;
    }

    console.log(`🎉 Medicine NFT Minted! Token ID: ${tokenId}`);
    return tokenId;
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    return null;
  }
};



// ✅ Function to detect connected wallet
export const detectWallet = async (setMedicine) => {
  if (typeof window === "undefined") {
    console.warn("❌ Running in a server-side environment.");
    return;
  }

  if (!window.ethereum) {
    console.warn("❌ MetaMask not detected.");
    return;
  }

  try {
    console.log("🔍 Detecting wallet...");

    // ✅ Request wallet access
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    console.log("✅ Wallet Address Detected:", walletAddress);

    // ✅ Update state with wallet address
    setMedicine((prev) => ({
      ...prev,
      walletAddress,
    }));
  } catch (error) {
    console.error("❌ Error detecting wallet:", error);
  }
};