"use client";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import ManufacturerPage from "./manufacturer/page";
import MedicinePage from "./medicine/page";
import Button from "@mui/material/Button";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("pendingManufacturers");
  const [activeDashboard, setActiveDashboard] = useState(null);

  const handleSectionChange = (section) => {
    console.log("Switching to section:", section);
    setActiveSection(section);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <Sidebar handleSectionChange={handleSectionChange} activeDashboard={activeDashboard} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, marginLeft: "240px", width: "100%" }}>
        {/* Render buttons only if no dashboard is selected */}
        {!activeDashboard && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              onClick={() => setActiveDashboard("manufacturers")}
              sx={{ fontSize: "1.2rem", padding: "10px 20px" }}
            >
              Manufacturers
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveDashboard("medicines")}
              sx={{ fontSize: "1.2rem", padding: "10px 20px" }}
            >
              Medicines
            </Button>
          </Box>
        )}

        {/* Render the appropriate dashboard based on activeDashboard state */}
        {activeDashboard === "manufacturers" && (
          <ManufacturerPage activeSection={activeSection} handleSectionChange={handleSectionChange} />
        )}
        {activeDashboard === "medicines" && (
          <MedicinePage activeSection={activeSection} handleSectionChange={handleSectionChange} />
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;