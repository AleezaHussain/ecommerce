"use client";
import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Chip } from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { CalendarMonth, MedicalServices, LocalPharmacy } from '@mui/icons-material';
import { FooterSection } from '../../sections/FooterSection';

const insights = () => {
  // Featured articles data
  const featuredArticles = [
    {
      id: 1,
      title: "Understanding Antibiotic Resistance",
      excerpt: "Learn how proper antibiotic use can help combat the growing threat of resistance.",
      image: "/antibiotic-resistance.webp",
      category: "Public Health",
      date: "May 15, 2023",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Science Behind COVID-19 Vaccines",
      excerpt: "How mRNA technology revolutionized vaccine development and what it means for future pandemics.",
      image: "/covid-vaccine.jpeg",
      category: "Vaccines",
      date: "April 28, 2023",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Managing Diabetes with New Generation Medications",
      excerpt: "Exploring the latest advancements in diabetes treatment options.",
      image: "/diabetes-meds.jpeg",
      category: "Chronic Conditions",
      date: "June 2, 2023",
      readTime: "6 min read"
    }
  ];

  // Health tips data
  const healthTips = [
    {
      id: 1,
      title: "Proper Medication Storage",
      tip: "Store medications in a cool, dry place away from direct sunlight and moisture.",
      icon: <MedicalServices color="primary" />
    },
    {
      id: 2,
      title: "Reading Labels Correctly",
      tip: "Always check expiration dates and dosage instructions before taking any medication.",
      icon: <LocalPharmacy color="primary" />
    },
    {
      id: 3,
      title: "Medication Timing",
      tip: "Take medications at the same time each day to maintain consistent levels in your body.",
      icon: <CalendarMonth color="primary" />
    }
  ];

  // Medicine spotlights
  const medicineSpotlights = [
    {
      id: 1,
      name: "Metformin",
      type: "Diabetes Medication",
      info: "First-line treatment for type 2 diabetes, helps control blood sugar levels.",
      image: "/metformin.jpg"
    },
    {
      id: 2,
      name: "Atorvastatin",
      type: "Cholesterol Medication",
      info: "Reduces LDL cholesterol and risk of heart disease.",
      image: "/atorvastatin.jpg"
    },
    {
      id: 3,
      name: "Sertraline",
      type: "Antidepressant",
      info: "SSRI used to treat depression, anxiety, and other mood disorders.",
      image: "/sertraline.jpg"
    }
  ];

  return (
    <>
      <Allnavbar />
      
      <Box sx={{ 
        paddingTop: '170px', 
        paddingBottom: 6, 
        backgroundColor: '#f9f9f9',
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          {/* Page Header */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#002F6C',
              textAlign: 'center'
            }}
          >
            Medicine Insights & Pharmacy Blog
          </Typography>

          <Typography variant="body1" sx={{ 
            mb: 5, 
            textAlign: 'center', 
            maxWidth: "800px", 
            mx: "auto",
            fontSize: '1.1rem'
          }}>
            Expert knowledge, medication guides, and health tips from our pharmacy professionals
          </Typography>

          {/* Featured Articles Section */}
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            color: '#002F6C'
          }}>
            Featured Articles
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {featuredArticles.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip 
                      label={article.category} 
                      size="small" 
                      sx={{ 
                        mb: 2,
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2'
                      }} 
                    />
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      minHeight: '64px'
                    }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {article.excerpt}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {article.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {article.readTime}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Health Tips Section */}
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            color: '#002F6C'
          }}>
            Pharmacy Health Tips
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {healthTips.map((tip) => (
              <Grid item xs={12} sm={4} key={tip.id}>
                <Card sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: '#e3f2fd'
                }}>
                  <Box sx={{ 
                    width: 60,
                    height: 60,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    {tip.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1
                  }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2">
                    {tip.tip}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Medicine Spotlight Section */}
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            color: '#002F6C'
          }}>
            Medicine Spotlight
          </Typography>

          <Grid container spacing={3}>
            {medicineSpotlights.map((medicine) => (
              <Grid item xs={12} sm={6} md={4} key={medicine.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    height: 120,
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}>
                    <CardMedia
                      component="img"
                      image={medicine.image}
                      alt={medicine.name}
                      sx={{ 
                        height: '80%',
                        width: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1
                    }}>
                      {medicine.name}
                    </Typography>
                    <Chip 
                      label={medicine.type} 
                      size="small" 
                      sx={{ 
                        mb: 2,
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2'
                      }} 
                    />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {medicine.info}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{
                        borderColor: '#016A70',
                        color: '#016A70',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          borderColor: '#014E50'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Newsletter Signup */}
          <Box sx={{ 
            mt: 6,
            p: 4,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: '#002F6C'
            }}>
              Stay Updated with Medicine Insights
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              Subscribe to our newsletter for the latest medication information and health tips
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              maxWidth: '500px',
              mx: 'auto'
            }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flexGrow: 1,
                  padding: '12px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px 0 0 4px',
                  fontSize: '1rem'
                }}
              />
              <Button 
                variant="contained"
                sx={{
                  backgroundColor: '#002F6C',
                  color: 'white',
                  borderRadius: '0 4px 4px 0',
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#245796'
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <FooterSection/>
    </>
  );
};

export default insights;