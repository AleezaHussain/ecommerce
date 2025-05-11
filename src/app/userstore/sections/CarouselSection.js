"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, CardMedia } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const categories = [
  { name: "Injections", image: "/hath.png" },
  { name: "Antibiotics", image: "/orange.png" },
  { name: "Syrups", image: "/bhae.jpg" },
  { name: "Tablets", image: "/tablets.jpg" },
];

export const CarouselSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [hoverPause, setHoverPause] = useState(false);

  useEffect(() => {
    let interval;
    if (autoSlide && !hoverPause) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoSlide, hoverPause]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  return (
    <Box
      sx={{
        mt: 3,
        mb: 8,
        px: 2,
        py: 6,
        backgroundColor: "transparent",
        borderRadius: "24px",
        position: "relative",
        overflow: "hidden",
        height: 650,
      }}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
    >
      {/* Navigation Buttons */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 20,
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(4px)",
          "&:hover": { backgroundColor: "white" },
          width: 48,
          height: 48,
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 20,
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(4px)",
          "&:hover": { backgroundColor: "white" },
          width: 48,
          height: 48,
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Carousel Images */}
      <Box
        sx={{
          display: "flex",
          width: `${categories.length * 100}%`,
          height: "100%",
          transform: `translateX(-${currentIndex * (100 / categories.length)}%)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {categories.map((cat, idx) => (
          <Box
            key={idx}
            sx={{
              width: `${100 / categories.length}%`,
              flexShrink: 0,
              height: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: currentIndex === idx ? "scale(1.02)" : "scale(0.98)",
              transition: "transform 0.6s ease",
            }}
          >
            <CardMedia
              component="img"
              image={cat.image}
              alt={cat.name}
              sx={{
                width: "95%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "20px",
                transition: "transform 0.8s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
