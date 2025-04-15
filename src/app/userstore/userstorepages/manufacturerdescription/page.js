"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Container, CircularProgress } from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { getApprovedManufacturers } from '../../../testingblockchain/accepted-rejected-manufacturer/fetch';
import { FooterSection } from '../../sections/FooterSection';

// Arrays of random data
const randomSpecialties = [
  "Vaccines", "Oncology", "Cardiology", "Neurology", "Pediatrics",
  "Antibiotics", "Pain Management", "Diabetes Care", "Respiratory",
  "Immunology", "Hormonal Therapy", "Dermatology", "Gastroenterology",
  "Rare Diseases", "Mental Health", "Anti-Infectives", "Biologics"
];

const randomDescriptions = [
  "Global leader in innovative pharmaceutical solutions with cutting-edge research facilities.",
  "Pioneer in developing life-saving medications with over 50 years of experience.",
  "Specializes in advanced therapeutic treatments for complex medical conditions.",
  "Dedicated to improving patient outcomes through innovative drug development.",
  "World-class manufacturer with FDA-approved production facilities worldwide.",
  "Focuses on affordable and accessible medicines for all populations.",
  "Research-driven company with breakthrough treatments in multiple therapeutic areas.",
  "Committed to sustainable and ethical pharmaceutical manufacturing practices."
];

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const manufacturerdescription = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        const approvedManufacturers = await getApprovedManufacturers();
        
        // Enhance manufacturers with random data
        const enhancedManufacturers = approvedManufacturers.map(manufacturer => ({
          ...manufacturer,
          specialties: getRandomItems(randomSpecialties, 3).join(', '),
          companyDescription: getRandomItems(randomDescriptions, 1)[0] || manufacturer.companyDescription
        }));
        
        setManufacturers(enhancedManufacturers);
      } catch (err) {
        console.error('Error fetching manufacturers:', err);
        setError('Failed to load manufacturers');
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  if (loading) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          paddingTop: '200px'
        }}>
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          paddingTop: '220px'
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Allnavbar />

      <Box sx={{ paddingTop: '170px', paddingBottom: 4, backgroundColor: '#f9f9f9' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#002F6C',
              textAlign: 'center'
            }}
          >
            Approved Pharmaceutical Manufacturers
          </Typography>

          <Typography variant="body1" sx={{ mb: 5, textAlign: 'center', maxWidth: "800px", mx: "auto" }}>
            We partner with certified pharmaceutical manufacturers to ensure the highest quality medicines. 
            Below are our approved manufacturing partners and their specialties.
          </Typography>

          {manufacturers.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              No approved manufacturers found.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {manufacturers.map((manufacturer) => (
                <Grid item xs={12} sm={6} md={4} key={manufacturer.tokenId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 3,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={manufacturer.logoUrl || '/default-manufacturer.png'}
                          alt={manufacturer.manufacturerName}
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            bgcolor: 'white',
                            padding: 1,
                          }}
                          variant="square"
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {manufacturer.manufacturerName}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ mb: 2 ,textAlign:"center"}}>
                        {manufacturer.companyDescription}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          Specialties:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {manufacturer.specialties.split(',').map((specialty, index) => (
                            <Box
                              key={index}
                              sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                              }}
                            >
                              {specialty.trim()}
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          License Number:
                        </Typography>
                        <Typography variant="body2">
                          {manufacturer.licenceNo}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {manufacturer.physicalAddress}
                        </Typography>
                        {manufacturer.pdfCID && (
                          <a 
                            href={`https://ipfs.io/ipfs/${manufacturer.pdfCID}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              textDecoration: 'none',
                              color: '#1976d2',
                              fontSize: '0.75rem'
                            }}
                          >
                            View Certificate
                          </a>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <FooterSection/>
    </>

  );
};

export default manufacturerdescription;