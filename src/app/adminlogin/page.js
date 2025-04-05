"use client"; // Ensure this is a Client Component
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
import { ErrorMsgBox, SuccessMsgBox } from "../components/MsgBox"; // Import the message box components
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import eye icons
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import NavBar from "../components/NavBar";
const AdminLoginPage = () => {
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State for modal visibility and message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // State for success and error message boxes
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Router for navigation
  const router = useRouter();

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error messages
    setEmailError("");
    setPasswordError("");

    // Validate email and password
    if (!email || !password) {
      let errorMessage = "";
      if (!email) errorMessage += "Email is required.\n";
      if (!password) errorMessage += "Password is required.\n";
      setModalMessage(errorMessage);
      setIsModalOpen(true);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("❌ Please enter a valid email address.");
      return;
    }

    try {
      // Call the backend API route
      const response = await fetch("/api/auth/alogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      // If login is successful
      setSuccessMessage("Login successful! Redirecting...");
      setSuccessOpen(true);

      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        router.push("/admin"); // Redirect to /admin/page.js
      }, 2000);
    } catch (error) {
      // Handle specific error message for invalid credentials
      if (error.message === "Invalid email or password") {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      setErrorOpen(true);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Success Message Box */}
      <Box sx={{ zIndex: 2000, position: "fixed", top: 0, left: 0, width: "100%" }}>
        <SuccessMsgBox
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          message={successMessage}
          showCloseButton={false} // Add this prop to hide the close button
        />
      </Box>

      {/* Error Message Box */}
      <Box sx={{ zIndex: 2000, position: "fixed", top: 0, left: 0, width: "100%" }}>
        <ErrorMsgBox
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          message={errorMessage}
        />
      </Box>

      {/* Background Video */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
      </Box>

      <NavBar />
      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          mt: "80px",
        }}
      >
        <Box
          sx={{
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
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#ffffff", fontWeight: "bold" }}>
            Admin Login
          </Typography>

          {/* Email Field */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.9)", 
                borderRadius: "8px",
              }}
            />
            {/* Display error message as plain text */}
            {emailError && (
              <Typography sx={{ color: "white", mt: 1, fontSize: "0.875rem" }}>
                {emailError}
              </Typography>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Login Button */}
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 1, width: "80%", borderRadius: "15px", fontSize: "0.85rem", padding: "6px" }}
          >
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default AdminLoginPage;