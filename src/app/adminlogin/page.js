"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  Link
} from "@mui/material";
import Image from "next/image";
import { ErrorMsgBox, SuccessMsgBox } from "../components/MsgBox";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
import { FooterSection } from "../userstore/sections/FooterSection";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      setErrorMessage(email ? "Password is required" : "Email is required");
      setErrorOpen(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("/api/auth/alogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      setSuccessMessage("Login successful! Redirecting...");
      setSuccessOpen(true);
      setTimeout(() => router.push("/admin"), 2000);
    } catch (error) {
      setErrorMessage(error.message === "Invalid email or password" 
        ? "Invalid credentials" 
        : "An error occurred");
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ zIndex: 2000, position: "fixed", top: 0, left: 0, width: "100%" }}>
        <SuccessMsgBox
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          message={successMessage}
          showCloseButton={false}
        />
        <ErrorMsgBox
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          message={errorMessage}
        />
      </Box>

      <NavBar />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f7fa",
          pt: "110px",
          pb: 6,
        }}
      >
        {/* Hero Section */}
        <Box
  sx={{
    width: "100%",
    height: { xs: "300px", md: "300px" },
    position: "relative",
    mb: 6,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
  }}
>
  {/* Background Video */}
  <Box
    component="video"
    autoPlay
    loop
    muted
    playsInline
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    }}
  >
    <source src="/admin-bg.mp4" type="video/mp4" />
    {/* Fallback image if video doesn't load */}
    <Box
      component={Image}
      src="/admin-hero-fallback.jpg"
      alt="Admin Portal Background"
      layout="fill"
      objectFit="cover"
    />
  </Box>
  
  {/* Dark overlay */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.47)",
      zIndex: 1,
    }}
  />
  
  {/* Content */}
  <Box sx={{ position: "relative", zIndex: 2, px: 3, maxWidth: "800px" }}>
    <Typography 
      variant="h2" 
      sx={{ 
        fontWeight: 700, 
        mb: 2,
        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
      }}
    >
      Admin Portal
    </Typography>
    <Typography 
      variant="h5"
      sx={{
        fontSize: { xs: "1.25rem", md: "1.5rem" },
        textShadow: "0 1px 2px rgba(0,0,0,0.3)"
      }}
    >
      Secure access to system administration
    </Typography>
  </Box>
</Box>

        {/* Login Form Section */}
        <Container maxWidth="md">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#002F6C" }}>
                  Admin Login
                </Typography>

                <FormControl fullWidth>
                  <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#002F6C",
                        },
                        "&:hover fieldset": {
                          borderColor: "#002F6C",
                        },
                      },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#002F6C",
                        },
                        "&:hover fieldset": {
                          borderColor: "#002F6C",
                        },
                      },
                    }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#002F6C",
                    "&:hover": { backgroundColor: "#001A3A" },
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>

                
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#002F6C" }}>
                  System Requirements
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Use your authorized admin credentials
                  </Typography>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Ensure you're on a secure network
                  </Typography>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Two-factor authentication may be required
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  For security assistance, contact:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  support@pharmaguard.com
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  0317-1719452
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <FooterSection/>
    </>
  );
};

export default AdminLoginPage;