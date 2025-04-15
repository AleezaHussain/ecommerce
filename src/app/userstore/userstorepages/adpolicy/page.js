"use client";
import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { FooterSection } from '../../sections/FooterSection';

const adpolicy = () => {
  // Partner data
  const partners = [
    {
      name: "Pfizer Pharmaceuticals",
      logo: "/pfizer-logo.png",
      involvement: "Official vaccine partner providing COVID-19 and influenza vaccines",
      policy: "Exclusive vaccine provider with co-branded health awareness campaigns"
    },
    {
      name: "Novartis",
      logo: "/novartis-logo.png",
      involvement: "Cardiovascular and neuroscience medication partner",
      policy: "Joint patient education programs and medication adherence initiatives"
    },
    {
      name: "Johnson & Johnson",
      logo: "/jnj-logo.png",
      involvement: "Primary supplier of consumer health products and medical devices",
      policy: "Featured product placement and in-store promotional displays"
    },
    {
      name: "Roche Diagnostics",
      logo: "/roche-logo.png",
      involvement: "Diagnostic testing equipment and diabetes care solutions",
      policy: "Co-sponsored health screening events and testing services"
    },
    {
      name: "GSK",
      logo: "/gsk-logo.jpeg",
      involvement: "Respiratory and HIV treatment medications provider",
      policy: "Disease awareness campaigns and patient support programs"
    },
    {
      name: "Merck & Co.",
      logo: "/merck-logo.png",
      involvement: "Diabetes and infectious disease medication partner",
      policy: "Educational materials distribution and healthcare professional trainings"
    },
    {
      name: "DVAGO Pharmaceuticals",
      logo: "/partner1.png",
      involvement: "Specialized generic medicines and affordable healthcare solutions",
      policy: "Cost-effective medication programs for underserved communities"
    },
    {
      name: "Sehat ",
      logo: "/partner3.png",
      involvement: "Traditional and herbal medicine research and development",
      policy: "Integration of evidence-based traditional remedies with modern medicine"
    },
    {
      name: "Dawai ",
      logo: "/partner4.png",
      involvement: "Primary care medications and essential drugs provider",
      policy: "Accessibility initiatives for rural healthcare distribution"
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
            Advertisement & Partnership Policy
          </Typography>

          <Typography variant="body1" sx={{ 
            mb: 5, 
            textAlign: 'center', 
            maxWidth: "800px", 
            mx: "auto",
            fontSize: '1.1rem'
          }}>
            Our pharmacy maintains transparent partnerships with leading pharmaceutical companies to enhance patient care while ensuring ethical advertising practices.
          </Typography>

          {/* Policy Overview */}
          <Card sx={{ mb: 6, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#002F6C'
              }}>
                Our Advertising Principles
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>1. Transparency:</strong> All sponsored content is clearly labeled as such
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>2. Scientific Accuracy:</strong> We verify all medical claims with evidence-based research
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>3. Patient-Centric:</strong> Promotions never override clinical appropriateness
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>4. Compliance:</strong> Strict adherence to FDA and local regulatory guidelines
              </Typography>
              
              <Typography variant="body1">
                <strong>5. Balance:</strong> We maintain diverse product offerings regardless of partnerships
              </Typography>
            </CardContent>
          </Card>

          {/* Partners Section */}
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            color: '#002F6C',
            textAlign: 'center'
          }}>
            Our Trusted Partners
          </Typography>

          <Grid container spacing={4}>
            {partners.map((partner, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      justifyContent: 'center'
                    }}>
                      <Avatar
                        src={partner.logo}
                        alt={partner.name}
                        sx={{
                          width: 120,
                          height: 60,
                          bgcolor: 'white',
                          padding: 1,
                        }}
                        variant="square"
                      />
                    </Box>
                    
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      textAlign: 'center'
                    }}>
                      {partner.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      <strong>Involvement:</strong> {partner.involvement}
                    </Typography>
                    
                    <Typography variant="body2">
                      <strong>Advertising Policy:</strong> {partner.policy}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Compliance Section */}
          <Box sx={{ 
            mt: 6,
            p: 4,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            borderLeft: '4px solid #016A70'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: '#002F6C'
            }}>
              Compliance & Ethics
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              All partnerships undergo rigorous review by our Pharmacy Advisory Board to ensure alignment with:
            </Typography>
            
            <ul style={{ paddingLeft: '24px' }}>
              <li><Typography variant="body1">FDA advertising guidelines</Typography></li>
              <li><Typography variant="body1">AMA ethical marketing standards</Typography></li>
              <li><Typography variant="body1">Our internal patient care philosophy</Typography></li>
            </ul>
            
            <Typography variant="body1" sx={{ mt: 2 }}>
              For partnership inquiries, please contact our compliance office at partnerships@yourpharmacy.com
            </Typography>
          </Box>
        </Container>
      </Box>
    <FooterSection/>
      
    </>
  );
};

export default adpolicy;