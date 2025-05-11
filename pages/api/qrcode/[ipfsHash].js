import { supabase } from "../../../lib/supabaseClientanon";
import { ethers } from "ethers";
import MedicineNFT from "../../../blockchain/artifacts/contracts/medicine.sol/MedicineNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const ABI = MedicineNFT.abi;

// ✅ BigInt-safe JSON replacer
const replacer = (_, value) => (typeof value === "bigint" ? value.toString() : value);

export default async function handler(req, res) {
  const { ipfsHash } = req.query;
  console.log("🚀 Incoming IPFS hash:", ipfsHash);

  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    console.log("🔗 Connected to contract:", CONTRACT_ADDRESS);

    const isValid = await contract.verifyMedicineByQR(ipfsHash);
    console.log("✅ Blockchain verification result:", isValid);

    const tokenId = await contract.getTokenIdByIPFS(ipfsHash);
    console.log("🔎 Token ID by IPFS:", tokenId.toString());

    if (!isValid) {
      if (tokenId === 0n) {
        console.log("❌ Medicine not found on blockchain (tokenId = 0)");
        return res.status(404).end(JSON.stringify({
          message: "Medicine not found on blockchain",
          existsOnChain: false
        }, replacer));
      }

      console.log("⚠ Medicine exists but not verified/approved. Fetching IPFS metadata...");
      const medicine = await contract.medicines(tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;
      console.log("🌐 IPFS metadata URL:", ipfsUrl);
      const metadataResponse = await fetch(ipfsUrl);
      const ipfsData = await metadataResponse.json();

      return res.status(403).end(JSON.stringify({
        message: "Medicine exists but not approved",
        existsOnChain: true,
        status: medicine.status,
        name: ipfsData.name,
        ipfsHash,
        tokenId,
      }, replacer));
    }

    // At this point, it's verified ✅
    console.log("📡 Querying Supabase with tokenId:", tokenId.toString());
    const { data, error } = await supabase
      .from("sale_medicine")
      .select("*")
      .eq("medicine_id", tokenId.toString())
      .single();

    if (error || !data) {
      console.log("📄 Not found in Supabase. Fetching metadata from IPFS...");
      const metadata = await contract.medicines(tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const ipfsUrl = `https://ipfs.io/ipfs/${tokenURI}`;
      const metadataResponse = await fetch(ipfsUrl);
      const ipfsData = await metadataResponse.json();

      return res.status(200).end(JSON.stringify({
        message: "Verified on blockchain but not in DB",
        tokenId,
        ipfsHash,
        status: "Accepted",
        name: ipfsData.name,
        description: ipfsData.description,
        image_url: ipfsData.image_url,
        isNotForSale: true,
      }, replacer));
    }

    // Fully verified & in database ✅
    console.log("✅ Found in Supabase:", data);
    return res.status(200).end(JSON.stringify({
      message: "Medicine verified and found in database",
      tokenId,
      ipfsHash,
      status: "Accepted",
      isNotForSale: false,
      ...data
    }, replacer));

  } catch (err) {
    console.error("❌ Error verifying hash:", err);
    if (err.code === "ECONNREFUSED" || err.message.includes("getaddrinfo")) {
      return res.status(200).json({ message: "0" });
    }
    return res.status(500).json({ message: err.message });
  }
}