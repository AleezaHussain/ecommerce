"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import axios from "axios";
import ManufacturerSlideshow from "./ManufacturerSlideshow";
import ChartsSection from "./ChartsSection";
import { getPendingManufacturers, getApprovedManufacturers, getRejectedManufacturers } from "../../testingblockchain/accepted-rejected-manufacturer/fetch";
import { updateManufacturerStatus } from '../../testingblockchain/pendingmanufacture/fetch';
import { SuccessMsgBox, ErrorMsgBox } from "../../components/MsgBox";
import "../admin.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

const ManufacturerPage = ({ activeSection, handleSectionChange }) => {
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [pendingManufacturers, setPendingManufacturers] = useState([]);
  const [acceptedManufacturers, setAcceptedManufacturers] = useState([]);
  const [rejectedManufacturers, setRejectedManufacturers] = useState([]);
  const [authenticityScore, setAuthenticityScore] = useState(null);
  
  const [successAlert, setSuccessAlert] = useState({ open: false, message: "" });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const sections = ["pendingManufacturers", "acceptedManufacturers", "rejectedManufacturers", "manufacturerAnalytics"];
    handleSectionChange(sections[newValue]);
  };

  
  useEffect(() => {
    const loadManufacturers = async () => {
      try {
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
      const success = await updateManufacturerStatus(tokenId, "Approved");
      if (success) {
        const pending = await getPendingManufacturers();
        const approved = await getApprovedManufacturers();
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
      const manufacturer = pendingManufacturers.find(m => m.tokenId === tokenId);
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }

      const success = await updateManufacturerStatus(tokenId, "Rejected");
      if (success) {
        const pending = await getPendingManufacturers();
        const rejected = await getRejectedManufacturers();
        setPendingManufacturers(pending);
        setRejectedManufacturers(rejected);
        setSuccessAlert({ open: true, message: "Manufacturer rejected successfully!" });
      }
    } catch (error) {
      console.error("Error rejecting manufacturer:", error);
      setErrorAlert({ open: true, message: "Failed to reject manufacturer." });
    }
  };

  const checkWebsiteAuthenticity = async (websiteUrl) => {
    try {
      const response = await axios.post("/api/genai/authenticmedicinewebsite", {
        website: websiteUrl,
      });
      const { probability } = response.data;
      setAuthenticityScore(parseInt(probability, 10));
    } catch (error) {
      console.error("Error checking website authenticity:", error);
      setAuthenticityScore(0);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%",left:0 }}>
      

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "30px", display: "flex", flexDirection: "column" }}>
      
        

        {/* Tabs Section */}
        <Box sx={{ margin: "1px" }}>
        <Paper elevation={0} sx={{ borderRadius: "8px", backgroundColor: "transparent", boxShadow: "none" }}>
        <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 4,
                },
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                }
              }}
            >
              <Tab label="Pending Manufacturers" />
              <Tab label="Approved Manufacturers" />
              <Tab label="Rejected Manufacturers" />
              <Tab label="Analytics" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ mt: 2 }}>
            {value === 0 && (
              <ManufacturerSlideshow
                manufacturers={pendingManufacturers}
                activeSection="pendingManufacturers"
                handleView={handleView}
                handleAccept={handleAcceptClick}
                handleReject={handleReject}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                authenticityScore={authenticityScore}
                setAuthenticityScore={setAuthenticityScore}
              />
            )}
            {value === 1 && (
              <ManufacturerSlideshow
                manufacturers={acceptedManufacturers}
                activeSection="acceptedManufacturers"
                handleView={handleView}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                authenticityScore={authenticityScore} // ✅ ADD THIS
    setAuthenticityScore={setAuthenticityScore} // ✅ ADD THIS
              />
            )}
            {value === 2 && (
              <ManufacturerSlideshow
                manufacturers={rejectedManufacturers}
                activeSection="rejectedManufacturers"
                handleView={handleView}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                authenticityScore={authenticityScore} // ✅ ADD THIS
    setAuthenticityScore={setAuthenticityScore} // ✅ ADD THIS
              />
            )}
            {value === 3 && (
              <ChartsSection
                pendingManufacturers={pendingManufacturers}
                acceptedManufacturers={acceptedManufacturers}
                rejectedManufacturers={rejectedManufacturers}
                authenticityScore={authenticityScore} // ✅ ADD THIS
    setAuthenticityScore={setAuthenticityScore} // ✅ ADD THIS
              />
            )}
          </Box>
        </Box>
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