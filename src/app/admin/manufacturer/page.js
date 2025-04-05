"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import axios from "axios";
import ManufacturerSlideshow from "./ManufacturerSlideshow";
import ChartsSection from "./ChartsSection";
import { getPendingManufacturers, getApprovedManufacturers, getRejectedManufacturers } from "../../testingblockchain/accepted-rejected-manufacturer/fetch"; // Import blockchain functions
import {updateManufacturerStatus}  from '../../testingblockchain/pendingmanufacture/fetch';
import { SuccessMsgBox, ErrorMsgBox } from "../../components/MsgBox"; // Import alert components
import "../admin.css";



const ManufacturerPage = ({ activeSection, handleSectionChange }) => {
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pendingManufacturers, setPendingManufacturers] = useState([]);
  const [acceptedManufacturers, setAcceptedManufacturers] = useState([]);
  const [rejectedManufacturers, setRejectedManufacturers] = useState([]);
  const [authenticityScore, setAuthenticityScore] = useState(null); // Define authenticityScore state
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [successAlert, setSuccessAlert] = useState({ open: false, message: "" });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  
 useEffect(() => {
    const fetchAdminData = async () => {
      const adminEmail = localStorage.getItem("adminEmail");
      if (adminEmail) {
        const data = await getAdminDetails(adminEmail);
        if (data) {
          setAdminDetails({
            name: data.name || "Admin User",
            email: data.email || "N/A",
            role: data.role || "Administrator",
          });
        }
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        // Fetch manufacturers from the blockchain
        const pending = await getPendingManufacturers();
        const approved = await getApprovedManufacturers();
        const rejected = await getRejectedManufacturers();

        setPendingManufacturers(pending);
        setAcceptedManufacturers(approved);
        setRejectedManufacturers(rejected);
      } catch (error) {
        console.error("Error loading manufacturers:", error);
        setErrorAlert({ open: true, message: "Failed to load manufacturers." });
      }
    };

    loadManufacturers();
  }, []);

  const handleView = async (id) => {
    // Fetch details of the selected manufacturer from the blockchain
    const selected = pendingManufacturers.find((m) => m.tokenId === id);
    if (selected) {
      setSelectedManufacturer(selected);

      if (selected.website) {
        checkWebsiteAuthenticity(selected.website);
      } else {
        setAuthenticityScore(0);
      }
    }
  };

  const handleAcceptClick = async (tokenId) => {
    try {
      // Call blockchain function to update status
      const success = await updateManufacturerStatus(tokenId, "Approved");
      
      if (success) {
        // Refresh the data
        const pending = await getPendingManufacturers();
        const approved = await getApprovedManufacturers();
        
        // Update state
        setPendingManufacturers(pending);
        setAcceptedManufacturers(approved);
        setSuccessAlert({ open: true, message: "Manufacturer approved successfully!" });
      }
    } catch (error) {
      console.error("Error accepting manufacturer:", error);
      setErrorAlert({ open: true, message: "Failed to approve manufacturer." });
    }
  };
  
  const handleReject = async (tokenId) => {
    try {
      // Find the manufacturer to get wallet address
      const manufacturer = pendingManufacturers.find(m => m.tokenId === tokenId);
      
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }

      // Call blockchain function to update status
      const success = await updateManufacturerStatus(tokenId, "Rejected");
      
      if (success) {
        // Refresh the data
        const pending = await getPendingManufacturers();
        const rejected = await getRejectedManufacturers();
        
        // Update state
        setPendingManufacturers(pending);
        setRejectedManufacturers(rejected);
        setSuccessAlert({ 
          open: true, 
          message: "Manufacturer rejected successfully!" 
        });
      }
    } catch (error) {
      console.error("Error rejecting manufacturer:", error);
      setErrorAlert({ 
        open: true, 
        message: "Failed to reject manufacturer." 
      });
    }
  };

  const checkWebsiteAuthenticity = async (websiteUrl) => {
    try {
      const response = await axios.post("/api/genai/authenticmedicinewebsite", {
        website: websiteUrl,
      });
      const { probability } = response.data;
      setAuthenticityScore(parseInt(probability, 10)); // Update the authenticity score
    } catch (error) {
      console.error("Error checking website authenticity:", error);
      setAuthenticityScore(0); // Set score to 0 if there's an error
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        fontFamily: "sans-serif",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#EEF2F6",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          zIndex: 1500,
          height: "60px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{
              backgroundColor: "#FFFFDD",
              color: "#016A70",
              borderRadius: "50%",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">Contact Us</Typography>
          <Typography variant="body1">About Us</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
          <Typography variant="h6" sx={{ ml: 1 }}>
            MediCare
          </Typography>
        </Box>
      </Box>

      <Sidebar
        handleSectionChange={handleSectionChange}
        activeDashboard="manufacturers"
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          paddingTop: "80px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginLeft: "-30px",
          width: "100%",
        }}
      >
        {/* Admin Details Section */}
        <Box
          sx={{
            bgcolor: "#E0F7FA",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            height: "120px",
            width: "100%",
            border: "1px solid #81D4FA",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1E88E5" }}
            >
              Admin Details
            </Typography>
            <Typography variant="body1" color="#1E88E5">
              Name: {adminDetails.name}
            </Typography>
            <Typography variant="body1" color="#1E88E5">
              Email: {adminDetails.email}
            </Typography>
            <Typography variant="body1" color="#1E88E5">
              Role: {adminDetails.role}
            </Typography>
          </Box>
        </Box>

        {/* Conditional Rendering */}
        {activeSection === "pendingManufacturers" ||
        activeSection === "acceptedManufacturers" ||
        activeSection === "rejectedManufacturers" ? (
          <ManufacturerSlideshow
  manufacturers={
    activeSection === "acceptedManufacturers"
      ? acceptedManufacturers
      : activeSection === "rejectedManufacturers"
      ? rejectedManufacturers
      : pendingManufacturers
  }
  activeSection={activeSection}
  handleView={handleView}
  handleAccept={handleAcceptClick}
  handleReject={handleReject} // Pass the handleReject function
  selectedManufacturer={selectedManufacturer}
  setSelectedManufacturer={setSelectedManufacturer}
  authenticityScore={authenticityScore}
  setAuthenticityScore={setAuthenticityScore}
/>
        ) : activeSection === "manufacturerAnalytics" ? (
          <ChartsSection
            pendingManufacturers={pendingManufacturers}
            acceptedManufacturers={acceptedManufacturers}
            rejectedManufacturers={rejectedManufacturers}
          />
        ) : null}
      </Box>

      {/* Success and Error Alerts */}
      <SuccessMsgBox
        open={successAlert.open}
        onClose={() => setSuccessAlert({ open: false, message: "" })}
        message={successAlert.message}
      />
      <ErrorMsgBox
        open={errorAlert.open}
        onClose={() => setErrorAlert({ open: false, message: "" })}
        message={errorAlert.message}
      />
    </Box>
  );
};

export default ManufacturerPage;
