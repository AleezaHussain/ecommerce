"use client";

import React, { useRef } from "react";
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const brands = [
  { name: "Reckitt", logo: "/reckitt.png" },
  { name: "GSK Consumer Healthcare", logo: "/gsk.png" },
  { name: "Getz Pharma", logo: "/pha.png" },
  { name: "Martin Dow Marker", logo: "/mar.png" },
  { name: "Searle", logo: "/se.png" },
  { name: "Hilton", logo: "/hi.jpg" },
  { name: "Mead Johnsons Nutrition", logo: "/e.png" },
];

export const TopBrandsSection = () => {
  const brandScrollRef = useRef(null);

  const handleBrandScroll = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      brandScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box id="brands" sx={{ mt: 10, px: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 5, textAlign: "left" }}>
        Top Brands
      </Typography>
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => handleBrandScroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#E5E7EB" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={brandScrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: 2,
            paddingBottom: "10px",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {brands.map((brand, index) => (
            <Card
              key={index}
              sx={{
                minWidth: "180px",
                maxWidth: "180px",
                height: "120px",
                borderRadius: "12px",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                border: "1px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                "&:hover": { transform: "scale(1.05)" },
                padding: "10px",
                backgroundColor: "white",
              }}
            >
              <CardMedia
                component="img"
                image={brand.logo}
                alt={brand.name}
                sx={{
                  width: "80px",
                  height: "50px",
                  objectFit: "contain",
                }}
              />
              <CardContent sx={{ padding: "5px 0 0 0" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  {brand.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={() => handleBrandScroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#E5E7EB" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};