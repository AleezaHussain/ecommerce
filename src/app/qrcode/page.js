"use client";
import React, { useState, useRef, useEffect } from "react";
import { verifyMedicineByQRAndFetchDetails } from "./authenticate";
import jsQR from "jsqr";
import Allnavbar from "../userstore/sections/Allnavbar";
import { FooterSection } from "../userstore/sections/FooterSection";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Input,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export default function QRImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Clean up camera and animation frames on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setScanning(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);
        await processQRCodeResult(code?.data);
      } catch (err) {
        console.error("Error processing image:", err);
        setStatusMsg("❌ Error processing QR code");
      } finally {
        setScanning(false);
      }
    };
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
      });
      
      videoRef.current.play();
      scanQRFromCamera();
    } catch (err) {
      console.error("Camera error:", err);
      setStatusMsg("❌ Camera access denied or not available");
      setCameraActive(false);
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  };

  const scanQRFromCamera = () => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    try {
      // Only scan when video has enough data
      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code?.data) {
          processQRCodeResult(code.data);
          stopCamera();
          return;
        }
      }

      // Continue scanning
      animationRef.current = requestAnimationFrame(scanQRFromCamera);
    } catch (err) {
      console.error("Scanning error:", err);
      setStatusMsg("❌ Error scanning QR code");
      stopCamera();
    }
  };

  const processQRCodeResult = async (qrData) => {
    if (!qrData) {
      setStatusMsg("❌ No QR code detected");
      return;
    }

    try {
      setScanResult(qrData);
      setStatusMsg("🔍 Processing QR code...");
      
      const result = await verifyMedicineByQRAndFetchDetails(qrData);
      
      switch (result.status) {
        case "success":
          setStatusMsg("✅ Medicine is authentic and approved");
          setMedicineDetails(result.medicine);
          break;
        case "unapproved":
          setStatusMsg(`⚠ ${result.message}`);
          setMedicineDetails(null);
          break;
        case "not_found":
          setStatusMsg("❌ Medicine not registered on blockchain");
          setMedicineDetails(null);
          break;
        default:
          setStatusMsg("❌ Verification error: " + (result.message || "Unknown error"));
          setMedicineDetails(null);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatusMsg("❌ Error verifying medicine: " + err.message);
    }
  };

  return (
    <>
      <Allnavbar />
      <Container maxWidth="md" sx={{ pt: 15, pb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Medicine QR Code Scanner
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Button 
                variant="contained" 
                component="label" 
                startIcon={<QrCodeScannerIcon />}
                disabled={scanning}
              >
                {scanning ? "Processing..." : "Upload Image"}
                <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={cameraActive ? "outlined" : "contained"} 
                color={cameraActive ? "error" : "primary"}
                onClick={cameraActive ? stopCamera : startCamera}
                startIcon={<QrCodeScannerIcon />}
                disabled={scanning && !cameraActive}
              >
                {cameraActive ? "Stop Camera" : scanning ? "Scanning..." : "Scan with Camera"}
              </Button>
            </Grid>
          </Grid>

          {scanning && (
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body2">Scanning QR code...</Typography>
            </Box>
          )}

          {cameraActive && (
            <Box sx={{ mt: 3, position: 'relative' }}>
              <video 
                ref={videoRef} 
                style={{ 
                  width: '100%', 
                  maxHeight: '400px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#000'
                }}
                playsInline
                muted
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Point your camera at the medicine QR code
              </Typography>
            </Box>
          )}

          {selectedImage && !cameraActive && (
            <Box
              component="img"
              src={selectedImage}
              alt="Uploaded QR"
              sx={{
                width: "100%",
                maxHeight: 300,
                objectFit: "contain",
                border: "1px solid #ccc",
                mt: 2,
                borderRadius: '4px'
              }}
            />
          )}

          {statusMsg && !scanning && (
            <Typography variant="body1" sx={{ 
              mt: 2,
              color: statusMsg.includes('✅') ? 'success.main' : 
                    statusMsg.includes('❌') ? 'error.main' :
                    statusMsg.includes('⚠') ? 'warning.main' : 'text.secondary'
            }}>
              {statusMsg}
            </Typography>
          )}

          {/* Medicine details display remains the same as before */}
          {medicineDetails && (
            <Box sx={{ mt: 4 }}>
              {medicineDetails.image_url || medicineDetails.name ? (
                <Card>
                  <Grid container>
                    {medicineDetails.image_url && (
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          image={medicineDetails.image_url}
                          alt={medicineDetails.name}
                          sx={{ height: '100%', objectFit: 'contain' }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={medicineDetails.image_url ? 8 : 12}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {medicineDetails.name}
                        </Typography>
                        
                        {medicineDetails.price !== undefined && medicineDetails.quantity !== undefined ? (
                          <>
                            <Typography variant="h6" color="primary" gutterBottom>
                              ${medicineDetails.price.toFixed(2)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={medicineDetails.quantity > 0 ? "success.main" : "error"}
                              gutterBottom
                            >
                              {medicineDetails.quantity > 0 
                                ? `In Stock: ${medicineDetails.quantity} units` 
                                : "Out of Stock"}
                            </Typography>
                          </>
                        ) : (
                          <Typography color="warning.main" gutterBottom>
                            Medicine is approved but currently not available for sale
                          </Typography>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body1" paragraph>
                          {medicineDetails.description}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Details:</Typography>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                              <Typography><strong>Batch:</strong> {medicineDetails.batch_number}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography><strong>Manufactured:</strong> {new Date(medicineDetails.manufacture_date).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography><strong>Expires:</strong> {new Date(medicineDetails.expiry_date).toLocaleDateString()}</Typography>
                            </Grid>
                            
                          </Grid>
                        </Box>

                        {medicineDetails.excipients?.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Excipients:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1,alignItems:"center" }}>
                              {medicineDetails.excipients.map((excipient, index) => (
                                <Chip key={index} label={excipient} size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {medicineDetails.types?.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Types:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1,alignItems:"center" }}>
                              {medicineDetails.types.map((type, index) => (
                                <Chip key={index} label={type} size="small" color="primary" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="h6" gutterBottom>
                    Medicine Info
                  </Typography>
                  <Typography><strong>Token ID:</strong> {medicineDetails.tokenId}</Typography>
                  <Typography><strong>IPFS:</strong> {medicineDetails.ipfsHash}</Typography>
                  <Typography color="warning.main">
                    Medicine details not found in database
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Container>
      <FooterSection />
    </>
  );
}