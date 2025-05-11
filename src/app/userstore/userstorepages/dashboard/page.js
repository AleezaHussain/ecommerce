"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import Allnavbar from '../../sections/Allnavbar';
import { FooterSection } from '../../sections/FooterSection';
import { fetchAllMedicines } from '../../../../../lib/saleMedicineDb';
import { useCart } from '../../../../app/context/CartContext';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/userlogin');
          return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
  
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found. Cannot fetch orders.');
          setLoadingOrders(false);
          return;
        }
  
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          console.warn('Failed to fetch orders, status:', response.status);
          setOrders([]); // ❗ Empty orders on failure
        } else {
          const data = await response.json();
          setOrders(data.orders || []); // Ensure it's always an array
        }
  
      } catch (error) {
        console.warn('Error fetching user or orders:', error.message);
        setOrders([]); // ❗ Set empty on any error
      } finally {
        setLoading(false);  // Finish loading both user and orders
        setLoadingOrders(false);
      }
    };
  
    fetchUserDataAndOrders();
  }, [router]);
  

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/userlogin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUserOrders(JSON.parse(userData).id);
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.warn('No authentication token found. Skipping orders fetch.');
        setOrders([]);  // Empty orders
        return;         // Exit normally, without throwing
      }
  
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        console.warn(`Failed to fetch orders, status: ${response.status}`);
        setOrders([]);  // Empty orders
        return;
      }
  
      const data = await response.json();
  
      if (data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn('Unexpected orders data format');
        setOrders([]);
      }
  
    } catch (error) {
      console.warn('Error fetching orders:', {
        message: error?.message,
        timestamp: new Date().toISOString()
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Allnavbar />
        <Box sx={{ paddingTop: '170px', textAlign: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#002F6C', mb: 3 }} />
          <Typography variant="h6">Loading your dashboard...</Typography>
        </Box>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Allnavbar />
      <Box sx={{ paddingTop: '170px', paddingBottom: 6, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#002F6C' }}>
            Welcome, {user?.username || 'User'}!
          </Typography>

          <Grid container spacing={3}>
            {/* User Profile Section */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#002F6C' }}>
                  Your Profile
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Member since:</strong> {formatDate(user?.created_at)}
                </Typography>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => router.push('/userstore/userstorepages/allmedicines')}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </Grid>

            {/* Recent Orders Section */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#002F6C' }}>
                  Your Recent Orders
                </Typography>

                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Box key={order.id} sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">
                          <strong>Order #:</strong> {order.id}
                        </Typography>
                        <Typography variant="subtitle1">
  <strong>Date:</strong> {formatDate(order.created_at)}
</Typography>
<Typography variant="subtitle1">
  <strong>Total:</strong> {formatCurrency(
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )}
</Typography>


                        <Typography variant="subtitle1">
                          <strong>Status:</strong> {order.status}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                        Items:
                      </Typography>
                      {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            {item.name} × {item.quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'normal' }}>
                        Rs.  
                          {item.price}
                          </Typography>

                        </Box>
                      ))}

                      
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                    You haven't placed any orders yet.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <FooterSection />
    </>
  );
}