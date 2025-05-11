"use client";
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const CategorySection = () => {
  const categories = [
    { 
      name: "Injection", 
      image: "/injection-icon.webp",
      description: "Fast-acting treatments delivered directly into the bloodstream."
    },
    { 
      name: "Syrup", 
      image: "/syrup-icon.jpeg",
      description: "Easy-to-swallow liquid medicines for kids and adults."
    },
    { 
      name: "Antibiotic", 
      image: "/antibiotic-icon.png",
      description: "Powerful medicines to fight bacterial infections effectively."
    },
    { 
      name: "Capsule", 
      image: "/tablet-icon.png",
      description: "Convenient oral medicines with controlled release formulas."
    }
  ];

  return (
    <Box
      sx={{
        mt: 8,
        mb: 10,
        px: 3,
        py: 6,
        backgroundImage: `url('/categoriesbg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 5,
          color: "#002F6C",
          textAlign: "center",
          textShadow: "1px 1px 2px rgba(255,255,255,0.6)"
        }}
      >
        Explore by Categories
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link href={`/userstore/userstorepages/${category.name}`} passHref>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(4px)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardActionArea sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: "bold", 
                          color: "#002F6C", 
                          mb: 1 
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#555", 
                          fontSize: "0.85rem",
                          minHeight: "40px",
                        }}
                      >
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
