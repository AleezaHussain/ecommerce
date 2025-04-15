"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, CardMedia, Button, Card, CardActionArea, CardContent } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const categories = [
  {
    name: "Injections",
    image: "/hath.png",
  },
  {
    name: "Antibiotics",
    image: "/orange.png",
  },
  {
    name: "Syrups",
    image: "/bhae.jpg",
  },
  {
    name: "Tablets",
    image: "/tablets.jpg",
  },
];

export const CarouselSection = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    let interval;
    if (autoSlide) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSlide, categories.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 7000);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      gap: 2, 
      width: "100%", 
      height: "400px",
      mb: 4,
      mt: 7,
      ml: 1.5,
    }}>
      {/* Left side advertisement boxes */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2, 
        width: "30%",
        height: "100%"
      }}>
        {/* All Medicines Ad Box */}
        <Card sx={{ 
          height: "50%", 
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 6
          }
        }}>
          <CardActionArea 
            sx={{ height: "100%" }}
            onClick={() => router.push("/userstore/userstorepages/allmedicines")}
          >
            <Box sx={{ position: "relative", height: "100%" }}>
              {/* Semi-transparent overlay */}
              <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                zIndex: 1
              }} />
              
              {/* Background image */}
              <CardMedia
                component="img"
                image="/pharmacy-bg.jpg" // Replace with your medicines image
                alt="All medicines"
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.8,
                }}
              />
              
              {/* Content */}
              <Box sx={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                p: 2,
                textAlign: "center"
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold", 
                  mb: 1,
                  fontSize: "1.5rem",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
                }}>
                  Browse All Medicines
                </Typography>
                <Typography variant="body1" sx={{ 
                  mb: 2,
                  fontSize: "1rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                }}>
                  Find all your medical needs in one place
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: "#002f6c",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { 
                      backgroundColor: "#001a3a",
                      transform: "scale(1.05)"
                    },
                    transition: "all 0.2s",
                    boxShadow: 2
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Box>
          </CardActionArea>
        </Card>

        {/* QR Code Authentication Box */}
        <Card sx={{ 
          height: "50%", 
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 6
          }
        }}>
          <CardActionArea 
            sx={{ height: "100%" }}
            onClick={() => router.push("/qrcode")}
          >
            <Box sx={{ position: "relative", height: "100%" }}>
              {/* Background Image */}
              <CardMedia
                component="img"
                image="/qr-bg.jpg" // Replace with QR code related image
                alt="Medicine authentication"
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.4
                }}
              />

              {/* Content */}
              <Box sx={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#002f6c",
                p: 3,
                textAlign: "center",
                overflow: "hidden"
              }}>
                <QrCodeScannerIcon sx={{ 
                  fontSize: "3rem", 
                  color: "#002f6c",
                  mb: 1,
                  mt:1
                }} />
                
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold", 
                  mb: 1,
                  fontSize: "1.2rem",
                  textShadow: "1px 1px 3px rgba(255,255,255,0.5)"
                }}>
                  Verify Medicine Authenticity
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 1,
                  fontSize: "0.9rem",
                  textShadow: "1px 1px 2px rgba(255,255,255,0.4)",
                  maxWidth: "90%",
                }}>
                  Scan QR code to check genuine medicines
                </Typography>

                <Button 
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1.5,
                    backgroundColor: "#002f6c",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#001a3a"
                    }
                  }}
                >
                  Scan Now
                </Button>
              </Box>
            </Box>
          </CardActionArea>
        </Card>
      </Box>

      {/* Right side carousel (non-clickable) */}
      <Box sx={{ 
        position: "relative", 
        width: "67%", 
        overflow: "hidden", 
        height: "100%",
        borderRadius: 2,
        boxShadow: 3
      }}>
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              transform: "translateY(-50%) scale(1.1)"
            },
            transition: "all 0.2s",
            width: 40,
            height: 40
          }}
        >
          <ChevronLeftIcon fontSize="medium" />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              transform: "translateY(-50%) scale(1.1)"
            },
            transition: "all 0.2s",
            width: 40,
            height: 40
          }}
        >
          <ChevronRightIcon fontSize="medium" />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            width: `${categories.length * 100}%`,
            height: "100%",
            transform: `translateX(-${currentIndex * (100 / categories.length)}%)`,
            transition: "transform 0.5s ease",
          }}
        >
          {categories.map((category, index) => (
            <Box
              key={index}
              sx={{
                width: `${100 / categories.length}%`,
                flexShrink: 0,
                position: "relative",
                height: "100%",
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={category.image}
                alt={category.name}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                  height: "100%",
                }}
              />
              
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};