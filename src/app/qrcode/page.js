"use client";
import React, { useState, useRef, useEffect } from "react";
import { verifyMedicineByQRAndFetchDetails } from "./authenticate";
import jsQR from "jsqr";
import Allnavbar from "../userstore/sections/Allnavbar";
import { FooterSection } from "../userstore/sections/FooterSection";
import { useSearchParams } from "next/navigation";

import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Tooltip
} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

export default function QRImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const [statusTooltip, setStatusTooltip] = useState("");
  const searchParams = useSearchParams();
const encodedImage = searchParams.get("img");

useEffect(() => {
  if (encodedImage) {
    const img = new Image();
    img.src = encodedImage;
    setSelectedImage(encodedImage);
    setScanning(true);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (!code?.data) {
        setStatusMsg("❌ No QR code detected in submitted frame.");
      } else {
        await processQRCodeResult(code.data);
      }

      setScanning(false);
    };
  }
}, [encodedImage]);


useEffect(() => {
  return () => {
    stopCamera();
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
  
      requestAnimationFrame(scanQRCode);
    } catch (err) {
      console.error("Camera access error:", err);
      setStatusMsg("❌ Camera access denied or unavailable.");
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
    setScanned(false);
    setCameraActive(false);
    setScanning(false);
  };
  
  // ✅ Replace your scanQRFromCamera() with this updated one

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || scanned) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
  
    if (code && code.data) {
      setScanned(true);
      setScanResult(`🔍 Scanned: ${code.data}`);
      processQRCodeResult(code.data);
      stopCamera();
    } else {
      animationRef.current = requestAnimationFrame(scanQRCode);
    }
  };
  
// ✅ Add this inside your video preview Box (below <video>):
{/*
<canvas
  ref={canvasRef}
  style={{
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    pointerEvents: 'none'
  }}
/>
*/}


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
          if (result.medicine.isNotForSale) {
            setStatusMsg("✅ Medicine approved but not currently in sale");
          } else {
            setStatusMsg("✅ Medicine is authentic and approved");
          }
          setStatusTooltip("");
          setMedicineDetails(result.medicine);
          break;
        case "rejected":
          setStatusMsg("❌ Medicine does not exist");
          setStatusTooltip(result.tooltip);
          setMedicineDetails(result.medicine);
          break;
        case "not_in_store":
          setStatusMsg("⚠ Medicine currently not available for sale");
          setStatusTooltip("");
          setMedicineDetails(result.medicine);
          break;
        case "not_found":
          setStatusMsg("❌ Medicine not registered on blockchain");
          setStatusTooltip("");
          setMedicineDetails(null);
          break;
        default:
          setStatusMsg("❌ Verification error: " + (result.message || "Unknown error"));
          setStatusTooltip("");
          setMedicineDetails(null);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatusMsg("❌ Error verifying medicine: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Allnavbar />
      <Container maxWidth="md" sx={{ pt: 20, pb: 6 }}>
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
    backgroundColor: '#000',
    transform: 'scaleX(-1)', // ✅ Corrects any mirror flip
    objectFit: 'cover'
  }}
  playsInline
  muted
/>


<canvas
  ref={canvasRef}
  style={{
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    pointerEvents: 'none'
  }}
/>
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
            <Box sx={{ mt: 2 }}>
              {typeof statusMsg === 'string' ? (
                <Typography variant="body1" sx={{ 
                  color: statusMsg.includes('✅') ? 'success.main' : 
                        statusMsg.includes('❌') ? 'error.main' :
                        statusMsg.includes('⚠') ? 'warning.main' : 'text.secondary'
                }}>
                  {statusMsg}
                </Typography>
              ) : (
                statusMsg
              )}
            </Box>
          )}

          {medicineDetails && (
            <Box sx={{ mt: 4 }}>
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
                        {medicineDetails.name || "Unknown Medicine"}
                      </Typography>
                      
                      {statusMsg.includes("not available") || medicineDetails.isNotForSale ? (
                        <Box sx={{ display: 'flex', textAlign: 'center', mb: 2 }}>
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                          <Typography color="warning.main">
                            Medicine is approved but currently not available for sale
                          </Typography>
                        </Box>
                      ) : medicineDetails.price !== undefined && medicineDetails.quantity !== undefined ? (
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
                      ) : null}

                      <Divider sx={{ my: 2 }} />

                      {medicineDetails.description && (
                        <Typography variant="body1" paragraph>
                          {medicineDetails.description}
                        </Typography>
                      )}

                      

                      
                      {medicineDetails.excipients?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Excipients:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, alignItems: "center" }}>
                            {medicineDetails.excipients.map((excipient, index) => (
                              <Chip key={index} label={excipient} size="small" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {medicineDetails.types?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Types:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, alignItems: "center" }}>
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
            </Box>
          )}
        </Paper>
      </Container>
      <FooterSection />
    </>
  );
}



// "use client";
// import React, { useState, useEffect } from "react";
// import { verifyMedicineByQRAndFetchDetails } from "./authenticate";
// import jsQR from "jsqr";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Container,
//   Paper,
//   Button,
//   Chip,
//   Divider,
//   Alert
// } from "@mui/material";
// import Allnavbar from "../userstore/sections/Allnavbar";
// import { FooterSection } from "../userstore/sections/FooterSection";

// export default function QRImageUploadPage() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [statusMsg, setStatusMsg] = useState("Waiting for image from phone...");
//   const [medicineDetails, setMedicineDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchImage = async () => {
//     try {
//       const res = await fetch("/api/qrlink");
//       if (!res.ok) {
//         setStatusMsg("No image received yet. Please scan from phone.");
//         setLoading(false);
//         return;
//       }

