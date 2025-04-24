"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import NavBar from "../components/NavBar";
import Sidebar from "./sidebar";
import ManufacturerPage from "./manufacturer/page";
import MedicinePage from "./medicine/page";
 
const AdminPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("pendingManufacturers");
  const [adminDetails, setAdminDetails] = useState({ name: "", email: "", role: "" });

  // app/admin/page.js
useEffect(() => {
  const fetchAdminDetails = async () => {
    const adminEmail = localStorage.getItem("adminEmail");
    if (!adminEmail) return;

    try {
      const res = await fetch(`/api/auth/admin?email=${adminEmail}`);
      if (!res.ok) throw new Error("Failed to fetch admin details");
      const data = await res.json();
      
      setAdminDetails({
        name: "Admin", // Hardcoded since we don't have name in DB
        email: data.email || adminEmail, // Use email from response or fallback
        role: data.role || "Administrator",
      });
    } catch (error) {
      console.error("Error fetching admin details:", error);
      // Fallback to just the email
      setAdminDetails({
        name: "Admin",
        email: adminEmail,
        role: "Administrator"
      });
    }
  };

  fetchAdminDetails();
}, []);

  const handleTabChange = (index) => {
    setTabIndex(index);
    setActiveSection(index === 0 ? "pendingManufacturers" : "pendingMedicines");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    window.location.href = "/";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <NavBar adminDetails={adminDetails} onLogout={handleLogout} />
      <Box sx={{ display: "flex", marginTop: "90px" }}>
        <Sidebar
          handleSectionChange={setActiveSection}
          activeTab={tabIndex}
          handleTabChange={handleTabChange}
          activeSection={activeSection}
        />
        <Box
          sx={{
            flexGrow: 1,
            paddingLeft: { xs: 0, md: "280px" },
            paddingRight: 3,
            marginLeft: 3,
            paddingTop: 3,
            width: "100%",
          }}
        >
          <Divider sx={{ my: 2 }} />
          {tabIndex === 0 && (
            <ManufacturerPage
              activeSection={activeSection}
              handleSectionChange={setActiveSection}
            />
          )}
          {tabIndex === 1 && (
            <MedicinePage
              activeSection={activeSection}
              handleSectionChange={setActiveSection}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
