"use client";
import { useState } from "react";
import { storeManufacturerData } from "./submit";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    pdf: null,
    manufacturerName: "",
    dateOfIssue: "",
    licenceNo: "",
    phoneNumber: "",
    physicalAddress: "",
    website: "",
    walletAddress: "",
    certificationNumber: "",
    privacyPolicy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await storeManufacturerData(formData);
      alert("✅ Manufacturer registered successfully!");
    } catch (error) {
      console.error("Error registering manufacturer:", error);
      alert("❌ Failed to register manufacturer!");
    }
  };

  return (
    <div>
      <h1>Manufacturer Registration</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange} required />
        <input type="text" name="manufacturerName" placeholder="Manufacturer Name" onChange={handleChange} required />
        <input type="date" name="dateOfIssue" onChange={handleChange} required />
        <input type="text" name="licenceNo" placeholder="Licence No." onChange={handleChange} required />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input type="text" name="physicalAddress" placeholder="Physical Address" onChange={handleChange} required />
        <input type="url" name="website" placeholder="Website (Optional)" onChange={handleChange} />
        <input type="text" name="walletAddress" placeholder="Wallet Address" onChange={handleChange} required />
        <input type="text" name="certificationNumber" placeholder="Certification Number" onChange={handleChange} required />
        <label>
          <input type="checkbox" name="privacyPolicy" onChange={handleChange} required /> I accept the privacy policy.
        </label>
        <button type="submit">Register Manufacturer</button>
      </form>
    </div>
  );
}
