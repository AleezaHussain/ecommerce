// app/userstore/userstorepages/allmedicines/cart/page.js
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { 
  Box, Typography, Container, Card, CardContent, CardMedia, 
  CircularProgress, Button, Grid, Divider, Chip 
} from '@mui/material';
import Allnavbar from '../../../sections/Allnavbar';
import { FooterSection } from '../../../sections/FooterSection';
import { fetchAllMedicines } from '../../../../../../lib/saleMedicineDb';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../../../../app/context/CartContext.js';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { loadGuestCart } = useCart();



  const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  if (error) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ paddingTop: '170px', textAlign: 'center', minHeight: '50vh' }}>
          <Typography variant="h5" color="error">
            {error}
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
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#002F6C' }}>
            Your Cart
          </Typography>

          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Your cart is empty
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/userstore/userstorepages/allmedicines')}
                sx={{
                  backgroundColor: '#002F6C',
                  '&:hover': { bgcolor: '#00224E' },
              py: 1.5
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {cart.map((item) => (
                  <Card key={item.medicine_id} sx={{ mb: 3, boxShadow: 2 }}>
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        {item.image_url && (
                          <CardMedia
                            component="img"
                            sx={{ 
                              objectFit: 'contain',
                              p: 1.5,
                              width: '100%',
                              height: 200,
                            }}
                            image={item.image_url}
                            alt={item.name}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {item.name}
                          </Typography>
                          
                          {item.types && (
                            <Box sx={{ mb: 1 }}>
                              {item.types.map((type, index) => (
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
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Quantity: {item.quantity}</Typography>
                            <Typography>Price: {formatCurrency(item.price)}</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Total: {formatCurrency(item.price * item.quantity)}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => removeFromCart(item.medicine_id)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, boxShadow: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#002F6C' }}>
                    Order Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal:</Typography>
                      <Typography>{formatCurrency(calculateTotal())}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Shipping:</Typography>
                      <Typography>{formatCurrency(100)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Tax (5%):</Typography>
                      <Typography>{formatCurrency(calculateTotal() * 0.05)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Total:
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(calculateTotal() * 1.05 + 100)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
  variant="contained"
  fullWidth
  onClick={async () => {
    setCheckoutLoading(true); // Start loading
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional: slight delay for smoother UX
      router.push('/userstore/userstorepages/allmedicines/checkout');
    } catch (error) {
      console.error('Navigation error:', error);
      setCheckoutLoading(false); // Stop loading if error
    }
  }}
  disabled={checkoutLoading}
  sx={{
    backgroundColor: '#002F6C',
    '&:hover': { bgcolor: '#00224E' },
    py: 1.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '48px' // Ensures button height is stable when spinner appears
  }}
>
  {checkoutLoading ? (
    <CircularProgress size={24} sx={{ color: 'white' }} />
  ) : (
    'Proceed to Checkout'
  )}
</Button>

                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <FooterSection />
    </>
  );
}