"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

// Capsule Fill Animation
const fillAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const Loading = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 500); // Change every 0.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,
      }}
    >
      {/* Capsule Loader */}
      <Box
        sx={{
          width: "200px",
          height: "80px",
          borderRadius: "50px",
          border: "3px solid #0F1A3A",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          mb: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "0%",
            background: "linear-gradient(to right, #1d4e89, #c79726)",
            animation: `${fillAnimation} 3s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Three Dots Animation */}
      <Typography
        variant="h6"
        sx={{
          color: "#0F1A3A",
          fontWeight: 2000,
          letterSpacing: "1px",
          fontSize: "4rem",
        }}
      >
        {".".repeat(dotCount)}
      </Typography>
    </Box>
  );
};

export default Loading;
