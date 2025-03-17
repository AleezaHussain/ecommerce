"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { insertMedicine } from '../../../lib/medicineregistration';
import { Checkbox, FormGroup, FormControlLabel, Box } from "@mui/material";
import { SuccessMsgBox, ErrorMsgBox } from '../components/MsgBox'; // Adjust the import path as needed

const validateField = (name, value) => {
  switch (name) {
    case "certificate":
      return ""; // No validation for certificate
    case "image":
      return ""; // No validation for image
    case "manufactureDate":
      return value ? "" : "Manufacture date is required.";
    case "expiryDate":
      return value ? "" : "Expiry date is required.";
    case "excipients":
      return Array.isArray(value) && value.length > 0 && value.every((item) => item.trim() !== "")
        ? ""
        : "At least one excipient is required.";
    case "types":
      return value && Object.keys(value).length > 0 ? "" : "At least one type must be selected.";
    case "description":
      return value.trim() ? "" : "Description is required.";
    default:
      return "";
  }
};

const detectWallet = async (setMedicine) => {
  if (typeof window === "undefined") {
    console.warn("Window is undefined, running in a server-side environment.");
    return;
  }

  if (!window.ethereum) {
    console.warn("MetaMask not detected. Please install MetaMask.");
    return;
  }

  try {
    console.log("🔍 Detecting wallet...");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    console.log("✅ Wallet Address Detected:", walletAddress);

    setMedicine((prev) => ({
      ...prev,
      walletAddress,
    }));
  } catch (error) {
    console.error("❌ Error detecting wallet:", error);
  }
};

const dosageOptions = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Gel"];

