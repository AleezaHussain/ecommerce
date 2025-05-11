"use client";
import React, { useState } from "react";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  Divider,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SuccessMsgBox, ErrorMsgBox } from "../components/MsgBox";
import NavBar from "../components/NavBar";
import { FooterSection } from "../userstore/sections/FooterSection";
import Loading from "../components/loading";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);
  const [openErrorMsg, setOpenErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") setErrors({ ...errors, email: "" });
    else if (name === "password") setErrors({ ...errors, password: "" });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 👈 Start loader
  
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ ...errors, password: "Password must be at least 6 characters" });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          role: "user",
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Account created successfully! Please login.");
        setOpenSuccessMsg(true);
        setIsSignIn(true);
      } else {
        setErrorMsg(data.message || "Signup failed");
        setOpenErrorMsg(true);
      }
    } catch (error) {
      setErrorMsg("Signup failed. Please try again.");
      setOpenErrorMsg(true);
    } finally {
      setIsLoading(false); // 👈 Always stop loader
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 👈 Start loader
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/userstore/userstorepages/dashboard';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        setErrorMsg(data.message || "Login failed");
        setOpenErrorMsg(true);
        setIsLoading(false); // 👈 Stop loader on error
      }
    } catch (error) {
      setErrorMsg("Login failed. Please check your connection and try again.");
      setOpenErrorMsg(true);
      setIsLoading(false); // 👈 Stop loader on error
    }
  };
  
  
const handleLogout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Optional: Call logout API if you have one
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Redirect to login page
    window.location.href = '/userlogin';
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.href = '/userlogin';
  }
};
if (isRedirecting) {
  return <Loading />;
}


  return (
    <>
      {/* Message Boxes */}
      <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 2000 }}>
        <SuccessMsgBox
          open={openSuccessMsg}
          onClose={() => setOpenSuccessMsg(false)}
          message={successMsg}
          routeButton={!isSignIn ? { path: "/login", label: "Go to Login" } : null}
        />
        <ErrorMsgBox
          open={openErrorMsg}
          onClose={() => setOpenErrorMsg(false)}
          message={errorMsg}
        />
      </Box>

      <NavBar />

      {/* Hero Section with Video Background */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", md: "500px" },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          mb: 6,
          pt:13,
          overflow: "hidden",
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
          <source src="/user-bg.mp4" type="video/mp4" />
        </Box>
        
        {/* Dark overlay for better text readability */}
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
        <Box sx={{ 
          position: "relative", 
          zIndex: 2, 
          px: 4,
          maxWidth: "800px"
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            {isSignIn ? "Welcome Back" : "Create Your Account"}
          </Typography>
          <Typography 
            variant="h5"
            sx={{
              textShadow: "0 1px 2px rgba(0,0,0,0.3)"
            }}
          >
            {isSignIn ? "Sign in to access your account" : "Join our community today"}
          </Typography>
          {/* Add the View Store link here */}
          <Button
  variant="outlined"
  onClick={() => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = "/userstore";
    }, 1000); // Delay for loader effect
  }}
  sx={{
    mt: 3,
    color: "white",
    borderColor: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "white"
    }
  }}
>
  View Store Without Login
</Button>

        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Grid container spacing={6}>
          {/* Form Column */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: "#002F6C" }}>
                {isSignIn ? "Sign In" : "Create Account"}
              </Typography>

              {isSignIn ? (
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
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
                    sx={{ mb: 3 }}
                  />
                  <Button
  fullWidth
  type="submit"
  variant="contained"
  size="large"
  disabled={isLoading}
  sx={{
    backgroundColor: "#002F6C",
    "&:hover": { backgroundColor: "#001A3A" },
    py: 1.5,
    fontSize: "1rem",
    fontWeight: 500,
  }}
>
  {isLoading ? <CircularProgress size={23} sx={{ color: "white" }} /> : "Sign In"}
</Button>


                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
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
                    sx={{ mb: 3 }}
                  />
                  <Button
  fullWidth
  type="submit"
  variant="contained"
  size="large"
  disabled={isLoading}
  sx={{
    backgroundColor: "#002F6C",
    "&:hover": { backgroundColor: "#001A3A" },
    py: 1.5,
    fontSize: "1rem",
    fontWeight: 500,
  }}
>
  {isLoading ? <CircularProgress size={23} sx={{ color: "white" }} /> : "Create Account"}
</Button>

                </form>
              )}
            </Paper>
          </Grid>

          {/* Info Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: "#002F6C" }}>
                {isSignIn ? "New to PharmaGuard?" : "Already have an account?"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {isSignIn
                  ? "Join our community to access exclusive features and manage your pharmaceutical needs."
                  : "Sign in to access your account and continue your journey with us."}
              </Typography>
              <Button
                variant={isSignIn ? "contained" : "outlined"}
                size="large"
                onClick={() => setIsSignIn(!isSignIn)}
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: isSignIn ? "#002F6C" : "transparent",
                  color: isSignIn ? "white" : "#002F6C",
                  borderColor: "#002F6C",
                  "&:hover": {
                    backgroundColor: isSignIn ? "#001A3A" : "rgba(0, 47, 108, 0.08)",
                  },
                  alignSelf: "flex-start",
                }}
              >
                {isSignIn ? "Create Account" : "Sign In"}
              </Button>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#002F6C" }}>
                Need Help?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Contact our support team:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                support@pharmaguard.com
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                0317-1719452
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <FooterSection/>
    </>
  );
};

export default Login;