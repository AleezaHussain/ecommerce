"use client";
import { Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";

const Navbar = () => {
  return (
    <Box
      sx={{
        bgcolor: "#EEF2F6",
        px: 4,
        py: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            color: "#016A70",
            display: { lg: "none" }, // Only show on mobile
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="body1">Home</Typography>
        <Typography variant="body1">Contact Us</Typography>
        <Typography variant="body1">About Us</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Image src="/healthcare (1).png" alt="Logo" width={40} height={40} />
        <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
          MediCare
        </Typography>
      </Box>
    </Box>
  );
};

export default Navbar;