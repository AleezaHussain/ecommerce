"use client";
import { useState } from "react";
import { TextField, Button, Typography, Container, Box ,CircularProgress } from "@mui/material";
import Image from "next/image";
import { getManufacturerStatus, loginWithMetaMask } from "../testingblockchain/login-status-manufacture/check"; // Import blockchain functions
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox,StatusMsgBox  } from "../components/MsgBox"; // Import message box 
import {fetchRejectionComments} from '../../../lib/adminmanufacturerfetch';
import Link from 'next/link';
import NavBar from "../components/NavBar";

const ManufacturerLogin = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState("");
    const [statusColor, setStatusColor] = useState("#ffffff");
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
    
            // Set status message and severity based on result
            if (result.includes("Approved")) {
                setStatusMessage("Your manufacturer account is approved!");
                setStatusSeverity("success");
                setStatusOpen(true);
            } else if (result.includes("Rejected")) {
                // Fetch rejection comments when account is rejected
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
                // For MetaMask login, we need to get the wallet address first
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
            {/* Background Video */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    overflow: "hidden"
                }}
            >
                <video autoPlay loop muted playsInline style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}>
                    <source src="/videos/video.mp4" type="video/mp4" />
                </video>
            </Box>

            {/* Message Boxes (Above Navbar) */}
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

            <NavBar/>
            
            {/* Main Content */}
            <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", mt: "80px" }}>
                <Box sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    boxShadow: 5,
                    borderRadius: 3,
                    maxWidth: "450px",
                    width: "100%",
                    p: 4,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(50px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h5" gutterBottom sx={{ color: "#ffffff", fontWeight: "bold" }}>
                        Check Your Status
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter your wallet address"
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                        error={!!errorMessage}
                        sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}
                    />

                    <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ mt: 1, width: "80%", borderRadius: "15px", fontSize: "0.85rem", padding: "6px" }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button>

                    <Button
    variant="contained"
    onClick={handleMetaMaskLogin}
    disabled={metaMaskLoading}

    sx={{ 
        mt: 2, 
        width: "80%", 
        borderRadius: "15px", 
        fontSize: "0.85rem", 
        padding: "6px", 
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
<Typography variant="caption" sx={{ 
    mt: 2, 
    color: "#ffffff", 
    fontSize: "0.87rem",
    textAlign: "center",
    maxWidth: "100%"
}}>
    Note: Your MetaMask wallet address will be auto-detected
</Typography>
<Typography variant="caption" sx={{ mt: 1, color: "#ffffff",    fontSize: "0.87rem",
 }}>
    <Link 
        href="/manufacturer" 
        style={{ 
            color: 'darkBlue', 
            textDecoration: 'underline',
            cursor: 'pointer'
        }}
    >
        Register as Manufacturer
    </Link>
</Typography>

                </Box>
            </Container>
        </>
    );
};

export default ManufacturerLogin;