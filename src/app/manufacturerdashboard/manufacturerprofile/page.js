"use client";
import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { getApprovedManufacturers } from "../../testingblockchain/accepted-rejected-manufacturer/fetch";
import { ethers } from "ethers";
import Allnavbar from "../../userstore/sections/Allnavbar";
import NavBar from "../../components/NavBar";
import { FooterSection } from "../../userstore/sections/FooterSection";

const ManufacturerProfile = () => {
  const [walletStatus, setWalletStatus] = React.useState({
    connected: false,
    approved: false,
    loading: true,
    address: ""
  });
  const [manufacturerDetails, setManufacturerDetails] = React.useState({
    name: "",
    licenseNo: "",
    certificate: "",
    certificationNumber: "",
    dateOfIssue: "",
    email: "",
    phoneNumber: "",
    physicalAddress: "",
    website: ""
  });
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // Clear any wallet connection status
    setWalletStatus({
      connected: false,
      approved: false,
      loading: false,
      address: ""
    });
    // Clear manufacturer details
    setManufacturerDetails({
      name: "",
      licenseNo: "",
      certificate: "",
      certificationNumber: "",
      dateOfIssue: "",
      email: "",
      phoneNumber: "",
      physicalAddress: "",
      website: ""
    });
    // Redirect to login page
    router.push('/manufacturerlogin');
  };

  React.useEffect(() => {
    const detectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          
          // Verify manufacturer approval
          const isApproved = await fetchManufacturerDetails(address);
          
          setWalletStatus({
            connected: true,
            approved: isApproved,
            loading: false,
            address: address
          });
        } catch (error) {
          console.error("Error detecting wallet:", error);
          router.push('/manufacturerlogin');
        }
      } else {
        router.push('/manufacturerlogin');
      }
    };
  
    detectWallet();
  }, []);

  const fetchManufacturerDetails = async (address) => {
    try {
      const approvedManufacturers = await getApprovedManufacturers();
      const manufacturer = approvedManufacturers.find(
        m => m.walletAddress && m.walletAddress.toLowerCase() === address.toLowerCase()
      );
  
      if (!manufacturer) {
        throw new Error("Your account is not approved as a manufacturer");
      }
  
      setManufacturerDetails({
        name: manufacturer.manufacturerName || "Not available",
        licenseNo: manufacturer.licenceNo || "Not available",
        certificate: manufacturer.pdfCID ? `https://ipfs.io/ipfs/${manufacturer.pdfCID}` : "",
        certificationNumber: manufacturer.certificationNumber || "Not available",
        dateOfIssue: manufacturer.dateOfIssue || "Not available",
        email: manufacturer.email || "Not available",
        phoneNumber: manufacturer.phoneNumber || "Not available",
        physicalAddress: manufacturer.physicalAddress || "Not available",
        website: manufacturer.website || "Not available"
      });
  
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
      router.push('/manufacturerlogin');
      return false;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", backgroundColor: "#f9f9f9" }}>
      <NavBar 
        walletStatus={walletStatus} 
        manufacturerDetails={manufacturerDetails} 
        onLogout={handleLogout}
      />
      <Box sx={{ px: { xs: 2, md: 6 }, py: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center", color: "#004b8d" }}>
          Manufacturer Profile
        </Typography>

    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        px: { xs: 2, md: 5 },
        py: 6,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 6,
        }}
      >
        {/* Left Column */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
            Basic Information
          </Typography>

          {[
            { label: "Manufacturer Name", value: manufacturerDetails.name },
            { label: "Wallet Address", value: walletStatus.address, monospace: true },
            { label: "License Number", value: manufacturerDetails.licenseNo },
            { label: "Certification Number", value: manufacturerDetails.certificationNumber },
          ].map(({ label, value, monospace }, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                {label}:
              </Typography>
              <Typography
                variant="body1"
                sx={
                  monospace
                    ? {
                        fontFamily: "monospace",
                        wordBreak: "break-word",
                        fontSize: "0.875rem",
                        backgroundColor: "#f5f5f5",
                        p: 1,
                        borderRadius: "4px",
                      }
                    : {}
                }
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Right Column */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
            Contact Information
          </Typography>

          {[
            { label: "Email", value: manufacturerDetails.email },
            { label: "Phone Number", value: manufacturerDetails.phoneNumber },
            { label: "Physical Address", value: manufacturerDetails.physicalAddress },
            { label: "Website", value: manufacturerDetails.website },
          ].map(({ label, value }, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                {label}:
              </Typography>
              <Typography variant="body1">{value}</Typography>
            </Box>
          ))}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Certificate:
            </Typography>
            {manufacturerDetails.certificate ? (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => window.open(manufacturerDetails.certificate, "_blank")}
                sx={{
                  mt: 1,
                  textTransform: "none",
                }}
              >
                📄 View Certificate PDF
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not available
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>

</Box>

  );
};

export default ManufacturerProfile;