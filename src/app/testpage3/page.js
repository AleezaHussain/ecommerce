"use client";

import { useState,useEffect } from 'react';
import { handleSubmit } from './formsubmit';
import { detectWallet } from './formsubmit';

export default function MedicineForm() {
  const [medicine, setMedicine] = useState({
    certificate: [],
    name: '',
    medicineId: '',
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    excipients: [''],
    types: [],
    excipientExpiryDate: '',
    description: '',
    files: [], // ✅ Medicine Image Upload
    walletAddress: '', // ✅ Auto-detected Wallet Address
    
    status: 'pending', // ✅ Default status
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Running detectWallet on component mount...");
    detectWallet(setMedicine);
  }, []); 



  
  const medicineTypes = [ 'Capsule', 'Syrup', 'Injection', 'Antibiotics']; // ✅ Medicine types list

  // important code
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Only allow one PDF file at a time
  
    if (!file) return;
  
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
  
    console.log("Selected PDF File:", file);
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("certification", file);
  
    try {
      const response = await fetch("/api/medicineregistration/autofill", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log("Autofill API Result:", result);
  
      // ✅ Convert `dosage_form` to PascalCase (e.g., 'capsule' → 'Capsule')
      const formattedDosage = result.extractedData.dosage_form
        ? result.extractedData.dosage_form
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "";
  
      // ✅ Auto-check the corresponding medicine type if it exists in the list
      const updatedTypes = medicineTypes.includes(formattedDosage) ? [formattedDosage] : [];
  
      // ✅ Update state without overwriting `files`
      setMedicine((prev) => ({
        ...prev,
        name: result.extractedData.medicine_name || "",
        medicineId: result.extractedData.medicine_id || "",
        batchNumber: result.extractedData.batch_number || "",
        excipients: result.extractedData.excipients || [""],
        types: updatedTypes, // ✅ Auto-select medicine type checkbox
        files: [...prev.files, file], // ✅ Append PDF to `files`
      }));
  
    } catch (error) {
      console.error("Upload error:", error);
    }
  
    setLoading(false);
  };
  
  
  

// important code
  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    if (selectedFiles.length === 0) {
      alert("Please select a valid file (PNG, JPG, or PDF).");
      return;
    }
  
    console.log("Selected Files:", selectedFiles);
  
    // ✅ Append files instead of replacing
    setMedicine((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles], // Append new files
    }));
  };

  





  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type) => {
    setMedicine((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type]
    }));


   


     
  
  };









  // frontend
  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: 'lightblue' }}>
      <form className="bg-light blue-300 p-6 rounded-lg shadow-lg w-96" onSubmit={(e) => handleSubmit(e, medicine, setMedicine)  }>

        {/* ✅ Auto-trigger API on file upload */}
        <label className="block mb-2 text-lg font-semibold">Upload Certificate</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border"
          accept="application/pdf"
        />
        {loading && <p className="text-blue-600">Processing...</p>}

        <label className="block mt-4 mb-2">Medicine Name *</label>
        <input type="text" name="name" className="w-full p-2 rounded" required value={medicine.name} onChange={handleChange} />

        <label className="block mt-4 mb-2">Medicine Id *</label>
        <input type="text" name="medicineId" className="w-full p-2 rounded" required value={medicine.medicineId} onChange={handleChange} />

        <label className="block mt-4 mb-2">Batch Number *</label>
        <input type="text" name="batchNumber" className="w-full p-2 rounded" required value={medicine.batchNumber} onChange={handleChange} />

        <label className="block mt-4 mb-2">Manufacture Date</label>
        <input type="date" name="manufactureDate" className="w-full p-2 rounded" onChange={handleChange} />

        <label className="block mt-4 mb-2">Expiry Date</label>
        <input type="date" name="expiryDate" className="w-full p-2 rounded" onChange={handleChange} />

        {/* ✅ Excipients Auto-fill */}
        <label className="block mt-4 mb-2 flex items-center justify-between">
          Excipients
        </label>

        {medicine.excipients.map((excipient, index) => (
          <div key={index} className="flex gap-2 items-center mt-2">
            <input
              type="text"
              className="w-full p-2 rounded"
              placeholder={`Excipient ${index + 1}`}
              value={excipient}
              onChange={(e) => {
                const newExcipients = [...medicine.excipients];
                newExcipients[index] = e.target.value;
                setMedicine((prev) => ({ ...prev, excipients: newExcipients }));
              }}
            />
          </div>
        ))}

        {/* ✅ Medicine Type Checkboxes (Auto-check) */}
        <label className="block mt-4 mb-2">Medicine Type</label>
        {medicineTypes.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id={type} 
              checked={medicine.types.includes(type)} 
              onChange={() => handleCheckboxChange(type)}
            />
            <label htmlFor={type}>{type}</label>
          </div>
        ))}

        {/* ✅ Restored: Upload Medicine Image */}
        <label className="block mt-4 mb-2">Upload Medicine File (PNG or PDF)</label>
<input 
  type="file" 
  multiple 
  onChange={handleImageUpload} 
  className="w-full p-2 border" 
  accept=".png, .jpg, .jpeg"
/>
        <label className="block mt-4 mb-2">Description</label>
        <textarea name="description" className="w-full p-2 rounded" rows="3" onChange={handleChange}></textarea>

        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}