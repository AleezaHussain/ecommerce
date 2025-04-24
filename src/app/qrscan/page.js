"use client";
import React, { useRef, useState } from "react";
import {
  Box, Typography, Button, CircularProgress, Container, Paper, Snackbar, Alert
} from "@mui/material";

export default function QRScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied. Please enable camera permissions.");
    }
  };

  const captureFrame = () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas to actual video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Enhance image quality for QR detection
      ctx.imageSmoothingEnabled = false;
      
      // Convert to high-quality PNG
      const dataURL = canvas.toDataURL("image/png", 1.0);
      setCapturedImg(dataURL);
    } catch (err) {
      console.error("Capture error:", err);
      setError("Failed to capture image");
    }
  };

  const submitToLaptop = async () => {
    try {
      setLoading(true);
      
      // Validate image first
      if (!capturedImg || !capturedImg.startsWith('data:image')) {
        throw new Error("Invalid captured image");
      }
  
      const response = await fetch("/api/qrlink", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          image: capturedImg,
          timestamp: new Date().toISOString() // for debugging
        }),
        timeout: 10000 // 10 second timeout
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send to laptop");
      }
      
      setSuccess(true);
      window.open("http://localhost:3000/qrcode", "_blank");
    } catch (err) {
      console.error("Submit error:", err);
      setError(`Failed to send: ${err.message}`);
      
      // Additional debugging info
      console.log("Captured image size:", capturedImg?.length);
      console.log("Network status:", navigator.onLine);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>

        <Typography variant="h5">Scan QR from Phone</Typography>

        <video 
          ref={videoRef} 
          style={{ width: "100%", borderRadius: 8 }} 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={startCamera}>
            Start Camera
          </Button>
          <Button 
            variant="contained" 
            onClick={captureFrame}
            disabled={false}
          >
            Capture Frame
          </Button>
        </Box>

        {capturedImg && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Preview:</Typography>
            <img 
              src={capturedImg} 
              alt="Captured" 
              style={{ 
                width: "100%", 
                maxHeight: 300,
                border: "1px solid #ccc",
                borderRadius: 4,
                marginTop: 8
              }} 
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={submitToLaptop}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Sending...
                </>
              ) : "Send to Laptop"}
            </Button>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">
          Image sent successfully! Check your laptop for verification.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

    </Container>

  );
}