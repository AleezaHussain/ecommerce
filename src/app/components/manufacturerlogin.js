"use client";
import { useState } from "react";
import { TextField, Button, Typography, Container, Box, Grid, Paper, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";

const ManufacturerLogin = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState("");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        if (!inputValue) {
            setStatus("Please enter a wallet address.");
            return;
        }
        setStatus("pending");
        setTimeout(() => {
            const statuses = ["pending", "approved", "rejected"];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            setStatus(randomStatus);
        }, 1500);
    };

    const handleLogin = () => {
        alert("Login clicked with wallet: " + inputValue);
    };

    return (
        <>
            {/* Navbar */}
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "#f0f0f0",
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
                {/* Left Side: Menu Icon and Navigation Links */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {/* Menu Button (Inside Navbar) */}
                    

                    {/* Navigation Links */}
                    <Typography variant="body1" sx={{ cursor: "pointer" }}>Home</Typography>
                    <Typography variant="body1" sx={{ cursor: "pointer" }}>Contact Us</Typography>
                    <Typography variant="body1" sx={{ cursor: "pointer" }}>About Us</Typography>
                </Box>

                {/* Right Side: Logo & Website Name */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        MediCare
                    </Typography>
                </Box>
            </Box>
            
            {/* Main Content */}
            <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", mt: "80px" }}>
                <Box sx={{ display: "flex", boxShadow: 3, borderRadius: 2, overflow: "hidden", maxWidth: "600px", width: "100%" }}>
                    {/* Wallet Input and Status Checking Box */}
                    <Box sx={{ flex: 1, p: 3, backgroundColor: "white" }}>
                        <Typography variant="h5" gutterBottom>
                            Check your status
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter your wallet address"
                            variant="outlined"
                            value={inputValue}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 1 }}>
                            Submit
                        </Button>
                        {status && (
                            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                                Status: {status}
                            </Typography>
                        )}
                        {status === "approved" && (
                            <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
                                Login
                            </Button>
                        )}
                    </Box>
                    
                    {/* Always Visible Login Box */}
                    <Box sx={{ flex: 1, p: 3, backgroundColor: "#f0f0f0", textAlign: "center" }}>
                        <Typography variant="h5" gutterBottom>
                            Manufacturer Login
                        </Typography>
                        <Button variant="contained" href="/userlogin" sx={{ mt: 2 }} component="a">
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default ManufacturerLogin;
