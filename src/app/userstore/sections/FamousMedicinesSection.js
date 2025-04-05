"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const famousMedicines = [
  { name: "Panadol", brand: "GSK", category: "Pain Relief", packSize: "20 Tablets", price: "Rs 200", discount: "10% Off", originalPrice: "Rs 250", image: "/panadol.webp" },
  { name: "Disprin", brand: "Bayer", category: "Pain Relief", packSize: "10 Tablets", price: "Rs 150", discount: "5% Off", originalPrice: "Rs 160", image: "/acha.jpg" },
  { name: "Brufen", brand: "Abbott", category: "Anti-inflammatory", packSize: "12 Tablets", price: "Rs 300", discount: "15% Off", originalPrice: "Rs 350", image: "/images/b.jpg" },
  { name: "Augmentin", brand: "GSK", category: "Antibiotic", packSize: "14 Tablets", price: "Rs 500", discount: "20% Off", originalPrice: "Rs 625", image: "/images/p.jpg" },
  { name: "Ventolin", brand: "GSK", category: "Respiratory", packSize: "1 Inhaler", price: "Rs 350", discount: "5% Off", originalPrice: "Rs 370", image: "/images/ajeeb.png" },
  { name: "Neurobion", brand: "Merck", category: "Vitamin Supplement", packSize: "30 Tablets", price: "Rs 400", discount: "10% Off", originalPrice: "Rs 450", image: "/images/a.jpg" },
];

export const FamousMedicinesSection = () => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box id="famous" sx={{ mt: 10, position: "relative" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, textAlign: "left" }}>
        Most Famous Medicines
      </Typography>

      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => handleScroll("left")}
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
          ref={scrollRef}
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
          {famousMedicines.map((medicine, index) => (
            <Card
              key={index}
              sx={{
                minWidth: "260px",
                maxWidth: "260px",
                borderRadius: "10px",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                border: "1px solid #E0E0E0",
                position: "relative",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              {medicine.discount && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {medicine.discount}
                </Box>
              )}

              <CardMedia
                component="img"
                image={medicine.image}
                alt={medicine.name}
                sx={{ height: "140px", objectFit: "contain", padding: "10px" }}
              />

              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  {medicine.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px" }}>
                  {medicine.brand}
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px" }}>
                  {medicine.category}
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px" }}>
                  {medicine.packSize}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "#D32F2F", fontSize: "14px" }}
                >
                  {medicine.originalPrice}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2E7D32", fontSize: "18px" }}>
                  {medicine.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "#016A70", "&:hover": { backgroundColor: "#014E50" } }}
                >
                  ADD TO CART
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={() => handleScroll("right")}
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