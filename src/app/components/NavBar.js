"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Modal, IconButton } from "@mui/material";import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";


const NavBar = ({ loginButton }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/landingpage";
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#004b8d",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        zIndex: 1500,
        height: "60px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }} onClick={() => router.push("/")}>
          Home
        </Typography>
        <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }} onClick={() => router.push("/contact")}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ cursor: "pointer", color: "#ffffff" }} onClick={() => router.push("/about")}>
          About Us
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
        <Typography variant="h6" sx={{ ml: 1, color: "#ffffff" }}>
          MediCare
        </Typography>
      </Box>
      {isLandingPage && (
        <Box sx={{ display: "flex", gap: 2 }}>
          {loginButton && (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0066cc", color: "#fff", "&:hover": { backgroundColor: "#005bb5" } }}
              onClick={handleOpenModal}
            >
              Login
            </Button>
          )}
        </Box>
      )}

<Modal open={openModal} onClose={handleCloseModal}>
  <Box
    sx={{
      position: "absolute",
      top: "53%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "white",
      padding: 4,
      borderRadius: 2,
      boxShadow: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      width: 500,
      height: 400,
      position: "relative",
      
    }}
  >
    {/* Close Button */}
    <IconButton
      onClick={handleCloseModal}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        color: "#444",
      }}
    >
      <CloseIcon />
    </IconButton>

    <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 1 }}>
      Choose Login Type
    </Typography>
    <Box sx={{ display: "flex", gap: 4 }}>
      {/* Manufacturer Button */}
      <Box
        onClick={() => router.push("/manufacturerlogin")}
        sx={{
          cursor: "pointer",
          textAlign: "center",
          "&:hover": { transform: "scale(1.05)" },
          transition: "transform 0.3s",
        }}
      >
        <Box
          sx={{
            width: 180,
            height: 180,
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Image src="/manufacturer.jpg" alt="Manufacturer" layout="fill" objectFit="cover" />
        </Box>
        <Typography variant="body1">Login as Manufacturer</Typography>
      </Box>

      {/* User Button */}
      <Box
        onClick={() => router.push("/userlogin")}
        sx={{
          cursor: "pointer",
          textAlign: "center",
          "&:hover": { transform: "scale(1.05)" },
          transition: "transform 0.3s",
        }}
      >
        <Box
          sx={{
            width: 180,
            height: 180,
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Image src="/user.jpg" alt="User" layout="fill" objectFit="cover" />
        </Box>
        <Typography variant="body1">Login as User</Typography>
      </Box>
    </Box>

    {/* Admin Login Link */}
    <Typography
      variant="body1"
      sx={{
        marginTop: 1,
        cursor: "pointer",
        color: "#0066cc",
        "&:hover": { textDecoration: "underline" },
      }}
      onClick={() => router.push("/adminlogin")}
    >
      Login as Admin
    </Typography>
  </Box>
</Modal>
    </Box>
  );
};

export default NavBar;
