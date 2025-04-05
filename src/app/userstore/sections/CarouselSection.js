"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, CardMedia } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Injections",
    image: "/orange.jpg",
  },
  {
    name: "Antibiotics",
    image: "/haath.webp",
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
      }, 4000);
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

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.name}`);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 7000);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden", height: "680px" }}>
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          width: `${categories.length * 100}%`,
          height: "100%",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "none",
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              flexShrink: 0,
              position: "relative",
              cursor: "pointer",
              height: "100%",
            }}
            onClick={() => handleCategoryClick(category)}
          >
            <CardMedia
              component="img"
              height="100%"
              image={category.image}
              alt={category.name}
              sx={{
                width: "1560px",
                objectFit: "cover",
                height: "650px",
              }}
            />
            <Typography
              variant="h4"
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,
                color: "white",
                fontWeight: "bold",
                fontSize: "70px",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};