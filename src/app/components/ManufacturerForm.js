"use client";
import { useState } from "react";
import { Container, Paper, Box, TextField, Button, FormControlLabel, Checkbox, CircularProgress, Typography, Grid, Tooltip } from '@mui/material';
import Image from "next/image";
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from '../components/MsgBox';
import { storeManufacturerData } from "../testingblockchain/manufactureregistration/submit"; // Import the blockchain function
import NavBar from "./NavBar";

const ManufacturerForm = () => {
  const resetForm = () => {
    setFormData({
      name: "",
      licenceNo: "",
      email: "",
      phone: "",
      website: "",
      dateOfIssue: "",
      physicalAddress: "",
      walletAddress: "",
      certificationNumber: "",
      certificationBytea: "",
    });
    setCertification(null);
    setFileUrl(null);
    setPrivacyChecked(false);
    setErrors({});
  };

  const [formData, setFormData] = useState({
    name: "",
    licenceNo: "",
    email: "",
    phone: "",
    website: "",
    dateOfIssue: "",
    physicalAddress: "",
    walletAddress: "",
    certificationNumber: "",
    certificationBytea: "", // Base64 encoded certificate
  });

  const [certification, setCertification] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState({ open: false, message: '', routeButton: null });
  const [errorMsg, setErrorMsg] = useState({ open: false, message: '' });
  const [infoMsg, setInfoMsg] = useState({ open: false, message: '' }); // For processing message

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Email is required.";
        if (!emailRegex.test(value)) return "Please enter a valid email address.";
        return "";
      case "phone":
        if (!value) return "Phone number is required.";
        if (!/^\d+$/.test(value)) return "Phone number should contain only numbers.";
        return "";
      case "walletAddress":
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!value) return "Wallet address is required.";
        if (!walletRegex.test(value)) return "Invalid wallet address! Please enter a valid Ethereum address.";
        return "";
      case "licenceNo":
        if (!value) return "Licence number is required.";
        return "";
      case "physicalAddress":
        if (!value) return "Physical address is required.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (type === "checkbox") {
      setPrivacyChecked(checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrorMsg({ open: true, message: "❌ Please upload a valid PDF file." });
        return;
      }

      setCertification(file);
      setFileUrl(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("certification", file);

      try {
        setInfoMsg({ open: true, message: "Processing certificate..." }); // Show processing message
        const response = await fetch("/api/certificateupload/certificateupload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("✅ Extracted Data:", result.extractedData); // Print extracted data

        if (response.ok) {
          setFormData((prev) => ({
            ...prev,
            name: result.extractedData.manufacturer_name || "",
            licenceNo: result.extractedData.license_number || "",
            certificationNumber: result.extractedData.certificate_number || "",
            physicalAddress: result.extractedData.address || "",
            dateOfIssue: result.extractedData.date_of_issue || "",
            certificationBytea: result.certificationBytea || "",
          }));
          setSuccessMsg({ open: true, message: "✅ Certificate uploaded successfully!" }); // Show success message
        } else {
          setErrorMsg({ open: true, message: `❌ Error: ${result.message}` });
        }
      } catch (error) {
        setErrorMsg({ open: true, message: "❌ Error uploading certificate." });
      } finally {
        setInfoMsg({ open: false, message: '' }); // Hide processing message
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg({ open: false, message: "" }); // Clear previous errors
  
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
  
    if (!privacyChecked) {
      setErrorMsg({ open: true, message: "❌ You must agree to the privacy policy." });
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Prepare data for blockchain
      const blockchainData = {
        email: formData.email,
        pdf: certification,
        manufacturerName: formData.name,
        dateOfIssue: formData.dateOfIssue,
        licenceNo: formData.licenceNo,
        phoneNumber: formData.phone,
        physicalAddress: formData.physicalAddress,
        website: formData.website,
        walletAddress: formData.walletAddress,
        certificationNumber: formData.certificationNumber,
        privacyPolicy: privacyChecked,
      };
  
      // Call the blockchain function with setInfoMsg
      await storeManufacturerData(blockchainData, setInfoMsg);
  
      // Show success message
      setSuccessMsg({
        open: true,
        message: "✅ Your Application has been received!",
        routeButton: { path: "/manufacturerlogin", label: "Go to Login" },
      });
      resetForm();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setErrorMsg({ 
        open: true, 
        message: error.message || "❌ Error submitting form. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
      setInfoMsg({ open: false, message: "" }); // Ensure info message is closed
    }
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "fixed",
        width: "100vw",
        minHeight: "120vh",
        backgroundImage: "url('/final.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <NavBar/>
      <Container
        maxWidth="md" // Increased width
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 150px)",
          marginTop: "140px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: "900px", // Increased width
            maxHeight: "84vh",
            overflowY: "auto",
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255)", // Translucent background
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Image and Heading */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}> {/* Heading on the left */}
              Manufacturer Registration
            </Typography>
            <Image
              src="/yar.png"
              alt="Manufacturer Registration"
              width={200} // Smaller image
              height={180} // Smaller image
              style={{
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Upload PDF Button */}
            <Tooltip title="Upload the manufacturer proof of certificate" arrow>
              <Button
                variant="contained"
                component="label"
                sx={{ width: "30%", height: "50px" }} // Shortened button
              >
                📄 Upload PDF
                <input type="file" id="pdfUpload" name="certification" accept="application/pdf" hidden onChange={handleFileUpload} />
              </Button>
            </Tooltip>

            {/* Form Fields */}
            <Grid container spacing={1}> {/* Reduced spacing between fields */}
              {/* Email */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal" // Changed to match other fields
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Manufacturer Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Manufacturer Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Date of Issue */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Date of Issue"
                  name="dateOfIssue"
                  type="date"
                  value={formData.dateOfIssue}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, required: false }} // Remove asterisk
                  error={!!errors.dateOfIssue}
                  helperText={errors.dateOfIssue}
                  required
                />
              </Grid>

              {/* Licence No. */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Licence No."
                  name="licenceNo"
                  value={formData.licenceNo}
                  onChange={handleChange}
                  error={!!errors.licenceNo}
                  helperText={errors.licenceNo}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Physical Address */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Physical Address"
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleChange}
                  error={!!errors.physicalAddress}
                  helperText={errors.physicalAddress}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Website */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Website (Optional)"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Wallet Address */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Wallet Address"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  error={!!errors.walletAddress}
                  helperText={errors.walletAddress}
                  required
                  InputLabelProps={{ required: false }} // Remove asterisk
                />
              </Grid>

              {/* Certification Number */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Certification Number"
                  name="certificationNumber"
                  value={formData.certificationNumber}
                />
              </Grid>
            </Grid>

            {/* Privacy Policy Checkbox and Submit Button */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={privacyChecked} onChange={handleChange} name="privacyChecked" />}
                label="I accept the privacy policy."
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ padding: "10px 30px" }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Register Manufacturer"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Success, Error, and Info Messages */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000, // Higher than navbar's z-index
          pointerEvents: "none", // Allow clicks to pass through when closed
        }}
      >
        <SuccessMsgBox
          open={successMsg.open}
          onClose={() => setSuccessMsg({ ...successMsg, open: false })}
          message={successMsg.message}
          routeButton={successMsg.routeButton}
        />
        <ErrorMsgBox
          open={errorMsg.open}
          onClose={() => setErrorMsg({ ...errorMsg, open: false })}
          message={errorMsg.message}
        />
        <InfoMsgBox
          open={infoMsg.open}
          onClose={() => setInfoMsg({ ...infoMsg, open: false })}
          message={infoMsg.message}
        />
      </Box>
    </Box>
  );
};

export default ManufacturerForm;