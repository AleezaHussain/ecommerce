"use client";

import React from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

export const Navbars = () => {
  const router = useRouter();

  const categories = [
    { name: "Injections" },
    { name: "Antibiotic" },
    { name: "Syrups" },
    { name: "Tablets" },
  ];

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.name}`);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#D32F2F",
          color: "white",
          textAlign: "center",
          padding: "8px 0",
          fontSize: "14px",
          fontWeight: "bold",
          position: "fixed",
          top: 0,
          zIndex: 1600,
        }}
      >
        We are currently experiencing technical difficulties with our call center. For assistance,
        please contact us via WhatsApp at 0317-1719452.
      </Box>

      <Box
        sx={{
          width: "100%",
          bgcolor: "#002F6C",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: "32px",
          zIndex: 1500,
          height: "60px",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">Contact Us</Typography>
          <Typography variant="body1">About Us</Typography>
        </Box>
        <TextField
          placeholder="Search Medicines..."
          variant="outlined"
          size="small"
          sx={{
            width: "30%",
            backgroundColor: "white",
            borderRadius: "4px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#016A70" }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NextImage src="/healthcare.png" alt="Logo" width={50} height={50} priority />
          <Typography variant="h6" sx={{ ml: 1 }}>
            MediCare
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          py: 2,
          mt: "92px",
          bgcolor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: "92px",
          zIndex: 1400,
          height: "45px",
        }}
      >
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="text"
            sx={{
              color: "#002F6C",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </Button>
        ))}
        <Button
          variant="text"
          sx={{ color: "#002F6C", fontWeight: "bold", fontSize: "16px" }}
          onClick={() => router.push("#insights")}
        >
          Medicine Insights
        </Button>
        <Button
          variant="text"
          sx={{ color: "#002F6C", fontWeight: "bold", fontSize: "16px" }}
          onClick={() => router.push("#famous")}
        >
          Famous medicine
        </Button>
        <Button
          variant="text"
          sx={{ color: "#002F6C", fontWeight: "bold", fontSize: "16px" }}
          onClick={() => router.push("#sale")}
        >
          Sale
        </Button>
      </Box>
    </>
  );
};