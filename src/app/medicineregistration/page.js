"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { insertMedicine } from '../../../lib/medicineregistration';
import { Checkbox, FormGroup, FormControlLabel, Box, TextField, Button, Typography, Grid, Tooltip, CircularProgress, Paper, Container } from "@mui/material";
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from '../components/MsgBox';
import { storeMedicineOnIPFS } from "../../../pages/api/ipfs/medicine";
import { handleSubmit, detectWallet } from '../testpage3/formsubmit';
import Image from "next/image";

const dosageOptions = ["Capsule", "Syrup", "Injection", "Antibiotics"];

export default function MedicineForm({ onSubmit, onClose, initialValues }) {
  const [medicine, setMedicine] = useState(initialValues || {
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
  const [infoMsg, setInfoMsg] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    detectWallet(setMedicine);
  }, []);

  const resetForm = () => {
    setMedicine(initialValues || {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields including file uploads
    const newErrors = {
      ...errors,
      certificate: validateField("certificate", pdf), // Validate pdf state
      image: validateField("image", image) // Validate image state
    };
  
    // Also validate other medicine fields
    Object.keys(medicine).forEach((key) => {
      // Skip certificate and image validation here since we're handling them above
      if (key !== 'certificate' && key !== 'image') {
        const error = validateField(key, medicine[key]);
        if (error) newErrors[key] = error;
      }
    });
  
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (hasErrors) {
      setErrors(newErrors);
      setIsSubmitting(false);
      
      // Find the first error to show in the message box
      const firstError = Object.entries(newErrors).find(([_, error]) => error);
      if (firstError) {
        setErrorMsg({ open: true, message: firstError[1] });
      }
      return;
    }
  
    try {
      const medicineData = { 
        ...medicine, 
        certificate: pdf ? [pdf] : [], 
        files: image ? Array.from(image) : [] 
      };
      
      if (onSubmit) {
        await onSubmit(medicineData);
        setSuccessMsg({ open: true, message: "✅ Medicine registration submitted successfully!" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMsg({ open: true, message: error.message || "❌ Failed to register medicine" });
    } finally {
      setIsSubmitting(false);
      setInfoMsg({ open: false, message: "" });
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
  
    setPdf(file); // This is what we're validating against
    setPdfUrl(URL.createObjectURL(file));
    setLoading(true);
    setInfoMsg({ open: true, message: "Processing PDF..." }); // Show processing message

    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const response = await fetch("/api/medicineregistration/autofill", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.extractedData) {
        throw new Error("No extracted data found.");
      }

      const formattedDosage = result.extractedData.dosage_form
        ? result.extractedData.dosage_form
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "";

      const updatedTypes = dosageOptions.includes(formattedDosage)
        ? [formattedDosage]
        : [];
      const updatedExcipients = result.extractedData.excipients || [""];

      setMedicine((prev) => ({
        ...prev,
        name: result.extractedData.medicine_name || "",
        medicineId: result.extractedData.medicine_id || "",
        batchNumber: result.extractedData.batch_number || "",
        excipients: updatedExcipients,
        types: updatedTypes,
      }));

      // Show success message for PDF upload
      setSuccessMsg({ open: true, message: "✅ PDF uploaded successfully!" });
    } catch (error) {
      setErrorMsg({ open: true, message: `❌ ${error.message}` });
    } finally {
      setLoading(false);
      setInfoMsg({ open: false, message: "" }); // Hide processing message
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
    setInfoMsg({ open: true, message: "Processing image..." }); // Show processing message

    // Simulate image upload success
    setTimeout(() => {
      setSuccessMsg({ open: true, message: "✅ Image uploaded successfully!" });
      setInfoMsg({ open: false, message: "" }); // Hide processing message
    }, 2000); // Simulate a 2-second delay for upload
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
    if (medicine.excipients.length > 1) { // Ensure at least one excipient remains
      setMedicine((prev) => ({
        ...prev,
        excipients: prev.excipients.filter((_, i) => i !== index),
      }));
    } else {
      setErrorMsg({ open: true, message: "❌ At least one excipient is required" });
    }
  };
  return (
    <Box
      sx={{
        overflow: "hidden",
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Message Boxes */}
      <Box
        sx={{
          position: "fixed",
          top: -5,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          pointerEvents: "none",
        }}
      >
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
        <InfoMsgBox
          open={infoMsg.open}
          onClose={() => setInfoMsg({ open: false, message: "" })}
          message={infoMsg.message}
        />
      </Box>

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: "900px",
            maxHeight: "75vh",
            overflowY: "auto",
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255)",
          }}
        >
          {/* Image and Heading */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Medicine Registration
            </Typography>
            <Image
              src="/t.png"
              alt="Medicine Registration"
              width={250}
              height={300}
              style={{
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleFormSubmit}>
            {/* Upload PDF and Medicine Image Buttons */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Tooltip title="Upload the medicine certificate" arrow>
              <Box>
      <Button
        variant="contained"
        component="label"
        sx={{ 
          padding: "10px 30px", 
          width: "100%", 
          height: "50px",
          border: errors.certificate ? "1px solid red" : "none"
        }}
      >
                  📄 Upload PDF
        <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
      </Button>
      {errors.certificate && (
        <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
          {errors.certificate}
        </Typography>
      )}
    </Box>
  </Tooltip>
  <Tooltip title="Upload medicine image" arrow>
    <Box>
      <Button
        variant="contained"
        component="label"
        sx={{ 
          padding: "10px 30px", 
          width: "100%", 
          height: "50px",
          border: errors.image ? "1px solid red" : "none"
        }}
      >
                  📂 Upload Image
        <input type="file" multiple hidden onChange={handleImageUpload} />
      </Button>
      {errors.image && (
        <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
          {errors.image}
        </Typography>
      )}
    </Box>
  </Tooltip>
            </Box>

            {/* Form Fields in Grid */}
            <Grid container spacing={2}>
              {/* Medicine Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Medicine Name"
                  name="name"
                  value={medicine.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  InputLabelProps={{ required: false }}
                />
              </Grid>

              {/* Medicine ID */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Medicine ID"
                  name="medicineId"
                  value={medicine.medicineId}
                  onChange={handleChange}
                  required
                  error={!!errors.medicineId}
                  helperText={errors.medicineId}
                  InputLabelProps={{ required: false }}
                />
              </Grid>

              {/* Batch Number */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  name="batchNumber"
                  value={medicine.batchNumber}
                  onChange={handleChange}
                  required
                  error={!!errors.batchNumber}
                  helperText={errors.batchNumber}
                  InputLabelProps={{ required: false }}
                />
              </Grid>

              {/* Manufacture Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manufacture Date"
                  name="manufactureDate"
                  type="date"
                  value={medicine.manufactureDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, required: false }}
                  required
                  error={!!errors.manufactureDate}
                  helperText={errors.manufactureDate}
                />
              </Grid>

              {/* Expiry Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={medicine.expiryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, required: false }}
                  required
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>

              {/* Excipients */}
<Grid item xs={12}>
  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
    Excipients
  </Typography>
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {medicine.excipients.map((excipient, index) => (
      <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          label={`Excipient ${index + 1}`}
          value={excipient}
          onChange={(e) => {
            const newExcipients = [...medicine.excipients];
            newExcipients[index] = e.target.value;
            setMedicine((prev) => ({ ...prev, excipients: newExcipients }));
          }}
          InputLabelProps={{ required: false }}
        />
        <Tooltip title="Remove excipient" arrow>
  <Button
    variant="outlined"
    color="error"
    onClick={() => removeExcipient(index)}
    sx={{ 
      minWidth: '40px', 
      height: '56px',
      borderColor: 'error.main'
    }}
  >
    −
  </Button>
</Tooltip>
      </Box>
    ))}
  </Box>
  <Button
    type="button"
    onClick={addExcipient}
    variant="contained"
    sx={{ mt: 2, padding: "10px 30px" }}
  >
    Add Excipient
  </Button>
</Grid>

              {/* Medicine Type */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                  Medicine Type
                </Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  {dosageOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={medicine.types.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Give detailed description about the medicine"
                  name="description"
                  value={medicine.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  error={!!errors.description}
                  helperText={errors.description}
                  InputLabelProps={{ required: false }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
              {onClose && (
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ padding: "10px 30px" }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ padding: "10px 30px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Register Medicine"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const validateField = (name, value) => {
  switch (name) {
    case "certificate":
      return value ? "" : "Certificate PDF is required.";
    case "image":
      return value ? "" : "Medicine image is required.";
    case "manufactureDate":
      return value ? "" : "Manufacture date is required.";
    case "expiryDate":
      return value ? "" : "Expiry date is required.";
    case "excipients":
      return Array.isArray(value) && value.length > 0 && value.every((item) => item.trim() !== "")
        ? ""
        : "At least one excipient is required.";
    case "types":
      return value && value.length > 0 ? "" : "At least one type must be selected.";
    case "description":
      return value.trim() ? "" : "Description is required.";
    default:
      return "";
  }
};