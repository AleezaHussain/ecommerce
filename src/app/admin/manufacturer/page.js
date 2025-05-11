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
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from "../../components/MsgBox";
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
  const [infoAlert, setInfoAlert] = useState({ open: false, message: "" });
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const sections = ["pendingManufacturers", "acceptedManufacturers", "rejectedManufacturers", "manufacturerAnalytics"];
    handleSectionChange(sections[newValue]);
  };

  const loadAllManufacturers = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        getPendingManufacturers(),
        getApprovedManufacturers(),
        getRejectedManufacturers()
      ]);
      setPendingManufacturers(pending);
      setAcceptedManufacturers(approved);
      setRejectedManufacturers(rejected);
    } catch (error) {
      console.error("Error loading manufacturers:", error);
      setErrorAlert({ open: true, message: "Failed to load manufacturers." });
    }
  };

  useEffect(() => {
    loadAllManufacturers();
  }, []);

  const showSuccessAlert = (message) => {
    setSuccessAlert({ open: true, message });
  };
  
  const showErrorAlert = (message) => {
    setErrorAlert({ open: true, message });
  };
  
  const showInfoAlert = (message) => {
    setInfoAlert({ open: true, message });
  };

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
      showInfoAlert("Please confirm the approval in MetaMask...");
      await updateManufacturerStatus(tokenId, "Approved");
      await loadAllManufacturers();
      showSuccessAlert("Manufacturer approved successfully!");
      return true;
    } catch (error) {
      console.error("Error accepting manufacturer:", error);
      showErrorAlert(error.message || "Failed to approve manufacturer.");
      return false;
    }
  };

  const handleReject = async (tokenId) => {
    try {
      showInfoAlert("Please confirm the rejection in MetaMask...");
      await updateManufacturerStatus(tokenId, "Rejected");
      await loadAllManufacturers();
      showSuccessAlert("Manufacturer rejected successfully!");
      return true;
    } catch (error) {
      console.error("Error rejecting manufacturer:", error);
      showErrorAlert(error.message || "Failed to reject manufacturer.");
      return false;
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
      <Box sx={{ flex: 1, padding: "30px", display: "flex", flexDirection: "column" }}>
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
                onStatusUpdate={loadAllManufacturers}
                showInfoAlert={showInfoAlert}
                showSuccessAlert={showSuccessAlert}
                showErrorAlert={showErrorAlert}
              />
            )}
            {value === 1 && (
              <ManufacturerSlideshow
                manufacturers={acceptedManufacturers}
                activeSection="acceptedManufacturers"
                handleView={handleView}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                authenticityScore={authenticityScore}
                setAuthenticityScore={setAuthenticityScore}
              />
            )}
            {value === 2 && (
              <ManufacturerSlideshow
                manufacturers={rejectedManufacturers}
                activeSection="rejectedManufacturers"
                handleView={handleView}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                authenticityScore={authenticityScore}
                setAuthenticityScore={setAuthenticityScore}
              />
            )}
            {value === 3 && (
              <ChartsSection
                pendingManufacturers={pendingManufacturers}
                acceptedManufacturers={acceptedManufacturers}
                rejectedManufacturers={rejectedManufacturers}
                authenticityScore={authenticityScore}
                setAuthenticityScore={setAuthenticityScore}
              />
            )}
          </Box>
        </Box>
      </Box>

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
      <InfoMsgBox
        open={infoAlert.open}
        onClose={() => setInfoAlert({ open: false, message: "" })}
        message={infoAlert.message}
      />
    </Box>
  );
};

export default ManufacturerPage;  