export default function MedicineForm() {
  const [medicine, setMedicine] = useState({
    certificate: "",
    name: "",
    medicineId: "",
    batchNumber: "",
    manufactureDate: "",
    expiryDate: "",
    excipients: [""],
    types: [],
    description: "",
    image: "",
    walletAddress: "",
  });

  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState({ open: false, message: "", routeButton: null });
  const [errorMsg, setErrorMsg] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    detectWallet(setMedicine);
  }, []);

  // Move resetForm inside the component
  const resetForm = () => {
    setMedicine({
      certificate: "",
      name: "",
      medicineId: "",
      batchNumber: "",
      manufactureDate: "",
      expiryDate: "",
      excipients: [""],
      types: [],
      description: "",
      image: "",
      walletAddress: "",
    });
    setPdf(null);
    setImage(null);
    setPdfUrl(null);
    setImageUrl(null);
    setErrors({});
  };

  const handleSubmit = async (
    e,
    medicine,
    setMedicine,
    setIsSubmitting,
    setErrors,
    setSuccessMsg,
    setErrorMsg,
    resetForm,
    pdf,
    image
  ) => {
    e.preventDefault();
    console.log("Form submission started");
    setIsSubmitting(true);

    // Validate fields
    const newErrors = {};
    Object.keys(medicine).forEach((key) => {
      const error = validateField(key, medicine[key]);
      if (error) newErrors[key] = error;
    });

    // Additional check for file uploads
    if (!pdf) {
      newErrors.certificate = "Certificate is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
      setErrors(newErrors);
      setIsSubmitting(false);

      // Show error message box for the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      setErrorMsg({ open: true, message: newErrors[firstErrorKey] });
      return;
    }

    try {
      // Attach files to medicineData
      const medicineData = { ...medicine, certificate: pdf ? [pdf] : [], files: image ? Array.from(image) : [] };
      console.log("Prepared medicine data:", medicineData);

      // Call insertMedicine to submit the data
      const response = await insertMedicine(medicineData);
      console.log("InsertMedicine response:", response);

      if (response.success) {
        setSuccessMsg({ open: true, message: "✅ Your Application has been received!" });
        resetForm(); // Reset the form after successful submission
      } else {
        setErrorMsg({ open: true, message: `❌ Error: ${response.error}` });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMsg({ open: true, message: "❌ Unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrorMsg({ open: true, message: "❌ Please select a file to upload." });
      return;
    }
  
    if (file.type !== "application/pdf") {
      setErrorMsg({ open: true, message: "❌ Please upload a valid PDF file." });
      return;
    }
  
    setPdf(file);
    setPdfUrl(URL.createObjectURL(file));
    setLoading(true);
  
    const formData = new FormData();
    formData.append("certificate", file);
  
    try {
      const response = await fetch("/api/medicineregistration/autofill", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        if (response.status === 409) {
          // Assuming 409 is the status code for "Medicine already exists"
          throw new Error("Medicine already exists.");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
  
      const result = await response.json();
  
      if (!result.extractedData) throw new Error("No extracted data found.");
  
      const formattedDosage = result.extractedData.dosage_form
        ? result.extractedData.dosage_form.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
        : "";
  
      const updatedTypes = dosageOptions.includes(formattedDosage) ? [formattedDosage] : [];
      const updatedExcipients = result.extractedData.excipients || [""];
  
      setMedicine((prev) => ({
        ...prev,
        name: result.extractedData.medicine_name || "",
        medicineId: result.extractedData.medicine_id || "",
        batchNumber: result.extractedData.batch_number || "",
        excipients: updatedExcipients,
        types: updatedTypes,
      }));
    } catch (error) {
      setErrorMsg({ open: true, message: `❌ ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setErrorMsg({ open: true, message: "❌ Please select a file to upload." });
      return;
    }

    // Allow any file type
    setImage(files);
    setImageUrl(Array.from(files).map((file) => URL.createObjectURL(file)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type) => {
    setMedicine((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const addExcipient = () => {
    setMedicine((prev) => ({ ...prev, excipients: [...prev.excipients, ""] }));
  };
  
  const removeExcipient = (index) => {
    setMedicine((prev) => ({
      ...prev,
      excipients: prev.excipients.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-200">
      <form
        className="bg-pink-300 p-6 rounded-lg shadow-lg w-96"
        onSubmit={(e) => handleSubmit(
          e,
          medicine,
          setMedicine,
          setIsSubmitting,
          setErrors,
          setSuccessMsg,
          setErrorMsg,
          resetForm, // Pass the resetForm function here
          pdf,
          image
        )}
      >
        <label className="block mb-2 text-lg font-semibold">Upload Certificate</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border"
          accept="application/pdf"
        />
        {errors.certificate && <p className="text-red-500">{errors.certificate}</p>} {/* Display error */}
        {loading && <p className="text-blue-600">Processing...</p>}

        <label className="block mt-4 mb-2">Medicine Name </label>
        <input
          type="text"
          name="name"
          className="w-full p-2 rounded"
          required
          value={medicine.name}
          onChange={handleChange}
        />

        <label className="block mt-4 mb-2">Medicine Id </label>
        <input
          type="text"
          name="medicineId"
          className="w-full p-2 rounded"
          required
          value={medicine.medicineId}
          onChange={handleChange}
        />

        <label className="block mt-4 mb-2">Batch Number </label>
        <input
          type="text"
          name="batchNumber"
          className="w-full p-2 rounded"
          required
          value={medicine.batchNumber}
          onChange={handleChange}
        />

        <label className="block mt-4 mb-2">Manufacture Date</label>
        <input
          type="date"
          name="manufactureDate"
          className="w-full p-2 rounded"
          onChange={handleChange}
        />

        <label className="block mt-4 mb-2">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          className="w-full p-2 rounded"
          onChange={handleChange}
        />

<label className="block mt-4 mb-2">Excipients</label>
{medicine.excipients.map((excipient, index) => (
  <div key={index} className="flex items-center gap-2 mb-2">
    <input
      type="text"
      className="w-full p-2 rounded"
      placeholder={`Excipient ${index + 1}`}
      value={excipient}
      onChange={(e) => {
        const newExcipients = [...medicine.excipients];
        newExcipients[index] = e.target.value;
        setMedicine((prev) => ({ ...prev, excipients: newExcipients }));
        setErrors((prev) => ({ ...prev, excipients: validateField("excipients", newExcipients) }));
      }}
    />
    {medicine.excipients.length > 1 && (
      <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeExcipient(index)}> - </button>
    )}
  </div>
))}
<button type="button" className="bg-green-500 text-white px-2 py-1 rounded" onClick={addExcipient}> + Add </button>

        <label className="block mt-4 mb-2">Medicine Type</label>
        <Box>
          <FormGroup>
            {dosageOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={medicine.types.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    value={option}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </Box>

        <label className="block mt-4 mb-2">Upload Medicine File (Any File Type)</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border"
          accept="*" // Allow any file type
        />

        <label className="block mt-4 mb-2">Description</label>
        <textarea
          name="description"
          className="w-full p-2 rounded"
          rows="3"
          value={medicine.description}
          onChange={handleChange}
        ></textarea>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {/* Render Success and Error Message Boxes */}
        <SuccessMsgBox
          open={successMsg.open}
          onClose={() => setSuccessMsg({ open: false, message: "" })}
          message={successMsg.message}
        />
        <ErrorMsgBox
          open={errorMsg.open}
          onClose={() => setErrorMsg({ open: false, message: "" })}
          message={errorMsg.message}
        />
      </form>
    </div>
  );
}