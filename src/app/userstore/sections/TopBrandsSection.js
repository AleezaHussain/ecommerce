"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const brands = [
  { name: "Reckitt", logo: "/reckitt.png" },
  { name: "GSK Consumer Healthcare", logo: "/gsk.png" },
  { name: "Getz Pharma", logo: "/pha.png" },
  { name: "Martin Dow Marker", logo: "/mar.png" },
  { name: "Searle", logo: "/se.png" },
  { name: "Hilton", logo: "/hi.jpg" },
  { name: "Dvago", logo: "/partner1.png" },
  { name: "Mead Johnsons Nutrition", logo: "/e.png" },
  { name: "Dawai", logo: "/partner4.png" },
  { name: "Sehat", logo: "/partner3.png" },
];

const allBrands = [...brands, ...brands];

export const TopBrandsSection = () => {
  return (
    <Box id="brands" sx={{ mt: 10, px: 3, overflow: "hidden" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 5, textAlign: "left" }}
      >
        Top Brands
      </Typography>

      {/* Outer container for spacing */}
      <Box sx={{ pl: 4, pr: 4 }}> {/* Add padding left/right here */}
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: "scrollLeft 30s linear infinite",
            gap: 2,
          }}
        >
          {allBrands.map((brand, index) => (
            <Card
              key={index}
              sx={{
                minWidth: "180px",
                maxWidth: "180px",
                height: "160px",
                borderRadius: "12px",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                border: "1px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "10px",
                backgroundColor: "white",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                image={brand.logo}
                alt={brand.name}
                sx={{
                  width: "90px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
              <CardContent sx={{ padding: "5px 0 0 0" }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "14px", color: "#002f6c" }}
                >
                  {brand.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Keyframes animation */}
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
