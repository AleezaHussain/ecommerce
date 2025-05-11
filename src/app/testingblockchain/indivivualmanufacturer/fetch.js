import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import ManufacturerNFTStorage  from "../../../../blockchain/artifacts/contracts/manufacturerregistration.sol/ManufacturerNFTStorage.json";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MANUFACTURE_CONTRACT_ADDRESS;
const ManufacturerNFTABI = ManufacturerNFTStorage.abi;

export default function useManufacturerDetails() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [manufacturerDetails, setManufacturerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);

      // Detect wallet address
      async function fetchWalletDetails() {
        try {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);

          // Fetch manufacturer details from contract
          const contract = new Contract(CONTRACT_ADDRESS, ManufacturerNFTABI, signer);
          const [jsonCID, pdfCID, status] = await contract.getIndividualManufacturer(address);
          setManufacturerDetails({
            jsonCID,
            pdfCID,
            status: status.toString() // Convert Status Enum to String
          });
        } catch (err) {
          setError("Failed to fetch details. Make sure you're connected to MetaMask.");
        } finally {
          setLoading(false);
        }
      }

      fetchWalletDetails();
    } else {
      setError("Please install MetaMask!");
      setLoading(false);
    }
  }, []);

  return { walletAddress, manufacturerDetails, loading, error };
}
