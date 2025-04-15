"use client";
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { FooterSection } from '../../sections/FooterSection';
import { fetchAllMedicines } from '../../../../../lib/saleMedicineDb';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';

const allmedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await fetchAllMedicines();
        setMedicines(data);
        setFilteredMedicines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.excipients && medicine.excipients.some(excipient => 
          excipient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ));
      setFilteredMedicines(filtered);
    }
  }, [searchTerm, medicines]);

  if (loading) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ 
          paddingTop: '170px', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#002F6C', mb: 3 }} />
        </Box>
        <FooterSection />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ paddingTop: '170px', textAlign: 'center', minHeight: '50vh' }}>
          <Typography variant="h5" color="error">Error: {error}</Typography>
        </Box>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Allnavbar />
      <Box sx={{ 
        paddingTop: '150px', 
        paddingBottom: 6, 
        backgroundColor: '#f9f9f9',
        minHeight: '80vh'
      }}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#002F6C', textAlign: 'center' }}>
            Available Medicines
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', maxWidth: "800px", mx: "auto", fontSize: '1.1rem' }}>
            Browse through our comprehensive collection of pharmaceutical products
          </Typography>

          {/* Search Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 4,
        
            px: 2
          }}>
            <TextField
              placeholder="Search Medicines..."
              variant="outlined"
              size="medium"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                maxWidth: "800px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#016A70" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {filteredMedicines.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 5,color:"#002F6C" }}>
              {searchTerm ? 'No medicines match your search.' : 'No medicines available at the moment.'}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredMedicines.map((medicine) => (
                <Grid item xs={12} sm={6} md={3} key={medicine.medicine_id}>
                  <Link href={`/userstore/userstorepages/allmedicines/${medicine.medicine_id}`} passHref style={{ textDecoration: 'none' }}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 1,
                      borderRadius: 1,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: 3
                      }
                    }}>
                      {medicine.image_url && (
                        <CardMedia
                          component="img"
                          height="10"
                          image={medicine.image_url}
                          alt={medicine.name}
                          sx={{ objectFit: 'contain', p: 1 }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#002F6C' }}>
                          {medicine.name}
                        </Typography>
                        {medicine.excipients && medicine.excipients.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {medicine.excipients.slice(0, 2).join(', ')}{medicine.excipients.length > 2 ? '...' : ''}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Rs. {medicine.price}
                          </Typography>
                          <Typography variant="body2">
                            Qty: {medicine.quantity}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <FooterSection />
    </>
  );
};

export default allmedicines;