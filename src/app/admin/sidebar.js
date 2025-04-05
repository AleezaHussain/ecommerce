"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import Image from "next/image";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FactoryIcon from "@mui/icons-material/Factory";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PersonIcon from "@mui/icons-material/Person";
import AnalyticsIcon from "@mui/icons-material/Analytics"; // Import Analytics icon

const Sidebar = ({ handleSectionChange, activeDashboard }) => {
  const [openManufacturers, setOpenManufacturers] = useState(false);
  const [openMedicines, setOpenMedicines] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);

  const handleManufacturersClick = () => {
    setOpenManufacturers(!openManufacturers);
  };

  const handleMedicinesClick = () => {
    setOpenMedicines(!openMedicines);
  };

  const handleUsersClick = () => {
    setOpenUsers(!openUsers);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "60px",
        left: 0,
        width: "220px",
        height: "calc(100vh - 60px)",
        bgcolor: "#EEF2F6",
        zIndex: 1400,
        overflowY: "auto",
      }}
    >
      {/* Sidebar Content */}
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
          color: "#016A70",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
        MediCare Admin
      </Typography>

      <List>
        {/* Manufacturers Dropdown */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleManufacturersClick}
            sx={{
              "&:hover": {
                bgcolor: "#B2EBF2",
                borderRadius: "8px",
              },
            }}
          >
            <FactoryIcon sx={{ mr: 2, color: "#016A70" }} />
            <ListItemText primary="Manufacturers" />
            {openManufacturers ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {/* Nested Dropdown for Manufacturers */}
        <Collapse in={openManufacturers} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("acceptedManufacturers")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 2, color: "#2E7D32" }} />
                <ListItemText primary="Accepted" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("pendingManufacturers")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <PendingIcon sx={{ mr: 2, color: "#EF6C00" }} />
                <ListItemText primary="Pending" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("rejectedManufacturers")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <CancelIcon sx={{ mr: 2, color: "#D32F2F" }} />
                <ListItemText primary="Rejected" />
              </ListItemButton>
            </ListItem>
            {/* Analytics for Manufacturers */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("manufacturerAnalytics")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <AnalyticsIcon sx={{ mr: 2, color: "#016A70" }} />
                <ListItemText primary="Analytics" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Medicines Dropdown */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleMedicinesClick}
            sx={{
              "&:hover": {
                bgcolor: "#B2EBF2",
                borderRadius: "8px",
              },
            }}
          >
            <MedicalServicesIcon sx={{ mr: 2, color: "#016A70" }} />
            <ListItemText primary="Medicines" />
            {openMedicines ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {/* Nested Dropdown for Medicines */}
        <Collapse in={openMedicines} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("acceptedMedicines")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 2, color: "#2E7D32" }} />
                <ListItemText primary="Accepted" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("pendingMedicines")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <PendingIcon sx={{ mr: 2, color: "#EF6C00" }} />
                <ListItemText primary="Pending" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("rejectedMedicines")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <CancelIcon sx={{ mr: 2, color: "#D32F2F" }} />
                <ListItemText primary="Rejected" />
              </ListItemButton>
            </ListItem>
            {/* Analytics for Medicines */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("medicineAnalytics")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <AnalyticsIcon sx={{ mr: 2, color: "#016A70" }} />
                <ListItemText primary="Analytics" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Users Dropdown */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleUsersClick}
            sx={{
              "&:hover": {
                bgcolor: "#B2EBF2",
                borderRadius: "8px",
              },
            }}
          >
            <PeopleIcon sx={{ mr: 2, color: "#016A70" }} />
            <ListItemText primary="Users" />
            {openUsers ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {/* Nested Dropdown for Users */}
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("qrCodes")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <QrCodeIcon sx={{ mr: 2, color: "#016A70" }} />
                <ListItemText primary="QR Codes" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionChange("userProfiles")}
                sx={{
                  "&:hover": {
                    bgcolor: "#B2EBF2",
                    borderRadius: "8px",
                  },
                }}
              >
                <PersonIcon sx={{ mr: 2, color: "#016A70" }} />
                <ListItemText primary="User Profiles" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;