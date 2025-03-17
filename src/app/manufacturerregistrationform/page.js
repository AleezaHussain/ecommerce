"use client"; // Ensure this directive is at the top for client-side rendering

import { useState } from "react";
import { ethers } from "ethers";

export default function ManufacturerRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    walletAddress: "",
  });

  const [status, setStatus] = useState("");

  const contractABI = [
    "function registerManufacturer(string _name, string _licenseNumber, string _physicalAddress) public",
    "function isManufacturerApproved(address _manufacturer) public view returns (bool)",
  ];


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on the input's name attribute
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data being submitted:", formData);
  
      // Check for MetaMask (Ethereum provider)
      if (typeof window === "undefined" || !window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }
  
      // Initialize Web3Provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Provider initialized:", provider);
  
      // Request account access
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Signer obtained:", signer);
  
      // Interact with the contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Contract initialized:", contract);
  
      // Submit transaction
      const tx = await contract.registerManufacturer(
        formData.name,
        formData.licenseNumber,
        formData.address
      );
      console.log("Transaction submitted:", tx);
  
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("Manufacturer registered successfully!");
    } catch (error) {
      console.error("Error during registration:", error);
      setStatus("An error occurred during registration.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Business License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Blockchain Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
