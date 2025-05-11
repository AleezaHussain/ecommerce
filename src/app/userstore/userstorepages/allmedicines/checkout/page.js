"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAllMedicines, batchDecrementQuantities } from '../../../../../../lib/saleMedicineDb';
import { validateCartItems } from '../../../../../../lib/saleMedicineDb';
import axios from 'axios';

import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  useMediaQuery,
  useTheme,
  Radio, 
  RadioGroup, 
  FormControlLabel,
  TextField, 
  Checkbox, 
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import CheckIcon from '@mui/icons-material/Check';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useCart } from '../../../../../app/context/CartContext';
import { FooterSection } from '../../../sections/FooterSection';
import Allnavbar from '../../../sections/Allnavbar';
import NavBar from '../../../../components/NavBar';

// Custom styling for step icons
const CustomStepIcon = styled('div')(
  ({ theme, active, completed }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: completed 
      ? '#4CAF50' 
      : active 
        ? '#002F6C' 
        : '#e0e0e0',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
  }),
);

// Custom styling for step connector
const StepConnector = styled('div')(
  ({ theme, active }) => ({
    height: 2,
    backgroundColor: active ? '#002F6C' : '#e0e0e0',
    flex: 1,
    margin: '0 8px',
  }),
);

// Custom step icon component
function CustomIcon(props) {
  const { active, completed, icon } = props;

  return (
    <CustomStepIcon active={active} completed={completed}>
      {completed ? <CheckIcon fontSize="small" /> : icon}
    </CustomStepIcon>
  );
}

// Checkout Stepper Component
const CheckoutStepper = ({ activeStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      mb: { xs: 3, md: 2 },
      px: 2,
      maxWidth: '800px',
      mx: 'auto',
    }}>
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <CustomIcon 
              icon={index + 1} 
              active={index <= activeStep} 
              completed={index < activeStep} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1, 
                fontWeight: index <= activeStep ? 500 : 400,
                color: index <= activeStep ? '#002F6C' : 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            >
              {label}
            </Typography>
          </Box>
          
          {index < steps.length - 1 && (
            <StepConnector active={index < activeStep} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

// Shipping Form Component
const ShippingForm = ({ formData, onSubmit, orderTotal }) => {
  const [formState, setFormState] = useState({
    name: formData.name || '',
    email: formData.email || '',
    phone: formData.phone || '',
    address: formData.address || '',
    amount: orderTotal || ''  // Use orderTotal prop directly
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      amount: orderTotal || ''
    }));
  }, [orderTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
  
    if (!formState.name) newErrors.name = 'Full name is required';
    if (!formState.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Invalid email format';
    }
  
    if (!formState.phone) newErrors.phone = 'Phone number is required';
    else if (!/^0\d{10}$/.test(formState.phone)) {
      newErrors.phone = 'Phone number must start with 0 and be 11 digits (e.g., 03001234567)';
    }
  
    if (!formState.address) newErrors.address = 'Address is required';
  
    if (!formState.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formState.amount) || Number(formState.amount) <= 200) {
      newErrors.amount = 'Amount must be greater than 200 PKR';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      await onSubmit(formState);
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#002F6C', mb: 2 }}>
        Shipping Information
      </Typography>
      
      <form id="shipping-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Customer Name *"
              variant="outlined"
              fullWidth
              value={formState.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || "Enter your full name (first and last name)"}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email *"
              type="email"
              variant="outlined"
              fullWidth
              value={formState.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="phone"
              label="Phone Number *"
              variant="outlined"
              fullWidth
              value={formState.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || "Enter in international format (e.g., 03001234567)"}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address *"
              variant="outlined"
              fullWidth
              value={formState.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
          <TextField
  name="amount"
  label="Amount (PKR)"
  variant="outlined"
  fullWidth
  value={formState.amount}
  onChange={handleChange} // ✅ Make it editable
  error={!!errors.amount}
  helperText={errors.amount}
  InputLabelProps={{ shrink: true }}
  sx={{ mb: 2 }}
/>

          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: '#002F6C',
              '&:hover': { bgcolor: '#00224E' },
              minWidth: 150
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Continue to Payment'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

// Payment Method Selector Component (simplified for PayPro integration)
const PaymentMethodSelector = ({ selectedMethod, onSelect, disabled = false }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: disabled ? 'text.secondary' : '#002F6C', mb: 2 }}>
        Payment Method
      </Typography>
      
      {disabled && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Complete shipping information to proceed to payment
        </Typography>
      )}
      
      <RadioGroup
        value={selectedMethod}
        onChange={(e) => onSelect(e.target.value)}
      >
        <Box 
          sx={{ 
            mb: 2,
            border: '2px solid',
            borderColor: selectedMethod === 'paypro' ? '#002F6C' : 'transparent',
            bgcolor: selectedMethod === 'paypro' ? 'rgba(0, 47, 108, 0.05)' : 'transparent',
            borderRadius: 1,
            transition: 'all 0.2s'
          }}
        >
          <FormControlLabel
            value="paypro"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    bgcolor: 'rgba(25, 118, 210, 0.1)', 
                    p: 1, 
                    borderRadius: '50%', 
                    display: 'flex' 
                  }}
                >
                  <CreditCardIcon sx={{ color: '#1976d2' }} />
                </Box>
                <Typography variant="body1">Secure Online Payment (PayPro)</Typography>
              </Box>
            }
            sx={{ 
              py: 1.5, 
              px: 1, 
              width: '100%', 
              m: 0,
              '& .MuiFormControlLabel-label': { 
                width: '100%'
              }
            }}
          />
          <FormControlLabel
            value="cashOnDelivery"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    bgcolor: 'rgba(76, 175, 80, 0.1)', 
                    p: 1, 
                    borderRadius: '50%', 
                    display: 'flex' 
                  }}
                >
                  <PaymentsIcon sx={{ color: '#4caf50' }} />
                </Box>
                <Typography variant="body1">Cash on Delivery</Typography>
              </Box>
            }
            sx={{ 
              py: 1.5, 
              px: 1, 
              width: '100%', 
              m: 0,
              '& .MuiFormControlLabel-label': { 
                width: '100%'
              }
            }}
          />
        </Box>
      </RadioGroup>
      
      {selectedMethod === 'paypro' && (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You will be redirected to PayPro's secure payment page to complete your transaction.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PayPro supports all major credit/debit cards and mobile payment methods.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

// Order Summary Component
const OrderSummary = ({ 
  cartItems, 
  orderSummary,
  handleRemoveItem
}) => {
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  return (
    <Paper sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#002F6C', mb: 3 }}>
        Order Summary
      </Typography>
      
      {/* Cart Items */}
      <Box sx={{ mb: 3 }}>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Box
              key={item.medicine_id}
              sx={{
                display: 'flex',
                py: 2,
                borderBottom: '1px solid #eee',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '5px',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveItem(item.medicine_id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No items in cart</Typography>
        )}
      </Box>
      
      {/* Cost Breakdown */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">
            {formatCurrency(orderSummary.subtotal)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2">
            {formatCurrency(orderSummary.shipping)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Tax (5%)
          </Typography>
          <Typography variant="body2">
            {formatCurrency(orderSummary.tax)}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Total */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 2,
        mb: 1
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Total
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#002F6C' }}>
          {formatCurrency(orderSummary.total)}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
        Including VAT/GST
      </Typography>
    </Paper>
  );
};

// Main Checkout Component
const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    amount: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { 
    cart, 
    removeFromCart, 
    updateCart, 
    clearCart 
  } = useCart();
  
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 100,
    tax: 0,
    total: 0
  });

  const [initialLoad, setInitialLoad] = useState(true);
  const searchParams = useSearchParams();

  // Check payment status after redirection
  const checkPaymentStatus = async (orderNumber) => {
    if (!orderNumber) {
      alert("No order number found.");
      return;
    }

    try {
      const res = await fetch(`/api/payment/status?orderNumber=${orderNumber}`);
      if (res.redirected) {
        // Redirect handled by API
        window.location.href = res.url;
      } else {
        const data = await res.json();
        if (data.status === 'completed') {
          // Clear cart on successful payment
          clearCart();
          setActiveStep(3);
        } else {
          alert("Payment Status: " + data.status);
        }
      }
    } catch (error) {
      console.error("Status check failed:", error);
      alert("Error checking payment status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Auto-check on mount if we came back from PayPro
  useEffect(() => {
    const url = new URL(window.location.href);
    const cameBackFromPayment = url.searchParams.get("paypro");
    const orderNumber = localStorage.getItem('orderNumber');

    if (cameBackFromPayment && orderNumber) {
      setIsCheckingStatus(true);
      checkPaymentStatus(orderNumber);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setSessionExpired(true);
        return;
      }
  
      try {
        const res = await fetch('/api/validate-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          setSessionExpired(true);
        } else {
          // Set user email if logged in
          const user = JSON.parse(localStorage.getItem('user'));
          if (user?.email) {
            setShippingData(prev => ({
              ...prev,
              email: user.email
            }));
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        setSessionExpired(true);
      }
    };
  
    checkSession();
  }, []);

  // Load cart items from URL params
  useEffect(() => {
    const medicineIds = searchParams.getAll('medicineId');
    const quantities = searchParams.getAll('quantity').map(q => parseInt(q) || 1);
  
    const loadMedicines = async () => {
      try {
        const medicines = await fetchAllMedicines();
        const cartItems = medicineIds.map((medicineId, index) => {
          const foundMedicine = medicines.find(m => m.medicine_id === medicineId);
          if (!foundMedicine) {
            console.warn(`Medicine with id ${medicineId} not found`);
            return null;
          }
          return {
            ...foundMedicine,
            quantity: quantities[index] || 1,
          };
        }).filter(item => item !== null);
  
        updateCart(cartItems);
        setInitialLoad(false);
      } catch (error) {
        console.error("Error loading medicines:", error);
      }
    };
  
    if (medicineIds.length > 0) {
      loadMedicines();
    }
  }, [searchParams, updateCart]);

  // Calculate order summary
  useEffect(() => {
    let subtotal = 0;
    if (cart && cart.length > 0) {
      subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    const taxRate = 0.05; // 5% tax
    const tax = subtotal * taxRate;
    const total = subtotal + orderSummary.shipping + tax;
  
    setOrderSummary({
      ...orderSummary,
      subtotal,
      tax,
      total
    });
  
    // Update amount in shipping data
    setShippingData(prev => ({
      ...prev,
      amount: total.toFixed(2)  // Ensure 2 decimal places
    }));
  }, [cart, orderSummary.shipping]);
  
  useEffect(() => {
    if (cart.length === 0 && !initialLoad) {
      router.push('/userstore/userstorepages/allmedicines');
    }
  }, [cart, router, initialLoad]);

  const handleShippingSubmit = async (data) => {
    setShippingData(data);
    setActiveStep(2); // Move to payment step
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  // 👇 Move this UP first
  const handlePayProPayment = async () => {
    try {
      const orderNumber = 'PHARM-' + Math.floor(Math.random() * 1000000);
  
      const res = await axios.post('/api/payment/paypro', {
        ...shippingData,
        orderNumber,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
  
      const { paymentUrl, payProRawResponse } = res.data; // <- receive full PayPro response (backend must send)
  
      // Save order in database before redirecting
      await saveOrderToDatabase({
        paymentMethod: 'PayPro',
        shippingInfo: shippingData,
        items: cart,
        total: orderSummary.total,
        payProResponse: payProRawResponse
      });
  
      localStorage.setItem('orderNumber', orderNumber);
  
      window.location.href = paymentUrl;
    } catch (error) {
      alert('Error creating payment: ' + (error?.response?.data?.error || error.message));
    }
  };
  const saveOrderToDatabase = async ({ paymentMethod, shippingInfo, items, total, payProResponse = null }) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      await axios.post('/api/orders', {
        items,
        shippingInfo: payProResponse ? { ...shippingInfo, payProResponse } : shippingInfo,
        paymentMethod,
        total
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };
    
const handlePlaceOrder = async () => {
  if (!selectedPaymentMethod) {
    alert('Please select a payment method');
    return;
  }

  setIsPlacingOrder(true);

  try {
    if (selectedPaymentMethod === 'paypro') {
      await handlePayProPayment(); 
    } else if (selectedPaymentMethod === 'cashOnDelivery') {
      // Save order in database (COD)
      await saveOrderToDatabase({
        paymentMethod: 'Cash on Delivery',
        shippingInfo: shippingData,
        items: cart,
        total: orderSummary.total
      });

      clearCart();
      setActiveStep(3); 
    } else {
      alert('Invalid payment method');
    }
  } catch (error) {
    console.error('Order placement error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    setIsPlacingOrder(false);
  }
};
  
  const handleReturnToShop = () => {
    router.push('/userstore/userstorepages/allmedicines');
  };

  if (sessionExpired) {
    return (
      <Box sx={{ textAlign: 'center', mt: 25 }}>
        <NavBar/>
        <Typography variant="h4" sx={{ color: 'red', fontWeight: 'bold' }}>
          404 - Session Expired
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your session has expired. Please log in to continue.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, bgcolor: '#002F6C' }}
          onClick={() => {
            localStorage.setItem('redirectAfterLogin', '/userstore/userstorepages/allmedicines/cart');
            window.location.href = '/userlogin';
          }}
        >
          Go to Login
        </Button>
        <FooterSection/>
      </Box>
    );
  }
  
  if (isCheckingStatus) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Verifying your payment...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Allnavbar/>
      <Box sx={{ 
        paddingTop: '100px', 
        paddingBottom: 6, 
        backgroundColor: '#f9f9f9',
        minHeight: '80vh'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 4 ,mt:5}}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#002F6C' }}>
              Checkout
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mt: 1 }}>
              Complete your purchase to get your medications delivered to your doorstep
            </Typography>
          </Box>

          <CheckoutStepper activeStep={activeStep} />

          <Grid container spacing={4} sx={{ mt: 0}}>
            {/* Left column - Form */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                {activeStep === 1 && (
                  // In the Checkout component's render where ShippingForm is used
<ShippingForm 
  formData={shippingData} 
  onSubmit={handleShippingSubmit}
  orderTotal={orderSummary.total}  // Pass the calculated total
/>
                )}

{activeStep >= 2 && (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ color: '#002F6C', mb: 2 }}>
        Shipping Information
      </Typography>
      {/* Edit Button */}
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => setActiveStep(1)}
        sx={{
          ml: 2,
          borderColor: '#002F6C',
          color: '#002F6C',
          '&:hover': {
            borderColor: '#00224E',
            backgroundColor: 'rgba(0, 47, 108, 0.05)',
          }
        }}
      >
        Edit
      </Button>
    </Box>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body2">
          <strong>Name:</strong> {shippingData.name}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {shippingData.email}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {shippingData.phone}
        </Typography>
        <Typography variant="body2">
          <strong>Address:</strong> {shippingData.address}
        </Typography>
        <Typography variant="body2">
          <strong>Amount:</strong>{shippingData.amount}
        </Typography>
      </Grid>
    </Grid>
  </Box>
)}

                <Paper sx={{ 
                  p: 3, 
                  opacity: activeStep < 2 ? 0.5 : 1,
                  pointerEvents: activeStep < 2 ? 'none' : 'auto'
                }}>
                  <PaymentMethodSelector 
                    selectedMethod={selectedPaymentMethod} 
                    onSelect={handlePaymentMethodSelect}
                    disabled={activeStep < 2}
                  />

                  {activeStep === 2 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
  variant="contained" 
  sx={{ 
    bgcolor: '#002F6C', 
    '&:hover': { bgcolor: '#00224E' },
    px: 4,
    py: 1,
    minWidth: '200px',
    minHeight: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onClick={handlePlaceOrder}
  disabled={!selectedPaymentMethod || isPlacingOrder}
>
  {isPlacingOrder ? (
    <CircularProgress size={24} sx={{ color: 'white' }} />
  ) : (
    'Proceed to Payment'
  )}
</Button>

                    </Box>
                  )}
                </Paper>

                {activeStep === 3 && (
                  <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
                      Order Confirmed!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Thank you for your order. We have received your payment and will begin processing your order.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Your order reference: <strong>PHARM-{Date.now().toString().substring(6)}</strong>
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={handleReturnToShop}
                      sx={{ 
                        color: '#002F6C', 
                        borderColor: '#002F6C',
                        '&:hover': { borderColor: '#00224E', bgcolor: 'rgba(0, 47, 108, 0.05)' }
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Paper>
                )}
              </Paper>
            </Grid>

            {/* Right column - Order Summary */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: { lg: 'sticky' }, top: '150px' }}>
                <OrderSummary 
                  cartItems={cart} 
                  orderSummary={orderSummary}
                  handleRemoveItem={removeFromCart}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    
      <FooterSection/>
    </>
  );
};

export default Checkout;