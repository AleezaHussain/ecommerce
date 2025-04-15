"use client";
import { useState } from "react";
import { Container, Paper, Box, TextField, Button, FormControlLabel, Checkbox, CircularProgress, Typography, Grid, Tooltip } from '@mui/material';
import Image from "next/image";
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from '../components/MsgBox';
import { storeManufacturerData } from "../testingblockchain/manufactureregistration/submit"; // Import the blockchain function
import NavBar from './NavBar';
import { FooterSection } from "../userstore/sections/FooterSection";
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Full-width NavBar */}
      <Box sx={{ width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 1200 }}>
        <NavBar />
      </Box>

      {/* Main content - full width form */}
      <Box
        sx={{
          width: "100vw",
          flex: 1,
          padding: { xs: "80px 16px 16px", md: "70px 10% 16px" },
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Header Section - Centered */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          textAlign: "center"
        }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: "#004b8d",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            mb: 3
          }}>
            Manufacturer Registration
          </Typography>
          
          {/* Improved Image Container */}
          <Box sx={{
            width: { xs: "100%", sm: "80%", md: "30%" },
            maxWidth: "400px",
            height: "auto",
            aspectRatio: "1.5",
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            "& img": {
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "#f5f5f5",
              padding: 2
            }
          }}>
            <Image
              src="/yar.png"
              alt="Manufacturer Registration"
              layout="fill"
              quality={100}
              priority
            />
          </Box>
        </Box>

        {/* Form Section - directly on page */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Upload Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
  <Tooltip title="Upload the manufacturer proof of certificate" arrow>
    <Button
      variant="contained"
      component="label"
      sx={{ 
        width: { xs: "100%", sm: "50%", md: "30%" },
        height: 50,
        backgroundColor: "#004b8d",
        "&:hover": {
          backgroundColor: "#003366"
        },
        fontSize: "1rem",
        fontWeight: 500,
        textTransform: "capitalize" // This ensures only the first letter is capital
      }}
    >
      📄 Upload PDF
      <input type="file" id="pdfUpload" name="certification" accept="application/pdf" hidden onChange={handleFileUpload} />
    </Button>
  </Tooltip>
</Box>

          {/* Form Fields Grid */}
          <Grid container spacing={3}>
            {[
              { name: "email", label: "Email", type: "email", required: true, xs: 12, md: 4 },
              { name: "name", label: "Manufacturer Name", required: true, xs: 12, md: 4 },
              { name: "dateOfIssue", label: "Date of Issue", type: "date", required: true, xs: 12, md: 4 },
              { name: "licenceNo", label: "Licence No.", required: true, xs: 12, md: 4 },
              { name: "phone", label: "Phone Number", required: true, xs: 12, md: 4 },
              { name: "physicalAddress", label: "Physical Address", required: true, xs: 12, md: 4 },
              { name: "website", label: "Website (Optional)", xs: 12, md: 4 },
              { name: "walletAddress", label: "Wallet Address", required: true, xs: 12, md: 4 },
              { name: "certificationNumber", label: "Certification Number", disabled: true, xs: 12, md: 4 },
            ].map((field) => (
              <Grid item xs={field.xs} md={field.md} key={field.name}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  disabled={field.disabled}
                  InputLabelProps={{ 
                    shrink: field.type === "date" ? true : undefined,
                    required: false 
                  }}
                  sx={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0, 75, 141, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 75, 141, 0.6)",
                      },
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Footer Section */}
          <Box sx={{ 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "space-between", 
  mt: 4,
  flexDirection: { xs: "column", sm: "row" },
  gap: 2
}}>
  <FormControlLabel
    control={
      <Checkbox 
        checked={privacyChecked} 
        onChange={handleChange} 
        name="privacyChecked"
        color="primary"
        sx={{
          color: "#004b8d",
          "&.Mui-checked": {
            color: "#004b8d",
          },
        }}
      />
    }
    label={
      <Typography variant="body2" sx={{ color: "#004b8d" }}>
        I confirm that the information provided is accurate, and I agree to the{" "}
        <a href="/userstore/userstorepages/privacypolicy" style={{ color: "#004b8d", fontWeight: 600 }}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/userstore/userstorepages/terms" style={{ color: "#004b8d", fontWeight: 600 }}>
          Terms of Service
        </a>.
      </Typography>
    }
  />

  <Button
    type="submit"
    variant="contained"
    disabled={isSubmitting}
    sx={{ 
      padding: "12px 40px",
      backgroundColor: "#004b8d",
      "&:hover": {
        backgroundColor: "#003366"
      },
      minWidth: "220px",
      fontSize: "1rem",
      fontWeight: 500,
      textTransform: "none",
      borderRadius: 2,
    }}
  >
    {isSubmitting ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      "Register Manufacturer"
    )}
  </Button>
</Box>


        </Box>
      </Box>

      {/* Message Boxes */}
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
          zIndex: 2000,
          pointerEvents: "none",
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
      <FooterSection />
    </Box>
  );
};

export default ManufacturerForm;