//       const { image } = await res.json();
//       if (!image) {
//         setStatusMsg("No QR image found in the response.");
//         setLoading(false);
//         return;
//       }

//       setSelectedImage(image);
//       await processImage(image);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching image from phone");
//       setLoading(false);
//     }
//   };

//   const processImage = async (imageSrc) => {
//     try {
//       setLoading(true);
//       const img = new Image();
//       img.src = imageSrc;

//       img.onload = async () => {
//         // Create canvas with original dimensions
//         const canvas = document.createElement("canvas");
//         canvas.width = img.naturalWidth || img.width;
//         canvas.height = img.naturalHeight || img.height;
        
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
//         // Enhance image for QR detection
//         ctx.imageSmoothingEnabled = false;
        
//         // Convert to grayscale for better QR detection
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const grayData = new Uint8ClampedArray(imageData.data.length / 4);
        
//         for (let i = 0; i < imageData.data.length; i += 4) {
//           grayData[i/4] = (
//             imageData.data[i] * 0.299 +
//             imageData.data[i+1] * 0.587 +
//             imageData.data[i+2] * 0.114
//           );
//         }
        
//         // Detect QR code
//         const code = jsQR(grayData, canvas.width, canvas.height, {
//           inversionAttempts: "dontInvert"
//         });

//         if (!code?.data) {
//           setStatusMsg("No QR code detected in the image.");
//           setLoading(false);
//           return;
//         }

//         await verifyQRCode(code.data);
//       };
//     } catch (err) {
//       console.error("Image processing error:", err);
//       setError("Failed to process QR code");
//       setLoading(false);
//     }
//   };

//   const verifyQRCode = async (qrData) => {
//     try {
//       setStatusMsg("Verifying QR code...");
//       const result = await verifyMedicineByQRAndFetchDetails(qrData);
      
//       if (result.status === "success") {
//         setMedicineDetails(result.medicine);
//         setStatusMsg("QR verified successfully");
//       } else {
//         setStatusMsg(result.message || "Verification failed");
//         if (result.medicine) {
//           setMedicineDetails(result.medicine);
//         }
//       }
//     } catch (err) {
//       console.error("Verification error:", err);
//       setError("Error during verification");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchImage();
//     const interval = setInterval(fetchImage, 5000); // Poll every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not specified';
//     try {
//       const date = new Date(dateString);
//       return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   return (
//     <>
//       <Allnavbar/>
//       <Container maxWidth="md" sx={{ pt: 10, pb: 6 }}>
//         <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Medicine QR Verification
//           </Typography>

//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

// {selectedImage && (
//   <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
//     <img
//       src={selectedImage}
//       alt="Received from phone"
//       style={{ 
//         maxWidth: "100%",
//         maxHeight: "60vh",
//         width: "auto",
//         height: "auto",
//         border: "1px solid #ccc", 
//         borderRadius: 4,
//         objectFit: 'contain'
//       }}
//     />
//   </Box>
// )}

//           {loading ? (
//             <Box sx={{ mt: 3 }}>
//               <CircularProgress />
//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 {statusMsg}
//               </Typography>
//             </Box>
//           ) : (
//             <Typography 
//               variant="body1" 
//               sx={{ 
//                 mt: 2,
//                 color: statusMsg.includes('success') ? 'success.main' :
//                       statusMsg.includes('fail') ? 'error.main' : 'text.primary'
//               }}
//             >
//               {statusMsg}
//             </Typography>
//           )}

//           {medicineDetails && (
//             <Box sx={{ mt: 4, textAlign: "left" }}>
//               <Typography variant="h6" gutterBottom>
//                 {medicineDetails.name || "Unknown Medicine"}
//               </Typography>
              
//               {medicineDetails.image_url && (
//                 <Box sx={{ mb: 2 }}>
//                   <img
//                     src={medicineDetails.image_url}
//                     alt={medicineDetails.name}
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: 200,
//                       borderRadius: 4
//                     }}
//                   />
//                 </Box>
//               )}

//               <Divider sx={{ my: 2 }} />

//               <Typography paragraph>
//                 <strong>Description:</strong> {medicineDetails.description || "Not available"}
//               </Typography>

//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
//                 <Chip 
//                   label={`Batch: ${medicineDetails.batch_number || 'N/A'}`} 
//                   variant="outlined" 
//                 />
//                 <Chip 
//                   label={`Expiry: ${formatDate(medicineDetails.expiry_date)}`} 
//                   variant="outlined"
//                   color={new Date(medicineDetails.expiry_date) < new Date() ? 'error' : 'default'}
//                 />
//                 {medicineDetails.manufacture_date && (
//                   <Chip 
//                     label={`Manufactured: ${formatDate(medicineDetails.manufacture_date)}`} 
//                     variant="outlined" 
//                   />
//                 )}
//               </Box>

//               {medicineDetails.excipients?.length > 0 && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="subtitle2">Excipients:</Typography>
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
//                     {medicineDetails.excipients.map((excipient, index) => (
//                       <Chip key={index} label={excipient} size="small" />
//                     ))}
//                   </Box>
//                 </Box>
//               )}

//               {medicineDetails.types?.length > 0 && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="subtitle2">Types:</Typography>
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
//                     {medicineDetails.types.map((type, index) => (
//                       <Chip key={index} label={type} size="small" color="primary" />
//                     ))}
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//           )}

//           <Button 
//             variant="outlined" 
//             onClick={fetchImage}
//             sx={{ mt: 3 }}
//           >
//             Refresh Verification
//           </Button>
//         </Paper>
//       </Container>
//       <FooterSection/>
//     </>
//   );
// }