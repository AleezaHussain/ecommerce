"use client";
import { Box, Typography, Container } from "@mui/material";
import Allnavbar from "../../sections/Allnavbar";
import { FooterSection } from "../../sections/FooterSection";

const terms = () => {
  return (
    <Box>
      <Allnavbar />
      <Container sx={{ pt: 20, pb: 6 }}>
        <Typography variant="h4" fontWeight={700} color="#004b8d" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1" paragraph>
          By registering as a manufacturer, you agree to abide by our platform
          policies and provide accurate and verifiable information. Misuse,
          impersonation, or submission of false certification is strictly
          prohibited and may result in disqualification and legal consequences.
        </Typography>
        <Typography variant="body1" paragraph>
          The blockchain implementation ensures immutable logging of registration
          data. Once submitted, your registration data is permanently recorded on
          the blockchain and cannot be altered.
        </Typography>
        <Typography variant="body1" paragraph>
          You must ensure that your wallet address is correctly submitted. We are
          not liable for any loss due to incorrect wallet information.
        </Typography>
      </Container>
      <FooterSection />
    </Box>
  );
};

export default terms;
