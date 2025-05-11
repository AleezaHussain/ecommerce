"use client";

import React, { useState } from "react";
import { Box, Card, CardActionArea, CardMedia, Typography, Button, CircularProgress, Grid, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HealingIcon from '@mui/icons-material/Healing';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { motion } from "framer-motion"; // ✨ Add Motion

export const BrowseQRSection = () => {
  const router = useRouter();
  const [loadingShop, setLoadingShop] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  return (
    <Box
      sx={{
        px: 4,
        py: 8,
        mt: 8,
        mb: 10,
        backgroundImage: `url('/caroselpic.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "24px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      <Grid container spacing={6} alignItems="center">
        
        {/* Left Services - Animated */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#002F6C", mb: 3 }}>
              Our Services
            </Typography>
            <Stack spacing={4}>
              {/* Service 1 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <HealingIcon sx={{ fontSize: 40, color: "#016A70" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                    Wide Range of Medicines
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Browse thousands of trusted medicines, verified and ready to support your health journey.
                  </Typography>
                </Box>
              </Box>
              {/* Service 2 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <VerifiedUserIcon sx={{ fontSize: 40, color: "#016A70" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                    Medicine Authenticity Check
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Instantly verify medicines by scanning QR codes, ensuring trust and safety.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </motion.div>
        </Grid>

        {/* Right Cards - Animated */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {/* Browse All Medicines Card */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 4,
                    boxShadow: "0px 6px 18px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0px 12px 24px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#002F6C", mb: 1 }}>
                      Browse All Medicines
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                      Find all trusted medicines in one convenient place.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setLoadingShop(true);
                        setTimeout(() => router.push("/userstore/userstorepages/allmedicines"), 1000);
                      }}
                      sx={{
                        backgroundColor: "#1D4E89",
                        color: "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#163d6a",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {loadingShop ? <CircularProgress size={20} color="inherit" /> : "Shop Now"}
                    </Button>
                  </Box>
                  <CardMedia
                    component="img"
                    image="/pharmacy-bg.jpg"
                    alt="Browse Medicines"
                    sx={{ width: "50%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
              </motion.div>
            </Grid>

            {/* Verify QR Code Card */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 4,
                    boxShadow: "0px 6px 18px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0px 12px 24px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#002F6C", mb: 1 }}>
                      Verify Authenticity
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                      Check medicine authenticity instantly using QR code verification.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setLoadingScan(true);
                        setTimeout(() => router.push("/qrcode"), 1000);
                      }}
                      sx={{
                        backgroundColor: "#1D4E89",
                        color: "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#163d6a",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {loadingScan ? <CircularProgress size={20} color="inherit" /> : "Scan Now"}
                    </Button>
                  </Box>
                  <CardMedia
                    component="img"
                    image="/qr-bg.jpg"
                    alt="Verify Medicine"
                    sx={{ width: "50%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
