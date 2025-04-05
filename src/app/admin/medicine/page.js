"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import axios from "axios";
import MedicineSlideshow from "./MedicineSlideshow";
import ChartsSection from "./ChartsSection";
import { 
  fetchPendingMedicines,
  updateMedicineStatus 
} from "../../testingblockchain/medicinework/pendingmedicine/fetchfunction";
import  {fetchMedicinesByStatus} from '../../testingblockchain/medicinework/accepted-rejected/fetch';
import { SuccessMsgBox, ErrorMsgBox } from "../../components/MsgBox";
import "../admin.css";
import {rejectMedicine} from '../../../../lib/adminmedicinefetch';

const MedicinePage = ({ activeSection, handleSectionChange }) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pendingMedicines, setPendingMedicines] = useState([]);
  const [acceptedMedicines, setAcceptedMedicines] = useState([]);
  const [rejectedMedicines, setRejectedMedicines] = useState([]);
  const [authenticityScore, setAuthenticityScore] = useState(null);
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
    const loadMedicines = async () => {
      try {
        // Fetch medicines from the blockchain
        const pending = await fetchPendingMedicines();
        const accepted = await fetchMedicinesByStatus("Accepted");
        const rejected = await fetchMedicinesByStatus("Rejected");

        setPendingMedicines(pending);
        setAcceptedMedicines(accepted);
        setRejectedMedicines(rejected);
      } catch (error) {
        console.error("Error loading medicines:", error);
        setErrorAlert({ open: true, message: "Failed to load medicines." });
      }
    };

    loadMedicines();
  }, []);

  const handleView = async (tokenId) => {
    // Find the selected medicine from the appropriate list
    let selected;
    if (activeSection === "pendingMedicines") {
      selected = pendingMedicines.find((m) => m.tokenId === tokenId);
    } else if (activeSection === "acceptedMedicines") {
      selected = acceptedMedicines.find((m) => m.tokenId === tokenId);
    } else if (activeSection === "rejectedMedicines") {
      selected = rejectedMedicines.find((m) => m.tokenId === tokenId);
    }

    if (selected) {
      setSelectedMedicine(selected);
    }
  };

  const handleAcceptClick = async (tokenId) => {
    try {
      setSuccessAlert({ open: false, message: "" });
      setErrorAlert({ open: false, message: "" });
      
      // Call blockchain function to update status
      await updateMedicineStatus(tokenId, "Accepted");
      
      // Refresh the data
      const pending = await fetchPendingMedicines();
      const accepted = await fetchMedicinesByStatus("Accepted");
      
      // Update state
      setPendingMedicines(pending);
      setAcceptedMedicines(accepted);
      setSuccessAlert({ open: true, message: "Medicine approved successfully!" });
    } catch (error) {
      console.error("Error accepting medicine:", error);
      setErrorAlert({ 
        open: true, 
        message: error.message || "Failed to approve medicine." 
      });
    }
  };
  
  const handleReject = async (tokenId, rejectionComment = "") => {
    try {
      setSuccessAlert({ open: false, message: "" });
      setErrorAlert({ open: false, message: "" });
      
      // First store the rejection comment in the database
      if (rejectionComment) {
        await rejectMedicine(tokenId, rejectionComment);
      }
  
      // Then update the blockchain status
      await updateMedicineStatus(tokenId, "Rejected");
      
      // Refresh the data
      const pending = await fetchPendingMedicines();
      const rejected = await fetchMedicinesByStatus("Rejected");
      
      // Update state
      setPendingMedicines(pending);
      setRejectedMedicines(rejected);
      setSuccessAlert({ 
        open: true, 
        message: "Medicine rejected successfully!" 
      });
    } catch (error) {
      console.error("Error rejecting medicine:", error);
      setErrorAlert({ 
        open: true, 
        message: error.message || "Failed to reject medicine." 
      });
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
        activeDashboard="medicines"
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
        {activeSection === "pendingMedicines" ||
        activeSection === "acceptedMedicines" ||
        activeSection === "rejectedMedicines" ? (
          <MedicineSlideshow
            medicines={
              activeSection === "acceptedMedicines"
                ? acceptedMedicines
                : activeSection === "rejectedMedicines"
                ? rejectedMedicines
                : pendingMedicines
            }
            activeSection={activeSection}
            handleView={handleView}
            handleAccept={handleAcceptClick}
            handleReject={handleReject}
            selectedMedicine={selectedMedicine}
            setSelectedMedicine={setSelectedMedicine}
            authenticityScore={authenticityScore}
            setAuthenticityScore={setAuthenticityScore}
          />
        ) : activeSection === "medicineAnalytics" ? (
          <ChartsSection
            pendingMedicines={pendingMedicines}
            acceptedMedicines={acceptedMedicines}
            rejectedMedicines={rejectedMedicines}
          />
        ) : null}
      </Box>

      
    </Box>
  );
};

export default MedicinePage;