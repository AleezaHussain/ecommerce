"use client";
import { useState } from "react";
import { TextField, Button, Typography, Container, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { handleSubmit } from "../blockchain/handlestatussubmit";
import { loginWithMetaMask } from "../blockchain/login";

const ManufacturerLogin = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState("");
    const [statusColor, setStatusColor] = useState("#ffffff");
    const [modalOpen, setModalOpen] = useState(false);
    const [metaMaskErrorModalOpen, setMetaMaskErrorModalOpen] = useState(false);
    const [metaMaskErrorMessage, setMetaMaskErrorMessage] = useState("");
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");



    const handleCloseMetaMaskErrorModal = () => {
        setMetaMaskErrorModalOpen(false);
    };



    
    const handleInputChange = (event) => {
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        const value = event.target.value;
        if (value && !walletRegex.test(value)) {
            setModalOpen(true);
        }
        setInputValue(value);
    };

    // const handleSubmit = async () => {
    //     if (!inputValue) {
    //         setErrorMessage("Please enter a valid wallet address.");
    //         return;
    //     }
    //     setErrorMessage(""); // Clear error if input is valid

    //     setStatus("Processing...");
    //     setStatusColor("#FFC107");
    //     setTimeout(() => {
    //         const statuses = [
    //             { text: "Approved", color: "#4CAF50" },
    //             { text: "Rejected", color: "#F44336" },
    //             { text: "Pending", color: "#FFC107" }
    //         ];
    //         const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    //         setStatus(randomStatus.text);
    //         setStatusColor(randomStatus.color);
    //         setStatusModalOpen(true);
    //     }, 1500);
    // };


    // aleeza code
    const handleMetaMaskLogin = async () => {
        const result = await loginWithMetaMask();
        if (!result.success) {
            setMetaMaskErrorMessage(result.message); // Store error message
            setMetaMaskErrorModalOpen(true); // Open the modal
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCloseStatusModal = () => {
        setStatusModalOpen(false);
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
            {/* Navbar */}
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "#004b8d",
                    padding: "10px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "fixed",
                    top: 0,
                    zIndex: 1500,
                    height: "60px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

                    <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }}>Home</Typography>
                    <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }}>Contact Us</Typography>
                    <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }}>About Us</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
                    <Typography variant="h6" sx={{ ml: 1, color: "#ffffff" }}>MediCare</Typography>
                </Box>
            </Box>


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
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(15px)",
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
                        error={!!errorMessage} // Show error if there's a message
                        helperText={errorMessage} // Display the error message
                        sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}
                    />


                    <Button variant="contained" onClick={() => handleSubmit(inputValue, setErrorMessage, setStatus, setStatusColor, setStatusModalOpen)} 
                    sx={{ mt: 1, width: "80%", borderRadius: "15px", fontSize: "0.85rem", padding: "6px" }}>
                        Submit
                    </Button>
                    {/* <Button variant="contained" href="/userlogin" component="a" sx={{ mt: 2, width: "80%", borderRadius: "15px", fontSize: "0.85rem", padding: "6px" }}>
                        Login With MetaMask
                    </Button> */}

                <Button
                    variant="contained"
                    onClick={handleMetaMaskLogin}
                    sx={{ mt: 2, width: "80%", borderRadius: "15px", fontSize: "0.85rem", padding: "6px" }}
                >
                    Login With MetaMask
                </Button>
                </Box>
            </Container>

            {/* Invalid Address Modal */}
            <Dialog open={modalOpen} onClose={handleCloseModal} sx={{ '& .MuiPaper-root': { borderRadius: 5, padding: 3, backgroundColor: "#f8d7da", textAlign: "center" } }}>
                <DialogTitle sx={{ color: "#721c24", fontWeight: "bold" }}>Invalid Wallet Address</DialogTitle>
                <DialogContent>
                    <Typography>Please enter a valid Ethereum wallet address.</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: "#721c24", color: "#fff" }}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Status Modal */}
            <Dialog 
    open={statusModalOpen} 
    onClose={handleCloseStatusModal} 
    sx={{ 
        '& .MuiPaper-root': { 
            borderRadius: 10, 
            padding: 5, 
            backgroundColor: "#f9f9f9", 
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", 
            textAlign: "center",
            minWidth: "350px"
            
        } 
    }}
>

                <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", color: statusColor }}>Status</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: statusColor, fontWeight: "bold", fontSize: "1.8rem" }}>
                        {status}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={handleCloseStatusModal} variant="contained" sx={{ bgcolor: statusColor, color: "#fff", fontWeight: "bold" }}>OK</Button>
                </DialogActions>
            </Dialog>

            <Dialog 
    open={metaMaskErrorModalOpen} 
    onClose={() => setMetaMaskErrorModalOpen(false)}
    sx={{ 
        '& .MuiPaper-root': { 
            borderRadius: 10, 
            padding: 5, 
            backgroundColor: "#f9f9f9", 
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", 
            textAlign: "center",
            minWidth: "350px"
        } 
    }}
>
    <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#F44336" }}>
        MetaMask Login Failed
    </DialogTitle>
    <DialogContent>
        <Typography sx={{ color: "#F44336", fontWeight: "bold", fontSize: "1.2rem" }}>
            {metaMaskErrorMessage}
        </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={() => setMetaMaskErrorModalOpen(false)} variant="contained" sx={{ bgcolor: "#F44336", color: "#fff", fontWeight: "bold" }}>
            OK
        </Button>
    </DialogActions>
</Dialog>

        </>
    );
};

export default ManufacturerLogin;