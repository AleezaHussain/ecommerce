"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, IconButton, CircularProgress } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// ✅ Import your existing fetch function
import { fetchAllMedicines } from "../../../../lib/saleMedicineDb"; // change path as per your project

export const FamousMedicinesSection = ({ title = "Most Famous Medicines", showOnlyDiscounted = false }) => {
  const scrollRef = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await fetchAllMedicines();
        setMedicines(data || []);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  

  const medicinesToShow = showOnlyDiscounted
    ? medicines.filter(medicine => medicine.discount)
    : medicines;

  return (
    <Box id="famous" sx={{ ml: 3, mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "left" }}>
          {title}
        </Typography>
        <Box>
          <IconButton onClick={() => handleScroll("left")} sx={{ backgroundColor: "#f5f5f5", mr: 1 }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => handleScroll("right")} sx={{ backgroundColor: "#f5f5f5" }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : medicinesToShow.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography>No medicines found.</Typography>
        </Box>
      ) : (
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: 2,
            paddingBottom: "10px",
            paddingLeft: "0px",
            paddingRight: "30px",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {medicinesToShow.map((medicine, index) => (
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
                image={medicine.image || "/default-medicine.jpg"}
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

                {medicine.originalPrice && (
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: "#D32F2F", fontSize: "14px" }}
                  >
                    {medicine.originalPrice}
                  </Typography>
                )}

                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2E7D32", fontSize: "18px" }}>
                  {medicine.price}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#1D4E89",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#163d6a", transform: "scale(1.03)" },
                  }}
                >
                  ADD TO CART
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
