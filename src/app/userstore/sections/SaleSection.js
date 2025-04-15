"use client";

import React from "react";
import { Box, Typography, Grid, CardMedia } from "@mui/material";

const saleCategories = [
  {
    id: 1,
    name: "Injections",
    image: "/yellow.jpg",
    offer: "Up to 20% Off",
  },
  {
    id: 2,
    name: "Antibiotics",
    image: "/ant.webp",
    offer: "Up to 15% Off",
  },
  {
    id: 3,
    name: "Syrups",
    image: "/syrup.jpg",
    offer: "Up to 25% Off",
  },
  {
    id: 4,
    name: "Tablets",
    image: "/tablet.jpg",
    offer: "Up to 30% Off",
  },
];

export const SaleSection = () => {
  return (
    <Box id="sale" sx={{ mt: 10, textAlign: "center", px: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 5, textAlign: "left" }}>
        Sale
      </Typography>
      <Grid container spacing={6} justifyContent="center">
        {saleCategories.map((category) => (
          <Grid item key={category.id} xs={12} sm={6} md={3}>
            <Box
              sx={{
                position: "relative",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                margin: "0 auto",
                "&:hover .overlay": { opacity: 1 },
              }}
            >
              <CardMedia
                component="img"
                image={category.image}
                alt={category.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                  {category.offer}
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};