"use client";

import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Menu, MenuItem, Fade, Avatar, Divider } from "@mui/material";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import { usePathname, useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FactoryIcon from "@mui/icons-material/Factory";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Loading from "./loading";

const NavBar = ({ loginButton, walletStatus, manufacturerDetails, adminDetails, onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/";
  const isManufacturerReg = pathname === "/manufacturer";
  const isManufacturerLogin = pathname === "/manufacturerlogin";
  const isLoginPage = ["/manufacturerlogin", "/userlogin", "/adminlogin"].includes(pathname);
  const isManufacturerDashboard = pathname?.startsWith("/manufacturerdashboard");
  const isAdminDashboard = pathname?.startsWith("/admin");
  const isProfilePage = pathname === "/manufacturerdashboard/manufacturerprofile";
  const [loginAnchorEl, setLoginAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const openLoginMenu = Boolean(loginAnchorEl);
  const openProfileMenu = Boolean(profileAnchorEl);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = (event) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleLoginClose = () => {
    setLoginAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const navigateTo = (path) => {
    setIsNavigating(true);
    handleLoginClose();
    setTimeout(() => {
      router.push(path);
      window.scrollTo(0, 0);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    setTimeout(() => {
      router.push("/adminlogin");
    }, 1500);
  };
  
  if (isLoggingOut) {
    return <Loading/>;
  }
  
  if (isNavigating) {
    return <Loading />;
  }

  // Login options data
  const loginOptions = [
    {
      path: "/manufacturerlogin",
      icon: <FactoryIcon sx={{ fontSize: 28, color: "#1d4e89" }} />,
      title: "Manufacturer",
      subtitle: "Production dashboard"
    },
    {
      path: "/userlogin",
      icon: <AccountCircleIcon sx={{ fontSize: 28, color: "#1d4e89" }} />,
      title: "User",
      subtitle: "Customer portal"
    },
    {
      path: "/adminlogin",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 28, color: "#1d4e89" }} />,
      title: "Admin",
      subtitle: "System controls"
    }
  ];

  return (
    <>
      {/* Enhanced Red Top Banner */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#1d4e89",
          color: "white",
          padding: "8px 0",
          position: "fixed",
          top: 0,
          zIndex: 1600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left side - Company Slogan */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalHospitalIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Your Trusted 24/7 Pharmaceutical Partner
          </Typography>
        </Box>

        {/* Right side - Contact Info */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="caption">0317-1719452</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon fontSize="small" />
            <Typography variant="caption">info@pharmaguard.com</Typography>
          </Box>
        </Box>

        {/* Mobile version - Single contact item */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
          <PhoneIcon fontSize="small" />
          <Typography variant="caption">0317-1719452</Typography>
        </Box>
      </Box>

      {/* Main blue navbar */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#0F1A3A ",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 35,
          zIndex: 1500,
          height: "80px",
          color: "white",
        }}
      >
        {/* Left side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center",
              cursor: "pointer",
              marginTop: "78px",
              marginLeft:-7,
            }}
            onClick={() => navigateTo("/")}
          >
            <Image 
              src="/logoc.png" 
              alt="Company Logo" 
              width={360} 
              height={150} 
              priority 
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>

        {/* Right side - Dynamic Buttons */}
        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          alignItems: "center",
          position: "relative",
          right: 0
        }}>
          {/* Show profile and logout when admin is logged in */}
          {adminDetails && isAdminDashboard && (
            <>
              <IconButton
                onClick={handleProfileClick}
                sx={{ 
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  },
                  marginLeft: 'auto'
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: "#1976d2"
                  }}
                >
                  {adminDetails?.name?.charAt(0) || <PersonIcon />}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={profileAnchorEl}
                open={openProfileMenu}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    width: 320,
                    maxWidth: '100%',
                    borderRadius: '12px',
                    mt: 1.5,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "#1976d2", fontSize: '1.5rem' }}>
                      A
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Admin
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {adminDetails?.email || "No email"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <MenuItem 
                  onClick={handleLogout}
                  sx={{ py: 1.5 }}
                >
                  <LogoutIcon sx={{ mr: 2, color: 'action.active' }} />
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Show profile and logout when manufacturer is logged in */}
          {(walletStatus?.approved && isManufacturerDashboard) && (
            <>
              <IconButton
                onClick={handleProfileClick}
                sx={{ 
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  },
                  marginLeft: 'auto'
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: "#1976d2"
                  }}
                >
                  {manufacturerDetails?.name?.charAt(0) || <PersonIcon />}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={profileAnchorEl}
                open={openProfileMenu}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    width: 320,
                    maxWidth: '100%',
                    borderRadius: '12px',
                    mt: 1.5,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: "#1976d2",
                        fontSize: '1.5rem'
                      }}
                    >
                      {manufacturerDetails?.name?.charAt(0) || <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {manufacturerDetails?.name || "Manufacturer"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {walletStatus?.address?.slice(0, 6)}...{walletStatus?.address?.slice(-4)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {isProfilePage ? (
                  <MenuItem 
                    onClick={() => {
                      router.push('/manufacturerdashboard');
                      handleProfileClose();
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <DashboardIcon sx={{ mr: 2, color: 'action.active' }} />
                    <Typography variant="body1">Dashboard</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem 
                    onClick={() => {
                      router.push('/manufacturerdashboard/manufacturerprofile');
                      handleProfileClose();
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <PersonIcon sx={{ mr: 2, color: 'action.active' }} />
                    <Typography variant="body1">Profile Details</Typography>
                  </MenuItem>
                )}

                <MenuItem 
                  onClick={() => {
                    setIsLoggingOut(true);
                    handleProfileClose();
                    localStorage.removeItem("manufacturer");
                    localStorage.removeItem("token");
                    setTimeout(() => {
                      router.push("/manufacturerlogin");
                    }, 1500);
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, color: 'action.active' }} />
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Manufacturer Register/Login Toggle */}
          {(isManufacturerReg && !walletStatus?.approved) && (
            <Button
              variant="contained"
              onClick={() => navigateTo("/manufacturerlogin")}
              sx={{ 
                backgroundColor: "#0066cc", 
                color: "#fff", 
                "&:hover": { 
                  backgroundColor: "#005bb5",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                },
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "6px",
                textTransform: "none",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                minWidth: "140px",
                height: "40px"
              }}
            >
              Login
            </Button>
          )}

          {/* Login Options Button (shown on landing page and all login pages) */}
          {(isLandingPage || isLoginPage || isManufacturerReg) && !walletStatus?.approved && !adminDetails && (
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block'
              }}
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={() => setIsHoveringLogin(false)}
            >
              <Button
                variant="contained"
                startIcon={<AccountCircleIcon />}
                sx={{ 
                  backgroundColor: "#004b8d", 
                  color: "#fff", 
                  "&:hover": { 
                    backgroundColor: "#003366",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                  },
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "6px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  minWidth: "140px",
                  height: "40px"
                }}
                aria-label="Login options"
                aria-controls="login-menu"
                aria-haspopup="true"
              >
                Login User
              </Button>

              {/* Hover-based login options panel */}
              {isHoveringLogin && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: 1,
                    width: '300px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    zIndex: 1,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.3s ease-out',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(-10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} color="#212529">
                      Select Login Type
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', p: 2 }}>
                    {loginOptions.map((option, index) => (
                      <Box 
                        key={index}
                        onClick={() => navigateTo(option.path)}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f1f3f5',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#e9f5ff',
                          borderRadius: '50%',
                          mb: 1
                        }}>
                          {option.icon}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600} color="#212529">
                          {option.title}
                        </Typography>
                        <Typography variant="caption" color="#6c757d" textAlign="center">
                          {option.subtitle}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Fallback Menu for mobile */}
        <Menu
          id="login-menu"
          anchorEl={loginAnchorEl}
          open={openLoginMenu}
          onClose={handleLoginClose}
          MenuListProps={{
            'aria-labelledby': 'login-button',
          }}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: "12px",
              minWidth: "280px",
              overflow: "visible",
              mt: 1.5,
              '&:before': {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              }
            }
          }}
        >
          {loginOptions.map((option, index) => (
            <MenuItem 
              key={index}
              onClick={() => navigateTo(option.path)}
              sx={{
                py: 2,
                px: 3,
                "&:hover": { bgcolor: "rgba(0, 102, 204, 0.08)" },
                transition: "background-color 0.2s ease"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {option.icon}
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>{option.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{option.subtitle}</Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default NavBar;