"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import Allnavbar from "../../sections/Allnavbar";
import { FooterSection } from "../../sections/FooterSection";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const famousMedicines = [
  { name: "Panadol", brand: "GSK", category: "Pain Relief", packSize: "20 Tablets", price: "Rs 200", discount: "10% Off", originalPrice: "Rs 250", image: "/panadol.webp" },
  { name: "Disprin", brand: "Bayer", category: "Pain Relief", packSize: "10 Tablets", price: "Rs 150", discount: "5% Off", originalPrice: "Rs 160", image: "/acha.jpg" },
  { name: "Brufen", brand: "Abbott", category: "Anti-inflammatory", packSize: "12 Tablets", price: "Rs 300", discount: "15% Off", originalPrice: "Rs 350", image: "/images/b.jpg" },
  { name: "Augmentin", brand: "GSK", category: "Antibiotic", packSize: "14 Tablets", price: "Rs 500", discount: "20% Off", originalPrice: "Rs 625", image: "/images/p.jpg" },
  { name: "Ventolin", brand: "GSK", category: "Respiratory", packSize: "1 Inhaler", price: "Rs 350", discount: "5% Off", originalPrice: "Rs 370", image: "/images/ajeeb.png" },
  { name: "Neurobion", brand: "Merck", category: "Vitamin Supplement", packSize: "30 Tablets", price: "Rs 400", discount: "10% Off", originalPrice: "Rs 450", image: "/images/a.jpg" },
  { name: "Arinac", brand: "GSK", category: "Cold & Flu", packSize: "10 Tablets", price: "Rs 180", discount: "10% Off", originalPrice: "Rs 200", image: "/images/arinac.jpg" },
  { name: "Calpol", brand: "GSK", category: "Pain Relief", packSize: "12 Tablets", price: "Rs 120", discount: "15% Off", originalPrice: "Rs 140", image: "/images/calpol.jpg" },
];

const FamousMedicinesPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // match the timeout from Allnavbar
  
    return () => clearTimeout(timeout);
  }, []);
  
   // ✅ Show loader inside Container before content
   if (isPageLoading) {
    return (
      <>
        <Allnavbar />
        <Container
          maxWidth="lg"
          sx={{
            minHeight: 'calc(100vh - 200px)',
            mt: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Container>
        <FooterSection />
      </>
    );
  }
  
  
  return (
    <>
      <Allnavbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 15, 
          mb: 4,
          minHeight: 'calc(100vh - 300px)',
          paddingTop: '40px'
        }}
      >
        
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: "bold", 
            mb: 2,
            color: '#002F6C'
          }}>
            Our Most Popular Medicines
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4,
            color: '#555',
            fontSize: '1.1rem'
          }}>
            These are our customers' favorite medicines, trusted by thousands.
          </Typography>
        </Box>
        
        {/* Medicine Cards in Grid */}
        <Grid container spacing={4}>
          {famousMedicines.map((medicine, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: "10px",
                  transition: "transform 0.3s ease-in-out",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #E0E0E0",
                  position: "relative",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                {medicine.discount && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "#4CAF50",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {medicine.discount}
                  </Box>
                )}

                <CardMedia
                  component="img"
                  image={medicine.image}
                  alt={medicine.name}
                  sx={{ height: "140px", objectFit: "contain", padding: "10px" }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px", textAlign: 'center' }}>
                    {medicine.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px", textAlign: 'center' }}>
                    {medicine.brand}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px", textAlign: 'center' }}>
                    {medicine.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px", textAlign: 'center' }}>
                    {medicine.packSize}
                  </Typography>
                  {medicine.originalPrice && (
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through", color: "#D32F2F", fontSize: "14px", textAlign: 'center' }}
                    >
                      {medicine.originalPrice}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2E7D32", fontSize: "18px", textAlign: 'center' }}>
                    {medicine.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: "#016A70", "&:hover": { backgroundColor: "#014E50" } }}
                  >
                    ADD TO CART
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <FooterSection />
    </>
  );
};

export default FamousMedicinesPage;