"use client";
import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { Verified, Security, Medication, LocalPharmacy, Blockchain, QrCode } from '@mui/icons-material';
import { CardMedia } from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import { FooterSection } from '../../sections/FooterSection';

const aboutus = () => {
  const features = [
    {
        icon: <LanIcon color="primary" />,
        title: "Blockchain-Verified Manufacturers",
      description: "Every manufacturer in our network is authenticated and recorded on the blockchain"
    },
    {
      icon: <Verified color="primary" />,
      title: "Smart Contract Approvals",
      description: "Automated verification of medicine authenticity through smart contracts"
    },
    {
      icon: <QrCode color="primary" />,
      title: "Trackable Packaging",
      description: "Each product has a unique QR code linking to its blockchain record"
    },
    {
      icon: <Security color="primary" />,
      title: "Tamper-Proof Records",
      description: "Immutable medication history from manufacturer to your doorstep"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Manufacturer Verification",
      description: "We authenticate pharmaceutical companies through blockchain identity verification"
    },
    {
      step: "2",
      title: "Medicine Approval & Certification",
      description: "Each batch receives a digital certificate stored on the blockchain for approving authentic medicines"
    },
    {
      step: "3",
      title: "Smart Packaging",
      description: "QR-enabled labels with encrypted product journey information"
    },
    {
      step: "4",
      title: "User Verification",
      description: "Scan any product to view its complete authenticated history"
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
          {/* Hero Section */}
          <Box sx={{ 
            textAlign: 'center',
            mb: 6,
            p: 4,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            borderLeft: '6px solid #016A70'
          }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#002F6C'
              }}
            >
              Revolutionizing Pharmacy with Blockchain Technology
            </Typography>
            
            <Typography variant="h5" sx={{ mb: 3 }}>
              Trusted Medications. Transparent Supply Chain. Tamper-Proof Records.
            </Typography>
            
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Our blockchain-powered platform ensures every medicine comes from verified manufacturers with complete supply chain transparency, giving you unprecedented confidence in your medications.
            </Typography>
          </Box>

          {/* Our Story */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: '#002F6C'
            }}>
              Our Story
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Founded in 2023, we recognized a critical need for transparency in the pharmaceutical supply chain. 
                  Counterfeit medications account for nearly 10% of the global medicine market, putting millions at risk.
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We built the first blockchain-integrated pharmacy platform that authenticates every manufacturer, 
                  verifies each medicine batch, and provides customers with immutable product histories.
                </Typography>
                
                <Typography variant="body1">
                  Today, we partner with 50+ blockchain-verified manufacturers to deliver 100% authentic medications 
                  with complete supply chain visibility.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image="/pharmacy-lab.png"
                    alt="Pharmacy verification lab"
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Blockchain Features */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: '#002F6C',
              textAlign: 'center'
            }}>
              How Blockchain Secures Your Medications
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 2
                  }}>
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      mb: 2,
                      mx: 'auto',
                      backgroundColor: '#e3f2fd'
                    }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">
                      {feature.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Verification Process */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: '#002F6C',
              textAlign: 'center'
            }}>
              Our 4-Step Verification Process
            </Typography>
            
            <Grid container spacing={4}>
              {processSteps.map((step) => (
                <Grid item xs={12} md={3} key={step.step}>
                  <Card sx={{ 
                    height: '100%',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    borderTop: '4px solid #016A70'
                  }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: '#016A70'
                    }}>
                      {step.step}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2
                    }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2">
                      {step.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Medicine Verification Demo */}
          <Box sx={{ 
            p: 4,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: '#002F6C'
            }}>
              Verify Any Medication
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
              Scan the QR code on your medication packaging to view its complete blockchain-verified history
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap'
            }}>
              <Card sx={{ 
                width: 200,
                height: 200,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white'
              }}>
                <QrCode sx={{ fontSize: 150, color: '#016A70' }} />
              </Card>
              
              <Box sx={{ 
                textAlign: 'left',
                maxWidth: '400px'
              }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Verified color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manufacturer authentication" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Medication color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Batch production details" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalPharmacy color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Supply chain journey" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Quality control checks" />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <FooterSection/>
    </>
  );
};

export default aboutus;