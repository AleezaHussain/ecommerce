"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

const brands = [
  { name: "Reckitt", logo: "/reckitt.png" },
  { name: "GSK Consumer Healthcare", logo: "/gsk.png" },
  { name: "Getz Pharma", logo: "/pha.png" },
  { name: "Martin Dow Marker", logo: "/mar.png" },
  { name: "Searle", logo: "/se.png" },
  { name: "Hilton", logo: "/hi.png" },
  { name: "Dvago", logo: "/partner1.png" },
  { name: "Mead Johnsons Nutrition", logo: "/e.png" },
  { name: "Dawai", logo: "/partner4.png" },
  { name: "Sehat", logo: "/partner3.png" },
];

const allBrands = [...brands, ...brands]; // Duplicate for continuous scrolling

export const TopBrandsSection = () => {
  return (
    <Box
      id="brands"
      sx={{
        mt: 10,
        py: 8,
        width: "100%",
        backgroundImage: `url('/pharma-bg-light.jpg')`, // Your soft background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 5,
          textAlign: "center",
          color: "#002F6C",
          textShadow: "1px 1px 3px rgba(255,255,255,0.7)",
        }}
      >
        Our Trusted Partners
      </Typography>

      {/* Scrolling Logos */}
      <Box sx={{ overflow: "hidden", px: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            animation: "scrollLeft 40s linear infinite",
            width: "max-content",
          }}
        >
          {allBrands.map((brand, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                textAlign: "center",
                "&:hover img": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <Box
                component="img"
                src={brand.logo}
                alt={brand.name}
                sx={{
                  width: "150px",
                  height: "auto",
                  objectFit: "contain",
                  transition: "transform 0.4s ease",
                  mx: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{ 
                  display: "block", 
                  mt: 1, 
                  fontWeight: "bold", 
                  color: "#002F6C" 
                }}
              >
                {brand.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
};
