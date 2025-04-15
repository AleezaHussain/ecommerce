"use client";
import { useState } from "react";
import { TextField, Button, Typography, Box, Container, CircularProgress, Grid } from "@mui/material";
import Image from "next/image";
import { getManufacturerStatus, loginWithMetaMask } from "../testingblockchain/login-status-manufacture/check";
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox, StatusMsgBox } from "../components/MsgBox";
import { fetchRejectionComments } from '../../../lib/adminmanufacturerfetch';
import Link from 'next/link';
import NavBar from "../components/NavBar";
import { FooterSection } from "../userstore/sections/FooterSection";

const ManufacturerLogin = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [metaMaskErrorMessage, setMetaMaskErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [metaMaskLoading, setMetaMaskLoading] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusSeverity, setStatusSeverity] = useState("info");
    const [successAlert, setSuccessAlert] = useState({
        open: false,
        message: "",
        routeButton: null
    });

    const handleInputChange = (event) => {
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        const value = event.target.value;
        if (value && !walletRegex.test(value)) {
            setErrorMessage("Invalid Ethereum wallet address.");
            setErrorOpen(true);
        } else {
            setErrorMessage("");
        }
        setInputValue(value);
    };

    const handleSubmit = async () => {
        if (!inputValue) {
            setErrorMessage("Please enter a valid wallet address.");
            setErrorOpen(true);
            return;
        }
        if (errorMessage) return;
        
        setLoading(true);
    
        try {
            const result = await getManufacturerStatus(inputValue);
            
            if (result === null) {
                setErrorMessage("The Manufacturer does not exist");
                setErrorOpen(true);
                return;
            }
    
            if (result.includes("Approved")) {
                setStatusMessage("Your manufacturer account is approved!");
                setStatusSeverity("success");
                setStatusOpen(true);
            } else if (result.includes("Rejected")) {
                const comments = await fetchRejectionComments(inputValue);
                setErrorMessage(`Your manufacturer account has been rejected. Reason: ${comments}`);
                setErrorOpen(true);
            } else {
                setStatusMessage("Your manufacturer account is pending");
                setStatusSeverity("warning");
                setStatusOpen(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred while checking status.");
            setErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleMetaMaskLogin = async () => {
        setMetaMaskLoading(true);
    
        try {
            const result = await loginWithMetaMask();
            
            if (result === "Login Successful ✅") {
                setSuccessAlert({
                    open: true,
                    message: "Login successful! Redirecting to dashboard...",
                    routeButton: {
                        path: "/manufacturerdashboard",
                        label: "Go to Dashboard"
                    }
                });
            } else if (result === "Login Failed ❌ (Manufacturer Not Approved)") {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const walletAddress = await signer.getAddress();
                
                const comments = await fetchRejectionComments(walletAddress);
                setErrorMessage(`Your manufacturer account is not approved. Reason: ${comments}`);
                setErrorOpen(true);
            } else {
                setErrorMessage(result);
                setErrorOpen(true);
            }
        } catch (error) {
            console.error("MetaMask login error:", error);
            setErrorMessage("Failed to connect with MetaMask");
            setErrorOpen(true);
        } finally {
            setMetaMaskLoading(false);
        }
    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setErrorMessage("");
    };

    const handleCloseStatus = () => {
        setStatusOpen(false);
    };

    return (
        <>
            {/* Message Boxes */}
            <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 2000 }}>
                <StatusMsgBox
                    open={statusOpen}
                    onClose={handleCloseStatus}
                    message={statusMessage}
                    severity={statusSeverity}
                />
                <SuccessMsgBox
                    open={successAlert.open}
                    onClose={() => setSuccessAlert({ ...successAlert, open: false })}
                    message={successAlert.message}
                    routeButton={successAlert.routeButton}
                />
                <ErrorMsgBox
                    open={errorOpen}
                    onClose={handleCloseError}
                    message={errorMessage}
                />
            </Box>

            <NavBar loginButton={false} />
            
            {/* Full Page Content */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    padding: 0,
                    margin: 0,
                    pt: "115px", // Adjusted for navbar height
                    pb: 4,
                }}
            >
                {/* Hero Section */}
<Box
  sx={{
    width: "100%",
    height: "300px",
    position: "relative",
    mb: 4,
    overflow: "hidden",
  }}
>
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1,
    }}
  >
    <source src="/color.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.47)",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textAlign: "center",
      px: 2,
    }}
  >
    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
      Manufacturer Portal
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 500 }}>
      Secure access to your pharmaceutical dashboard
    </Typography>
  </Box>
</Box>


                {/* Login Form Section */}
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Grid container spacing={4}>
                        {/* Left Column - Form */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 4,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    backgroundColor: "white"
                                }}
                            >
                                <Typography variant="h4" sx={{ mb: 3, color: "#002F6C", fontWeight: 600 }}>
                                    Manufacturer Login 
                                </Typography>

                                <TextField
                                    fullWidth
                                    placeholder="Enter your wallet address"
                                    variant="outlined"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    error={!!errorMessage}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{
                                        mb: 2,
                                        py: 1.5,
                                        backgroundColor: "#002F6C",
                                        "&:hover": { backgroundColor: "#001A3A" }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Check Status"}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleMetaMaskLogin}
                                    disabled={metaMaskLoading}
                                    sx={{
                                        py: 1.5,
                                        backgroundColor: "#002F6C",
                                        "&:hover": { backgroundColor: "#001A3A" },
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }}
                                >
                                    {metaMaskLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        <>
                                            Login With MetaMask
                                            <Image 
                                                src="/metamask.png"
                                                alt="MetaMask Logo" 
                                                width={24} 
                                                height={24} 
                                            />
                                        </>
                                    )}
                                </Button>

                                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}>
                                    Note: Your MetaMask wallet address will be auto-detected
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Right Column - Info */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 4,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2, color: "#002F6C", fontWeight: 600 }}>
                                    New Manufacturer?
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Register your pharmaceutical company to join our network and start managing your products.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    href="/manufacturer"
                                    sx={{
                                        alignSelf: "flex-start",
                                        px: 4,
                                        py: 1.5,
                                        color: "#002F6C",
                                        borderColor: "#002F6C",
                                        "&:hover": {
                                            backgroundColor: "#002F6C",
                                            color: "white",
                                            borderColor: "#002F6C"
                                        }
                                    }}
                                >
                                    Register Now
                                </Button>

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: "#002F6C", fontWeight: 600 }}>
                                        Need Help?
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Contact our support team:
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Email:</strong> support@pharmaguard.com
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Phone:</strong> 0317-1719452
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <FooterSection/>
        </>
    );
};

export default ManufacturerLogin;