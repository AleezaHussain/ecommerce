"use client";
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Grid, Button } from "@mui/material";
import Image from "next/image";

const CategorySection = () => {
  const categories = [
    { name: "Injection", image: "/injection-icon.webp" },
    { name: "Syrup", image: "/syrup-icon.jpeg" },
    { name: "Antibiotic", image: "/antibiotic-icon.png" },
    { name: "Capsule", image: "/tablet-icon.png" }
  ];

  return (
    <Box sx={{ mt: 4, mb: 6, px: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: "black",
          textAlign: "left",
          pl: 2,
        }}
      >
        Explore By Categories
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link href={`/userstore/userstorepages/${category.name}`} passHref>
              <Button
                fullWidth
                sx={{
                  height: "120px",
                  backgroundColor: "white",
                  color: "#002F6C",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "white",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  p: 2,
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={1000}
                    height={1000}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                {category.name}
              </Button>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
