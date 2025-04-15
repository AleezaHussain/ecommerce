"use client";

import React from "react";
import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export const FooterSection = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#002F6C",
        color: "white",
        padding: { xs: "2rem 1rem", md: "2rem 2rem" },
        marginTop: "4rem",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Logo and Description */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
            <Box>
              <Image 
                src="/logob.png" 
                alt="MediCare Logo" 
                width={250} 
                height={60} 
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}>
              Your trusted partner in health and pharmacy, providing quality care since 2025.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton aria-label="Facebook" sx={{ color: "white" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: "white" }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" sx={{ color: "white" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" sx={{ color: "white" }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: { xs: "center", md: "left" } }}>
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Home
            </Link>
            <Link href="/userstore/userstorepages/aboutus" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              About Us
            </Link>
            <Link href="/userstore/userstorepages/insights" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Medicine Insights
            </Link>
            <Link href="/userstore/userstorepages/manufacturerdescription" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Our Trusted Manufacturers
            </Link>
            <Link href="/userstore/userstorepages/adpolicy" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Advertising Policy
            </Link>
            <Link href="/userstore/userstorepages/allmedicines" color="inherit" underline="hover" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Products
            </Link>
          </Box>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={6} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: { xs: "center", md: "left" } }}>
            Contact Us
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
              123 Health Street, Medical City
            </Typography>
            <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Phone: (123) 456-7890
            </Typography>
            <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Email: info@pharmaguard24/7.com
            </Typography>
            <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
              Emergency: 0317-1719452
            </Typography>
          </Box>
        </Grid>

        {/* Newsletter */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: { xs: "center", md: "left" } }}>
            Newsletter
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}>
            Subscribe to our newsletter for the latest updates and health tips.
          </Typography>
          <Box 
            component="form" 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" }, 
              gap: 1,
              mb: 3
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                border: "none",
                flexGrow: 1,
                fontSize: "0.875rem"
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#016A70",
                color: "white",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#01565B"
                }
              }}
            >
              Subscribe
            </button>
          </Box>
          
          {/* Trusted Partners Section */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold", textAlign: { xs: "center", md: "left" } }}>
              Our Trusted Partners:
            </Typography>
            <Box sx={{ 
              display: "flex", 
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap"
            }}>
              <Image 
                src="/partner1.png" 
                alt="Partner 1" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain" }}
              />
              <Image 
                src="/partner2.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain" }}
              />
              <Image 
                src="/partner3.png" 
                alt="Partner 3" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            
              <Image 
                src="/merck-logo.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain" }}
              />
              <Image 
                src="/roche-logo.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain"}}
              />
              <Image 
                src="/gsk.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain" }}
              />
              <Image 
                src="/jj.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
              <Image 
                src="/pp.png" 
                alt="Partner 2" 
                width={80} 
                height={40} 
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box sx={{ 
        borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
        mt: 4, 
        pt: 3,
        textAlign: "center" 
      }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} PharmaGuard 24/7. All rights reserved. | 
          <Link href="/userstore/userstorepages/privacypolicy" color="inherit" underline="hover" sx={{ ml: 1 }}>
            Privacy Policy
          </Link> | 
          <Link href="/userstore/userstorepages/terms" color="inherit" underline="hover" sx={{ ml: 1 }}>
            Terms of Service
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};