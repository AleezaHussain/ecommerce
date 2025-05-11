"use client";

import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Link,
  Stack
} from "@mui/material";
import NextLink from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from "framer-motion";

const healthInsights = [
  {
    title: "Why Choose Generic Medicines?",
    desc: "Generic medicines are cost-effective and equally effective as branded ones.",
    img: "/lala.png",
  },
  {
    title: "Proper Medicine Storage",
    desc: "Store medicines in a cool, dry place, away from sunlight to maintain potency.",
    img: "/storage_medicine.jpg",
  },
  {
    title: "How to Take Antibiotics?",
    desc: "Always complete your antibiotic course to prevent antibiotic resistance.",
    img: "/antibiotic_guide.png",
  },
  {
    title: "Importance of Vaccination",
    desc: "Vaccines protect against serious diseases and boost immunity.",
    img: "/kiu.png",
  },
];

export const HealthInsightsSection = () => {
  return (
    <Box
      id="insights"
      sx={{
        mt: 10,
        mb: 10,
        px: 3,
        py: 6,
        backgroundImage: `url('/background-health.jpg')`, // Light background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
      }}
    >
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 5 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#002F6C",
            textShadow: "1px 1px 2px rgba(255,255,255,0.7)",
          }}
        >
          Health & Medicine Insights
        </Typography>
        <Link 
          href="/userstore/userstorepages/insights" 
          component={NextLink}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#002F6C',
            fontWeight: 'bold',
            textDecoration: 'none',
            "&:hover": {
              textDecoration: "underline",
              color: "#001a3a"
            }
          }}
        >
          View More Insights
          <ArrowForwardIcon sx={{ ml: 1, fontSize: '20px' }} />
        </Link>
      </Stack>

      <Grid container spacing={4} justifyContent="center">
  {healthInsights.map((info, index) => (
    <Grid item key={index} xs={12} sm={6} md={3}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <Card
          sx={{
            height: "300px",  // Increase height slightly for balance
            overflow: "hidden",
            borderRadius: "16px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.4s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 12px 30px rgba(0,0,0,0.2)",
            },
          }}
        >
          {/* Top Half: Image */}
          <Box sx={{ height: "50%", width: "100%" }}>
            <CardMedia
              component="img"
              image={info.img}
              alt={info.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.85)",
              }}
            />
          </Box>

          {/* Bottom Half: Text */}
          <Box 
            sx={{ 
              height: "50%", 
              width: "100%", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center",
              p: 2
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: "#002F6C", 
                mb: 0.5, 
                textAlign: "left" 
              }}
            >
              {info.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#555", 
                textAlign: "left" 
              }}
            >
              {info.desc}
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

    </Box>
  );
};
