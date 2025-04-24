"use client";
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  styled,
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DashboardIcon from "@mui/icons-material/Dashboard";

const SidebarButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

const Sidebar = ({
  handleSectionChange,
  activeTab,
  handleTabChange,  // This should receive the function
  activeSection,
}) => {
  const handleManufacturerClick = () => {
    handleTabChange(0);  // Should call the parent's function
    handleSectionChange("pendingManufacturers");
  };

  const handleMedicineClick = () => {
    handleTabChange(1);  // Should call the parent's function
    handleSectionChange("pendingMedicines");
  };

  const handleDashboardClick = () => {
    handleTabChange(0);  // Should call the parent's function
    handleSectionChange("dashboard");
  };


  return (
    <Box
      sx={{
        position: "fixed",
        top: 120,
        left: 0,
        width: "280px",
        height: "100%",
        bgcolor: "background.paper",
        zIndex: 1200,
        overflowY: "auto",
        boxShadow: 3,
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          PharmaGuard 24/7 Admin
        </Typography>
      </Box>

      <Divider />

      {/* Dashboard Link */}
      <List>
        <ListItem disablePadding>
          <SidebarButton
            onClick={handleDashboardClick}
            selected={activeTab === 0 && activeSection === "dashboard"}
          >
            <DashboardIcon sx={{ mr: 2, color: "primary.main" }} />
            <ListItemText primary="Dashboard" />
          </SidebarButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Manufacturers Section */}
      <List>
        <ListItem disablePadding>
          <SidebarButton
            onClick={handleManufacturerClick}
            selected={activeTab === 0}
          >
            <FactoryIcon sx={{ mr: 2, color: "primary.main" }} />
            <ListItemText primary="Manufacturers" />
          </SidebarButton>
        </ListItem>
      </List>

      {/* Medicines Section */}
      <List>
        <ListItem disablePadding>
          <SidebarButton
            onClick={handleMedicineClick}
            selected={activeTab === 1}
          >
            <MedicalServicesIcon sx={{ mr: 2, color: "primary.main" }} />
            <ListItemText primary="Medicines" />
          </SidebarButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;