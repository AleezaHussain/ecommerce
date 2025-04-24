"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Container, Card, CardContent, CardMedia,
  CircularProgress, Button, IconButton, Grid, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Allnavbar from '../../../sections/Allnavbar';
import { FooterSection } from '../../../sections/FooterSection';
import { fetchAllMedicines } from '../../../../../../lib/saleMedicineDb';
import { useCart } from '../../../../context/CartContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2
};

export default function MedicineDetails() {
  const router = useRouter();
  const params = useParams();
  const medicineId = params.medicineId;
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      medicine_id: medicine.medicine_id,
      name: medicine.name,
      price: medicine.price,
      image_url: medicine.image_url,
      quantity,
      types: medicine.types || []
    });
    router.push(`/userstore/userstorepages/allmedicines/cart`);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const loadMedicine = async () => {
      try {
        const medicines = await fetchAllMedicines();
        const found = medicines.find(m => m.medicine_id === medicineId);
        if (!found) throw new Error('Medicine not found');
        setMedicine(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMedicine();
  }, [medicineId]);

  const handleIncrement = () => {
    if (quantity < medicine.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ paddingTop: '170px', textAlign: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#002F6C', mb: 3 }} />
        </Box>
        <FooterSection />
      </>
    );
  }

  if (error || !medicine) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ paddingTop: '170px', textAlign: 'center', minHeight: '50vh' }}>
          <Typography variant="h5" color="error">
            {error || 'Medicine not found'}
          </Typography>
        </Box>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Allnavbar />
      <Box sx={{ paddingTop: '170px', paddingBottom: 6, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Card sx={{ boxShadow: 2 }}>
            <Grid container>
              <Grid item xs={12} md={4}>
                {medicine.image_url && (
                  <CardMedia
                    component="img"
                    sx={{ 
                      objectFit: 'contain', 
                      p: 1.5,
                      width: '100%',
                      height: 280,
                      maxHeight: 280
                    }}
                    image={medicine.image_url}
                    alt={medicine.name}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={8}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#002F6C', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                    {medicine.name}
                  </Typography>

                  {medicine.types && medicine.types.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {medicine.types.map((type, index) => (
                        <Chip 
                          key={index}
                          label={type}
                          size="small"
                          sx={{ 
                            mr: 1,
                            mb: 1,
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 'bold'
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}>Product Details</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Batch:</strong> {medicine.batch_number}
                    </Typography>
                    {medicine.manufacture_date && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Manufactured:</strong> {new Date(medicine.manufacture_date).toLocaleDateString()}
                      </Typography>
                    )}
                    {medicine.description && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Description:</strong> {medicine.description}
                      </Typography>
                    )}
                    {medicine.excipients && medicine.excipients.length > 0 && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Excipients:</strong> {medicine.excipients.join(', ')}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1,
                    backgroundColor: medicine.quantity > 0 ? '#e8f5e9' : '#ffebee',
                    borderRadius: 1,
                    border: `1px solid ${medicine.quantity > 0 ? '#e8f5e9' : '#ffcdd2'}`
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 'bold',
                      color: medicine.quantity > 0 ? '#002F6C' : '#d32f2f',
                      ml: 1
                    }}>
                      {medicine.quantity > 0 ? `🔵  ${medicine.quantity} units available in stock` : '🔴 Currently out of stock'}
                    </Typography>
                  </Box>

                  {medicine.quantity > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold', fontSize: '0.95rem' }}>
                        Qty:
                      </Typography>
                      <IconButton 
                        onClick={handleDecrement} 
                        disabled={quantity <= 1}
                        size="small"
                        sx={{ border: '1px solid #002F6C' }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 1.5, minWidth: 24, textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton 
                        onClick={handleIncrement} 
                        disabled={quantity >= medicine.quantity}
                        size="small"
                        sx={{ border: '1px solid #002F6C' }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 1.5, 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: 1,
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#002F6C' }}>
                      Rs. {(medicine.price * quantity).toFixed(2)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="medium"
                      onClick={handleAddToCart}
                      disabled={medicine.quantity <= 0}
                      sx={{ 
                        backgroundColor: '#002F6C',
                        '&:hover': { bgcolor: '#00224E' },
              py: 1.5
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
      <FooterSection />
    </>
  );
}
