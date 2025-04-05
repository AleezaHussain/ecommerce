"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export const FooterSection = () => {
  return (
    <Box
      sx={{
        mt: 10,
        py: 4,
        bgcolor: "#016A70",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
        MediCare
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Your trusted partner in health and wellness.
      </Typography>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} MediCare. All rights reserved.
      </Typography>
    </Box>
  );
};