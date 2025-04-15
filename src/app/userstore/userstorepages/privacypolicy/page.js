"use client";
import { Box, Typography, Container } from "@mui/material";
import Allnavbar from "../../sections/Allnavbar";
import { FooterSection } from "../../sections/FooterSection";

const PrivacyPolicy = () => {
  return (
    <Box>
      <Allnavbar />
      <Container sx={{ pt: 20, pb: 6 }}>
        <Typography variant="h4" fontWeight={700} color="#004b8d" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We are committed to protecting your privacy. Any personal or business
          information submitted during the manufacturer registration process will
          only be used for authentication and verification on the blockchain.
        </Typography>
        <Typography variant="body1" paragraph>
          Information collected includes your name, email, phone number, physical
          address, wallet address, and uploaded certification documents. This data
          may be stored securely in compliance with international data protection
          standards.
        </Typography>
        <Typography variant="body1" paragraph>
          We do not share your data with third parties except where legally
          required or where blockchain validation is involved. By submitting the
          form, you acknowledge and agree to the storage and usage of this
          information.
        </Typography>
      </Container>
      <FooterSection />
    </Box>
  );
};

export default PrivacyPolicy;
