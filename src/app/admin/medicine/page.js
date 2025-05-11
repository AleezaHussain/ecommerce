"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import MedicineSlideshow from "./MedicineSlideshow";
import ChartsSection from "./ChartsSection";
import { 
  fetchPendingMedicines,
  updateMedicineStatus 
} from "../../testingblockchain/medicinework/pendingmedicine/fetchfunction";
import {fetchMedicinesByStatus} from "../../testingblockchain/medicinework/accepted-rejected/fetch";
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from "../../components/MsgBox";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

const MedicinePage = ({ activeSection, handleSectionChange }) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [pendingMedicines, setPendingMedicines] = useState([]);
  const [acceptedMedicines, setAcceptedMedicines] = useState([]);
  const [rejectedMedicines, setRejectedMedicines] = useState([]);
  const [authenticityScore, setAuthenticityScore] = useState(null);
  const [value, setValue] = useState(0);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: "" });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  const [infoAlert, setInfoAlert] = useState({ open: false, message: "" });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const sections = ["pendingMedicines", "acceptedMedicines", "rejectedMedicines", "medicineAnalytics"];
    handleSectionChange(sections[newValue]);
  };

  const loadAllMedicines = async () => {
    try {
      const [pending, accepted, rejected] = await Promise.all([
        fetchPendingMedicines(),
        fetchMedicinesByStatus("Accepted"),
        fetchMedicinesByStatus("Rejected")
      ]);
      setPendingMedicines(pending);
      setAcceptedMedicines(accepted);
      setRejectedMedicines(rejected);
    } catch (error) {
      console.error("Error loading medicines:", error);
      showErrorAlert("Failed to load medicines.");
    }
  };

  useEffect(() => {
    loadAllMedicines();
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
    const selected = pendingMedicines.find((m) => m.tokenId === id);
    if (selected) {
      setSelectedMedicine(selected);
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
      await updateMedicineStatus(tokenId, "Accepted");
      await loadAllMedicines();
      showSuccessAlert("Medicine approved successfully!");
      return true;
    } catch (error) {
      console.error("Error accepting medicine:", error);
      showErrorAlert(error.message || "Failed to approve medicine.");
      return false;
    }
  };

  const handleReject = async (tokenId) => {
    try {
      showInfoAlert("Please confirm the rejection in MetaMask...");
      await updateMedicineStatus(tokenId, "Rejected");
      await loadAllMedicines();
      showSuccessAlert("Medicine rejected successfully!");
      return true;
    } catch (error) {
      console.error("Error rejecting medicine:", error);
      showErrorAlert(error.message || "Failed to reject medicine.");
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
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
              <Tab label="Pending Medicines" />
              <Tab label="Approved Medicines" />
              <Tab label="Rejected Medicines" />
              <Tab label="Analytics" />
            </Tabs>
          </Paper>

          <Box sx={{ mt: 3 }}>
            {value === 0 && (
              <MedicineSlideshow
                medicines={pendingMedicines}
                activeSection="pendingMedicines"
                handleView={handleView}
                handleAccept={handleAcceptClick}
                handleReject={handleReject}
                selectedMedicine={selectedMedicine}
                setSelectedMedicine={setSelectedMedicine}
                authenticityScore={authenticityScore}
                setAuthenticityScore={setAuthenticityScore}
                onStatusUpdate={loadAllMedicines}
                showInfoAlert={showInfoAlert}
                showSuccessAlert={showSuccessAlert}
                showErrorAlert={showErrorAlert}
              />
            )}
            {value === 1 && (
              <MedicineSlideshow
                medicines={acceptedMedicines}
                activeSection="acceptedMedicines"
                handleView={handleView}
                selectedMedicine={selectedMedicine}
                setSelectedMedicine={setSelectedMedicine}
                onStatusUpdate={loadAllMedicines}
              />
            )}
            {value === 2 && (
              <MedicineSlideshow
                medicines={rejectedMedicines}
                activeSection="rejectedMedicines"
                handleView={handleView}
                selectedMedicine={selectedMedicine}
                setSelectedMedicine={setSelectedMedicine}
                onStatusUpdate={loadAllMedicines}
              />
            )}
            {value === 3 && (
              <ChartsSection
                pendingMedicines={pendingMedicines}
                acceptedMedicines={acceptedMedicines}
                rejectedMedicines={rejectedMedicines}
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

export default MedicinePage;