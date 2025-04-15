import { supabase } from "../../../lib/supabaseClientanon";
import { ethers } from "ethers";
import MedicineNFT from "../../../artifacts/blockchain/contracts/medicine.sol/MedicineNFT.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEDICINE_NFT_ADDRESS;
const ABI = MedicineNFT.abi;

// ✅ BigInt-safe JSON replacer
const replacer = (_, value) => (typeof value === "bigint" ? value.toString() : value);

export default async function handler(req, res) {
  const { ipfsHash } = req.query;

  try {
    const provider = new ethers.JsonRpcProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const tokenId = await contract.getTokenIdByIPFS(ipfsHash);

    if (tokenId === 0n) {
      return res.status(404).end(JSON.stringify({
        message: "Medicine not found on blockchain",
        existsOnChain: false
      }, replacer));
    }

    const isValid = await contract.verifyMedicineByQR(ipfsHash);

    if (!isValid) {
      const medicine = await contract.medicines(tokenId);
      return res.status(403).end(JSON.stringify({
        message: "Medicine exists but not approved",
        existsOnChain: true,
        status: medicine.status
      }, replacer));
    }

    const { data, error } = await supabase
      .from("sale_medicine")
      .select("*")
      .eq("medicine_id", tokenId.toString())
      .single();

    if (error) {
      return res.status(200).end(JSON.stringify({
        message: "Verified on blockchain but not in DB",
        tokenId,
        ipfsHash,
        status: "Accepted"
      }, replacer));
    }

    return res.status(200).end(JSON.stringify({
      ...data,
      tokenId,
      status: "Accepted"
    }, replacer));

  } catch (err) {
    console.error("Error verifying hash:", err);
    return res.status(500).json({ message: err.message });
  }
}
