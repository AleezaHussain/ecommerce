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
  Stack,
  Button
} from "@mui/material";
import NextLink from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const healthInsights = [
  {
    title: "Why Choose Generic Medicines?",
    desc: "Generic medicines are cost-effective and equally effective as branded ones.",
    img: "/lala.png",
    titleStyle: { fontSize: "22px" },
    descStyle: { fontSize: "14px" },
    contentStyle: { left: "150px" },
  },
  {
    title: "Proper Medicine Storage",
    desc: "Store medicines in a cool, dry place, away from sunlight to maintain potency.",
    img: "/storage_medicine.jpg",
    titleStyle: { fontSize: "20px" },
    descStyle: { fontSize: "14px" },
    contentStyle: { textAlign: "left", pl: 2 },
  },
  {
    title: "How to Take Antibiotics?",
    desc: "Always complete your antibiotic course to prevent antibiotic resistance.",
    img: "/antibiotic_guide.png",
    titleStyle: { fontSize: "21px" },
    descStyle: { fontSize: "15px" },
    contentStyle: {},
  },
  {
    title: "Importance of Vaccination",
    desc: "Vaccines protect against serious diseases and boost immunity.",
    img: "/kiu.png",
    titleStyle: { fontSize: "22px" },
    descStyle: { fontSize: "14px" },
    contentStyle: { left: "150px" },
  },
];

export const HealthInsightsSection = () => {
  return (
    <Box id="insights" sx={{ mt: 10, px: 3 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 5 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Health & Medicine Insights
        </Typography>
        <Link 
          href="/userstore/userstorepages/insights" 
          component={NextLink}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#002f6c',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          View More Insights
          <ArrowForwardIcon sx={{ ml: 1, fontSize: '18px' }} />
        </Link>
      </Stack>
      
      <Grid container spacing={4} justifyContent="center">
        {healthInsights.map((info, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: "relative",
                height: "220px",
                overflow: "hidden",
                borderRadius: "10px",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.08)" },
              }}
            >
              <CardMedia
                component="img"
                image={info.img}
                alt={info.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <CardContent
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  color: "black",
                  fontWeight: "bold",
                  padding: "8px",
                  textShadow: "1px 1px 2px rgba(255, 255, 255, 0.6)",
                  fontFamily: "'Poppins', sans-serif",
                  ...(info.contentStyle || {}),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", ...info.titleStyle }}>
                  {info.title}
                </Typography>
                <Typography variant="body2" sx={{ ...info.descStyle }}>
                  {info.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};