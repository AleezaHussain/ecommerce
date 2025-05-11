"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  TextField,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { getManufacturersByStatus } from "../../testingblockchain/accepted-rejected-manufacturer/fetch";
import axios from "axios";
import { rejectManufacturer } from "../../../../lib/adminmanufacturerfetch";
import { getPendingManufacturers } from "../../testingblockchain/pendingmanufacture/fetch";

const ManufacturerSlideshow = ({
  manufacturers,
  activeSection,
  handleView,
  handleAccept,
  handleReject,
  selectedManufacturer,
  setSelectedManufacturer,
  authenticityScore,
  setAuthenticityScore,
  onStatusUpdate,
  showInfoAlert,
  showSuccessAlert,
  showErrorAlert
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [rejectionComment, setRejectionComment] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [manufacturerToReject, setManufacturerToReject] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const columnNameMapping = {
    manufacturerName: "Manufacturer Name",
    physicalAddress: "Physical Address",
    phoneNumber: "Phone Number",
    licenceNo: "License Number",
    email: "Email Address",
    walletAddress: "Wallet Address",
    certificationNumber: "Certification Number",
    website: "Website URL",
    dateOfIssue: "Date of Issue",
    status: "Status",
    pdfCID: "Certification PDF",
  };

  useEffect(() => {
    const fetchManufacturers = async () => {
      setIsLoading(true);
      try {
        const status = activeSection === "pendingManufacturers" ? "Pending" :
                     activeSection === "acceptedManufacturers" ? "Approved" :
                     activeSection === "rejectedManufacturers" ? "Rejected" : null;
        if (status) {
          const data = await getManufacturersByStatus(status);
          const updatedData = data.map((manufacturer) => ({
            ...manufacturer,
            status: status,
          }));
          setFilteredManufacturers(updatedData);
        }
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManufacturers();
  }, [activeSection]);

  const handleViewDetails = async (manufacturerId) => {
    const selected = filteredManufacturers.find((m) => m.tokenId === manufacturerId);
    if (selected) {
      setSelectedManufacturer(selected);
      setDetailsModalOpen(true);
      if (selected.website) {
        await checkWebsiteAuthenticity(selected.website);
      } else {
        setAuthenticityScore(null); // show "Calculating..."
        setTimeout(() => {
          setAuthenticityScore(0); // fallback after a short delay
        }, 500); // or 1000ms
              }
      
    }
  };

  const handleViewPDF = (pdfCID) => {
    if (pdfCID) {
      window.open(`https://ipfs.io/ipfs/${pdfCID}`, "_blank");
    }
  };

  const handleStatusUpdate = async (tokenId, newStatus) => {
    try {
      setIsProcessing(true);
      showInfoAlert("Please confirm the transaction in MetaMask...");
      
      let success = false;
      if (newStatus === "Approved") {
        success = await handleAccept(tokenId);
      } else if (newStatus === "Rejected") {
        success = await handleReject(tokenId);
      }

      if (success) {
        setDetailsModalOpen(false);
        await onStatusUpdate();
        showSuccessAlert(`Manufacturer ${newStatus.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.error("Error updating manufacturer status:", error);
      showErrorAlert("Failed to update manufacturer status");
    } finally {
      setIsProcessing(false);
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

  const handleRejectClick = (tokenId) => {
    setManufacturerToReject(tokenId);
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    try {
      setIsProcessing(true);
      showInfoAlert("Please confirm the rejection in MetaMask...");
      
      const manufacturer = filteredManufacturers.find(m => m.tokenId === manufacturerToReject);
      if (!manufacturer) throw new Error("Manufacturer not found");

      await rejectManufacturer(manufacturer.walletAddress, rejectionComment);
      const success = await handleReject(manufacturerToReject);
      
      if (success) {
        setShowRejectionDialog(false);
        setRejectionComment("");
        setManufacturerToReject(null);
        await onStatusUpdate();
        showSuccessAlert("Manufacturer rejected successfully!");
      }
    } catch (error) {
      console.error("Complete rejection error:", error);
      showErrorAlert("Failed to reject manufacturer");
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressBarColor = (score) => {
    if (score < 30) return "error";
    if (score >= 30 && score < 65) return "warning";
    return "success";
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Approved":
        return <Chip label="Approved" color="success" variant="outlined" />;
      case "Pending":
        return <Chip label="Pending" color="warning" variant="outlined" />;
      case "Rejected":
        return <Chip label="Rejected" color="error" variant="outlined" />;
      default:
        return <Chip label={status} variant="outlined" />;
    }
  };

  return (
    <Box sx={{ width: "100%", overflowY: "auto" }}>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Manufacturer Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>License Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredManufacturers.length > 0 ? (
              filteredManufacturers.map((manufacturer) => (
                <TableRow key={manufacturer.tokenId} hover>
                <TableCell align="center">{manufacturer.manufacturerName}</TableCell>
                <TableCell align="center">{manufacturer.licenceNo}</TableCell>
                <TableCell align="center">{getStatusChip(manufacturer.status)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() => handleViewDetails(manufacturer.tokenId)}
                    sx={{
                      backgroundColor: "#002F6C",
                      color: "#fff",
                      '&:hover': {
                        backgroundColor: "#001F4D"
                      }
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {activeSection === "pendingManufacturers" 
                      ? "No pending manufacturers available" 
                      : activeSection === "acceptedManufacturers" 
                        ? "No approved manufacturers available" 
                        : "No rejected manufacturers available"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={detailsModalOpen}
        onClose={() => !isProcessing && setDetailsModalOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{
          zIndex: 1700,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0,0,0,0.7)',
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#002F6C", color: "white" }}>
          Manufacturer Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedManufacturer && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: 3 
              }}>
                {Object.entries(selectedManufacturer).map(([key, value]) => {
                  if (key === "tokenId" || key === "walletAddress") return null;

                  const columnName = columnNameMapping[key] || key;

                  return (
                    <Box key={key}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                        {columnName}
                      </Typography>
                      {key === "website" ? (
                        value ? (
                          <a
                            href={value.startsWith("https") ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#016A70", textDecoration: "underline" }}
                          >
                            {value}
                          </a>
                        ) : (
                          "N/A"
                        )
                      ) : key === "pdfCID" ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleViewPDF(value)}
                          sx={{ 
                            mt: 1,
                            color: "#002F6C",
                            borderColor: "#002F6C",
                            '&:hover': {
                              backgroundColor: "#002F6C",
                              color: "white"
                            }
                          }}
                        >
                          View PDF
                        </Button>
                      ) : (
                        <Typography variant="body1" sx={{ color: "#555" }}>
                          {value || "N/A"}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ mt: 3 }}>
  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C" }}>
    Website Authenticity Score
  </Typography>
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography variant="body1" sx={{ color: "#555" }}>
      {authenticityScore === null ? "Calculating..." : `${authenticityScore}%`}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={authenticityScore ?? 0}
      color={getProgressBarColor(authenticityScore ?? 0)}
      sx={{
        flexGrow: 1,
        height: 10,
        borderRadius: 5,
      }}
    />
  </Box>
</Box>

              {activeSection === "pendingManufacturers" && selectedManufacturer.status === "Pending" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusUpdate(selectedManufacturer.tokenId, "Approved")}
                    sx={{ 
                      backgroundColor: "#2E7D32",
                      '&:hover': {
                        backgroundColor: "#1B5E20"
                      }
                    }}
                    disabled={isProcessing}
                    endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isProcessing ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleRejectClick(selectedManufacturer.tokenId)}
                    sx={{ 
                      backgroundColor: "#d32f2f",
                      '&:hover': {
                        backgroundColor: "#b71c1c"
                      }
                    }}
                    disabled={isProcessing}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => !isProcessing && setDetailsModalOpen(false)}
            disabled={isProcessing}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRejectionDialog}
        onClose={() => !isProcessing && setShowRejectionDialog(false)}
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isProcessing}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => !isProcessing && setShowRejectionDialog(false)}
            sx={{ color: "#016A70" }}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmRejection}
            color="error"
            disabled={!rejectionComment.trim() || isProcessing}
            variant="contained"
            endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isProcessing ? "Processing..." : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManufacturerSlideshow;