// app/userstore/sections/Allnavbar.js
"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import {
  Box,
  IconButton,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemAvatar,
  Avatar,
  Divider
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "../../../app/context/CartContext.js";

const Allnavbar = () => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const { cart, cartCount, totalPrice, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isUserStorePage = pathname === "/userstore";
  const { uniqueItemsCount } = useCart(); // More explicit

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  const categories = [
    { name: "Injection" },
    { name: "Antibiotic" },
    { name: "Syrup" },
    { name: "Capsule" },
  ];

  const getLink = (section) => {
    if (pathname === "/userstore") {
      return `#${section}`;
    }
    return `/userstore/userstorepages/${section}`;
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };


  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: Call logout API if you have one
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Redirect to login page
      router.push('/userlogin');
      window.location.reload(); // Force a refresh to clear any state
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/userlogin');
    }
  };


  // In Allnavbar.js
const CartSideMenu = () => (
  <Drawer
    anchor="right"
    open={isCartOpen}
    onClose={handleCloseCart}
    sx={{
      '& .MuiDrawer-paper': {
        width: { xs: '100%', sm: 500 },
        height: "80%",
        padding: 3,
        mt: 14,
        backgroundColor: 'background.paper',
      },
    }}
    BackdropProps={{
      sx: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Your Cart ({cartCount})</Typography>
      <IconButton onClick={handleCloseCart}>
        <CloseIcon />
      </IconButton>
    </Box>

    <Divider sx={{ mb: 2 }} />

    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
      {cart.length > 0 ? (
        cart.map((item) => (
          <ListItem key={item.medicine_id} sx={{ py: 2 }}>
            <ListItemAvatar>
              <Avatar 
                src={item.image_url} 
                alt={item.name}
                variant="square"
                sx={{ width: 60, height: 60, mr: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`Qty: ${item.quantity} | Price: Rs. ${item.price}`}
              sx={{ mr: 2 }}
            />
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Rs. {(item.price * item.quantity).toFixed(2)}
            </Typography>
            <IconButton 
              edge="end" 
              onClick={() => removeFromCart(item.medicine_id)}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="Your cart is empty" />
        </ListItem>
      )}
    </List>

    {cart.length > 0 && (
      <>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">Subtotal:</Typography>
          <Typography variant="subtitle1">Rs. {totalPrice.toFixed(2)}</Typography>
        </Box>
      </>
    )}

    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        size="large"
        onClick={() => {
          handleCloseCart();
          router.push('/userstore/userstorepages/allmedicines');
        }}
        sx={{ mt: 2 }}
      >
        Add More Items
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={() => {
          handleCloseCart();
          router.push(cart.length > 0 
            ? '/userstore/userstorepages/allmedicines/checkout' 
            : '/userstore/userstorepages/allmedicines');
        }}
        sx={{ mt: 2 }}
      >
        {cart.length > 0 ? 'Proceed to Checkout' : 'Continue Shopping'}
      </Button>
    </Box>
  </Drawer>
);

  return (
    <>
      {/* Top red banner */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#D32F2F",
          color: "white",
          textAlign: "center",
          padding: "8px 0",
          fontSize: "14px",
          fontWeight: "bold",
          position: "fixed",
          top: 0,
          zIndex: 1600,
        }}
      >
        We are currently experiencing technical difficulties with our call center. For assistance,
        please contact us via WhatsApp at 0317-1719452.
      </Box>

      {/* Main blue navbar */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#002F6C",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: "32px",
          zIndex: 1500,
          height: "80px",
          color: "white",
        }}
      >
        {/* Left side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MuiLink
            component={Link}
            href="/userstore"
            sx={{ 
              textDecoration: 'none',
              display: 'inline-block',
              mt: 9
            }}
          >
            <Image 
              src="/logob.png" 
              alt="Logo" 
              width={180} 
              height={200} 
              style={{ objectFit: 'contain' }}
            />
          </MuiLink>
        </Box>

<Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
  {user ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <MuiLink
        component={Link}
        href="/userstore/userstorepages/dashboard"
        color="inherit"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        <PersonIcon fontSize="small" />
        <Typography component="span">
          My Account
        </Typography>
      </MuiLink>
      <Button 
  variant="text" 
  color="inherit"
  onClick={handleLogout}
  sx={{
    textTransform: 'none',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
  }}
>
  Logout
</Button>
    </Box>
  ) : (
    <MuiLink
      component={Link}
      href="/userlogin"
      color="inherit"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' }
      }}
    >
      <PersonIcon fontSize="small" />
      <Typography component="span">
        Sign In / Sign Up
      </Typography>
    </MuiLink>
  )}
  
  <IconButton color="inherit" onClick={handleCartClick}>
    <Badge badgeContent={uniqueItemsCount} color="error">
      <ShoppingCartIcon />
    </Badge>
  </IconButton>
</Box>
      </Box>

<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    py: 2,
    bgcolor: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 110,
    zIndex:1000, // Lower z-index when cart is open
    height: "45px",
  }}
>
        {categories.map((category, index) => (
          <MuiLink
            key={index}
            component={Link}
            href={`/userstore/userstorepages/${category.name}`}
            color="#002F6C"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {category.name}
          </MuiLink>
        ))}

        <MuiLink
          component={Link}
          href="/userstore/userstorepages/insights"
          color="#002F6C"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Medicine Insights
        </MuiLink>

        {isUserStorePage ? (
          <>
            <MuiLink 
              component={Link} 
              href="/userstore/userstorepages/famous"
              color="#002F6C"
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Famous medicine
            </MuiLink>
            <MuiLink 
              component={Link} 
              href={getLink("sale")}
              color="#002F6C"
              sx={{
                fontWeight: "bold",
                fontSize: "16px",
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sale
            </MuiLink>
          </>
        ) : (
          <MuiLink 
            component={Link}
            href={"/userstore/userstorepages/famous"}
            color="#002F6C"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Famous medicine
          </MuiLink>
        )}
      </Box>

      <CartSideMenu />
    </>
  );
};

export default Allnavbar;