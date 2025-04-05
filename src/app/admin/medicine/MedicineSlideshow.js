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
  Avatar,
  Chip
} from "@mui/material";
import axios from "axios";

const MedicineSlideshow = ({
  medicines,
  activeSection,
  handleView,
  handleAccept,
  handleReject,
  selectedMedicine,
  setSelectedMedicine,
  
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [rejectionComment, setRejectionComment] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [medicineToReject, setMedicineToReject] = useState(null);

  // Table columns configuration
  const tableColumns = [
    { id: 'image', label: 'Image', align: 'center' },
    { id: 'name', label: 'Medicine Name', align: 'left' },
    { id: 'batchNumber', label: 'Batch Number', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'center' }
  ];

  // Status chip colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  // Column mapping for medicine details
  const columnNameMapping = {
    name: "Medicine Name",
    medicineId: "Medicine ID",
    batchNumber: "Batch Number",
    manufactureDate: "Manufacture Date",
    expiryDate: "Expiry Date",
    types: "Medicine Type",
    description: "Description",
    excipients: "Excipients",
    status: "Status",
    walletAddress: "Wallet Address",
    uploadedFiles: "Certificate PDF",
  };

  // Fetch medicines based on activeSection
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const status = activeSection === "pendingMedicines" ? "Pending" :
                       activeSection === "acceptedMedicines" ? "Accepted" :
                       activeSection === "rejectedMedicines" ? "Rejected" : null;
        if (status) {
          // Use the medicines passed as props (already filtered)
          const updatedData = medicines.map((medicine) => ({
            ...medicine,
            status: status, // Override the status based on the table type
          }));
          setFilteredMedicines(updatedData);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [activeSection, medicines]);

  // Handle View Details button click
  const handleViewDetails = async (medicineId) => {
    const selected = filteredMedicines.find((m) => m.tokenId === medicineId);
    if (selected) {
      setSelectedMedicine(selected);
      setDetailsModalOpen(true);
    }
  };

  // Handle View PDF button click
  const handleViewPDF = (pdfCID) => {
    if (pdfCID && pdfCID.length > 0) {
      // Assuming the first uploaded file is the certificate
      window.open(`https://ipfs.io/ipfs/${pdfCID[0].cid}`, "_blank");
    }
  };

  // Handle Accept/Reject button click
  const handleStatusUpdate = async (tokenId, newStatus) => {
    try {
      if (newStatus === "Accepted") {
        await handleAccept(tokenId);
      } else if (newStatus === "Rejected") {
        await handleReject(tokenId, rejectionComment);
      }
      setDetailsModalOpen(false);
      
      // Reset rejection comment
      setRejectionComment("");
    } catch (error) {
      console.error("Error updating medicine status:", error);
    }
  };

  const handleRejectClick = (tokenId) => {
    setMedicineToReject(tokenId);
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    try {
      const medicine = filteredMedicines.find(m => m.tokenId === medicineToReject);
      if (!medicine) {
        throw new Error("Medicine not found");
      }
  
      // Call the handleReject function passed from parent
      await handleReject(medicineToReject, rejectionComment);
  
      // Close dialogs and reset state
      setShowRejectionDialog(false);
      setDetailsModalOpen(false);
      setRejectionComment("");
      setMedicineToReject(null);
    } catch (error) {
      console.error("Complete rejection error:", error);
      alert(`Rejection failed: ${error.message}`);
    }
  };
  
  // Format excipients for display
  const formatExcipients = (excipients) => {
    if (!excipients) return "N/A";
    return excipients.join(", ");
  };

  // Determine the color of the progress bar based on the authenticity score
  const getProgressBarColor = (score) => {
    if (score < 30) {
      return "error"; // Red
    } else if (score >= 30 && score < 65) {
      return "warning"; // Yellow
    } else {
      return "success"; // Green
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 390px)",
        overflowY: "auto",
        bgcolor: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1200,
        padding: "20px",
        marginLeft: "20px",
        position: "relative",
      }}
    >
      {/* Table View for Medicines */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Medicine Name</TableCell>
              <TableCell>Medicine ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.tokenId}>
                <TableCell>
                  <Avatar 
                    src={medicine.uploadedFiles?.find(f => f.type === 'image')?.url || "/default-medicine.png"}
                    alt={medicine.name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.medicineId}</TableCell>
                <TableCell>{medicine.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleViewDetails(medicine.tokenId)}
                    sx={{ backgroundColor: "#016A70", color: "#fff", mr: 1 }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Medicine Details</DialogTitle>
        <DialogContent>
          {selectedMedicine && (
            <Box>
              {/* Medicine Image */}
              {selectedMedicine.uploadedFiles?.find(f => f.type === 'image') && (
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <img
                    src={selectedMedicine.uploadedFiles.find(f => f.type === 'image').url}
                    alt={selectedMedicine.name}
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                  />
                </Box>
              )}

              {/* Medicine Details */}
              {Object.entries(selectedMedicine).map(([key, value]) => {
                if (key === "tokenId" || key === "walletAddress" || key === "uploadedFiles") return null;

                const columnName = columnNameMapping[key] || key;

                return (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#016A70" }}>
                      {columnName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#555" }}>
                      {key === "uploadedFiles" ? (
                        <Button
                          variant="contained"
                          onClick={() => handleViewPDF(value)}
                          sx={{ backgroundColor: "#016A70", color: "#fff" }}
                        >
                          View PDF
                        </Button>
                      ) : key === "excipients" ? (
                        formatExcipients(value)
                      ) : (
                        value || "N/A"
                      )}
                    </Typography>
                  </Box>
                );
              })}

              {/* Show Accept/Reject buttons only for Pending medicines in the modal */}
              {activeSection === "pendingMedicines" && selectedMedicine.status === "Pending" && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusUpdate(selectedMedicine.tokenId, "Accepted")}
                    sx={{ backgroundColor: "#00C851", color: "#fff" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleRejectClick(selectedMedicine.tokenId)}
                    sx={{ backgroundColor: "#ff4444", color: "#fff" }}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectionDialog}
        onClose={() => {
          setShowRejectionDialog(false);
          setRejectionComment("");
        }}
      >
        <DialogTitle>Add Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Comments"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectionDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmRejection}
            color="error"
            disabled={!rejectionComment.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicineSlideshow;