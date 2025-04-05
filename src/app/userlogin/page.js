"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SuccessMsgBox, ErrorMsgBox } from "../components/MsgBox"; // Import the MsgBox components
import NavBar from "../components/NavBar";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" }); // Validation errors
  const [successMsg, setSuccessMsg] = useState(""); // Success message
  const [errorMsg, setErrorMsg] = useState(""); // Error message
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false); // Success MsgBox state
  const [openErrorMsg, setOpenErrorMsg] = useState(false); // Error MsgBox state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation errors when the user types
    if (name === "email") {
      setErrors({ ...errors, email: "" });
    } else if (name === "password") {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "❌ Please enter a valid email address" });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({
        ...errors,
        password: "Password must be at least 6 characters",
      });
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      role: "user",
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("User created successfully");
        setOpenSuccessMsg(true);
        setIsSignIn(true); // Switch to login form
      } else {
        setErrorMsg(data.message || "Signup failed");
        setOpenErrorMsg(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Signup failed");
      setOpenErrorMsg(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: "❌ Please enter a valid email address" });
      return;
    }

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
        setSuccessMsg("Login successful, redirecting...");
        setOpenSuccessMsg(true);
        localStorage.setItem("token", data.token);
        // Redirect to another page after a delay
        setTimeout(() => {
          window.location.href = "/userstore"; // Replace with your desired route
        }, 2000);
      } else {
        setErrorMsg("Invalid email or password");
        setOpenErrorMsg(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Login failed");
      setOpenErrorMsg(true);
    }
  };

  return (
    <>
      {/* Success and Error Message Boxes */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 2000, // Higher than the navbar
        }}
      >
        <SuccessMsgBox
          open={openSuccessMsg}
          onClose={() => setOpenSuccessMsg(false)}
          message={successMsg}
          routeButton={
            !isSignIn ? { path: "/login", label: "Go to Login" } : null
          }
        />
        <ErrorMsgBox
          open={openErrorMsg}
          onClose={() => setOpenErrorMsg(false)}
          message={errorMsg}
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
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
      </Box>

      <NavBar/>
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
          {/* Login and Sign Up Buttons */}
          <Box
            sx={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              onClick={() => setIsSignIn(true)}
              sx={{
                borderRadius: "15px",
                backgroundColor: !isSignIn ? "white" : "#1976D2",
                color: !isSignIn ? "#1976D2" : "white",
                fontSize: "0.85rem",
                padding: "6px 20px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.3s ease, color 0.3s ease",
                border: !isSignIn ? "1px solid white" : "#1976D2",
                "&:hover": {
                  backgroundColor: !isSignIn ? "white" : "#1976D2",
                  color: !isSignIn ? "#1976D2" : "#fff",

                },
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => setIsSignIn(false)}
              sx={{
                borderRadius: "15px",
                backgroundColor: !isSignIn ? "#1976D2" : "white",
                color: !isSignIn ? "white" : "#1976D2",
                fontSize: "0.85rem",
                padding: "6px 20px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.3s ease, color 0.3s ease",
                border: !isSignIn ? "1px solid #1976D2" : "white",
                "&:hover": {
                  backgroundColor: !isSignIn ? "#1976D2" : "white",
                  color: !isSignIn ? "#fff" : "#1976D2",

                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Form */}
          {isSignIn ? (
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Sign In
              </Typography>
              <TextField
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  width: "100%",
                  mb: 2,
                }}
              />
              {errors.email && (
                <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
                  {errors.email}
                </Typography>
              )}
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  width: "100%",
                  mb: 2,
                }}
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
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  width: "100%",
                  borderRadius: "15px",
                  fontSize: "0.85rem",
                  padding: "6px",
                  backgroundColor: "#1976D2",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                  },
                }}
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ width: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Create Account
              </Typography>
              <TextField
                type="text"
                name="username"
                placeholder="Username"
                required
                onChange={handleChange}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  width: "100%",
                  mb: 2,
                }}
              />
              <TextField
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  width: "100%",
                  mb: 2,
                }}
              />
              {errors.email && (
                <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
                  {errors.email}
                </Typography>
              )}
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  width: "100%",
                  mb: 2,
                }}
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
              {errors.password && (
                <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
                  {errors.password}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  width: "100%",
                  borderRadius: "15px",
                  fontSize: "0.85rem",
                  padding: "6px",
                  backgroundColor: "#1976D2",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                  },
                }}
              >
                Sign Up
              </Button>
            </form>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Login;