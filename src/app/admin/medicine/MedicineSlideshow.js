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
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchMedicinesByStatus } from "../../testingblockchain/medicinework/accepted-rejected/fetch";
import { getApprovedManufacturers } from "../../testingblockchain/accepted-rejected-manufacturer/fetch";
import axios from "axios";
import { rejectMedicine, fetchRejectionComments } from "../../../../lib/adminmedicinefetch";
import { fetchPendingMedicines } from "../../testingblockchain/medicinework/pendingmedicine/fetchfunction";

const MedicineSlideshow = ({
  medicines,
  activeSection,
  handleView,
  handleAccept,
  handleReject,
  selectedMedicine,
  setSelectedMedicine,
  authenticityScore,
  setAuthenticityScore,
  onStatusUpdate,
  showInfoAlert,
  showSuccessAlert,
  showErrorAlert
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [rejectionComment, setRejectionComment] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [medicineToReject, setMedicineToReject] = useState(null);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [authenticityResults, setAuthenticityResults] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionComments, setRejectionComments] = useState({});

  const columnNameMapping = {
    name: "Medicine Name",
    medicineId: "Medicine ID",
    batchNumber: "BatchNumber",
    manufactureDate: "Manufacture Date",
    expiryDate: "Expiry Date",
    types: "Medicine Type",
    description: "Description",
    excipients: "Excipients",
    status: "Status",
    walletAddress: "Wallet Address",
    pdfCID: "Certification PDF",
    image: "Medicine Image",
    uploadedFiles: "Attached Files"
  };

  useEffect(() => {
    const fetchApprovedManufacturers = async () => {
      try {
        const approvedManufacturers = await getApprovedManufacturers();
        setManufacturerList(approvedManufacturers);
      } catch (err) {
        console.error("Error fetching approved manufacturers:", err);
      }
    };
    fetchApprovedManufacturers();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        let data;
        if (activeSection === "pendingMedicines") {
          data = await fetchPendingMedicines();
        } else {
          const status = activeSection === "acceptedMedicines" ? "Accepted" : "Rejected";
          data = await fetchMedicinesByStatus(status);
          
          // For rejected medicines, fetch their rejection comments
          if (status === "Rejected") {
            const commentsPromises = data.map(async (medicine) => {
              const comments = await fetchRejectionComments(medicine.tokenId);
              return { tokenId: medicine.tokenId, comments };
            });
            const commentsResults = await Promise.all(commentsPromises);
            const commentsMap = commentsResults.reduce((acc, curr) => {
              acc[curr.tokenId] = curr.comments;
              return acc;
            }, {});
            setRejectionComments(commentsMap);
          }
        }

        const updatedData = data.map((medicine) => ({
          ...medicine,
          status: activeSection === "pendingMedicines" ? "Pending" : 
                 activeSection === "acceptedMedicines" ? "Accepted" : "Rejected",
        }));
        
        setFilteredMedicines(updatedData);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [activeSection]);

  const handleViewDetails = async (medicineId) => {
    const selected = filteredMedicines.find((m) => m.tokenId === medicineId);
    if (selected) {
      setSelectedMedicine(selected);
      setDetailsModalOpen(true);
      
      // Only check authenticity for pending medicines if not already checked
      if (activeSection === "pendingMedicines" && !authenticityResults[medicineId]) {
        const result = await checkMedicineAuthenticity(selected);
        setAuthenticityResults(prev => ({
          ...prev,
          [medicineId]: result
        }));
      }
    }
  };
  const handleStatusUpdate = async (tokenId, newStatus) => {
    try {
      setIsProcessing(true);
      showInfoAlert("Please confirm the transaction in MetaMask...");
      
      let success = false;
      if (newStatus === "Accepted") {
        success = await handleAccept(tokenId);
      } else if (newStatus === "Rejected") {
        success = await handleReject(tokenId);
      }

      if (success) {
        setDetailsModalOpen(false);
        await onStatusUpdate();
        showSuccessAlert(`Medicine ${newStatus.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      showErrorAlert("Error confirming medicine status. Try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkMedicineAuthenticity = async (medicine) => {
    try {
      const response = await axios.post("/api/genai/genai", {
        name: medicine.name,
        expiryDate: medicine.expiryDate,
        excipients: medicine.excipients,
        description: medicine.description
      });
      return {
        isAuthentic: response.data.isAuthentic === "Yes",
        message: response.data.isAuthentic === "Yes" 
          ? "This medicine appears to be authentic based on the provided details."
          : "This medicine has been flagged as suspicious. Please review carefully."
      };
    } catch (error) {
      console.error("Error checking medicine authenticity:", error);
      return {
        isAuthentic: false,
        message: "Could not verify authenticity due to an error."
      };
    }
  };

  const handleRejectClick = (tokenId) => {
    setMedicineToReject(tokenId);
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    try {
      setIsProcessing(true);
      showInfoAlert("Please confirm the rejection in MetaMask...");
      
      const medicine = filteredMedicines.find(m => m.tokenId === medicineToReject);
      if (!medicine) throw new Error("Medicine not found");

      await rejectMedicine(medicine.tokenId, rejectionComment);
      const success = await handleReject(medicineToReject);
      
      if (success) {
        setShowRejectionDialog(false);
        setRejectionComment("");
        setMedicineToReject(null);
        await onStatusUpdate();
        showSuccessAlert("Medicine rejected successfully!");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      showErrorAlert("Error confirming medicine status. Try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Accepted": return <Chip label="Approved" color="success" variant="outlined" />;
      case "Pending": return <Chip label="Pending" color="warning" variant="outlined" />;
      case "Rejected": return <Chip label="Rejected" color="error" variant="outlined" />;
      default: return <Chip label={status} variant="outlined" />;
    }
  };

  const getManufacturerName = (walletAddress) => {
    if (!walletAddress || !manufacturerList.length) return "Unknown Manufacturer";
    const manufacturer = manufacturerList.find(
      (m) => m.walletAddress?.toLowerCase() === walletAddress?.toLowerCase()
    );
    return manufacturer?.manufacturerName || "Unknown Manufacturer";
  };
  
  return (
    <Box sx={{ width: "100%", overflowY: "auto" }}>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Medicine Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Medicine ID</TableCell>
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
        ) : filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <TableRow key={medicine.tokenId} hover>
              <TableCell align="center">
                {authenticityResults[medicine.tokenId] && (
                  authenticityResults[medicine.tokenId].isAuthentic ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <WarningIcon color="error" fontSize="small" />
                  )
                )}
                {medicine.name}
              </TableCell>
              <TableCell align="center">{medicine.medicineId}</TableCell>
              <TableCell align="center">{getStatusChip(medicine.status)}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  onClick={() => handleViewDetails(medicine.tokenId)}
                  sx={{ 
                    backgroundColor: "#002F6C", 
                    color: "#fff", 
                    mr: 1,
                    '&:hover': {
                      backgroundColor: "#001F4D"
                    }
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {activeSection === "pendingMedicines" 
                  ? "No pending medicines available" 
                  : activeSection === "acceptedMedicines" 
                    ? "No approved medicines available" 
                    : "No rejected medicines available"}
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
      backgroundColor: 'rgba(0,0,0,0.7)' // 🔄 Back to default black overlay
    },
    '& .MuiPaper-root': {
      backgroundColor: '#fff',           // 🔄 Default paper
      borderLeft: 'none'                 // 🔄 Remove colored border
    }
  }}
>
  <DialogTitle sx={{
    backgroundColor: "#002F6C", // 🔄 Default blue
    color: "white"
  }}>
    Medicine Details
  </DialogTitle>





        <DialogContent dividers>

        {activeSection === "pendingMedicines" && 
  selectedMedicine && 
  !authenticityResults[selectedMedicine.tokenId] && (
    <Box sx={{
      mb: 2,
      p: 2,
      borderRadius: 1,
      backgroundColor: '#FFF8E1',
      borderLeft: '4px solid #FFC107',
      display: 'flex',
      alignItems: 'center'
    }}>
      <CircularProgress size={20} sx={{ mr: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Checking medicine authenticity...
      </Typography>
    </Box>
)}
          {selectedMedicine && (
            <Box sx={{ mt: 2 }}>
              {/* Authenticity Result Box */}
              {authenticityResults[selectedMedicine.tokenId] && (
                <Box sx={{ 
                  mb: 3,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: authenticityResults[selectedMedicine.tokenId].isAuthentic 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  borderLeft: `4px solid ${
                    authenticityResults[selectedMedicine.tokenId].isAuthentic 
                      ? '#4CAF50' 
                      : '#F44336'
                  }`,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {authenticityResults[selectedMedicine.tokenId].isAuthentic ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 24 }} />
                  ) : (
                    <WarningIcon color="error" sx={{ mr: 1, fontSize: 24 }} />
                  )}
                  <Typography variant="body2" sx={{ 
                    color: authenticityResults[selectedMedicine.tokenId].isAuthentic 
                      ? '#4CAF50' 
                      : '#F44336',
                    fontWeight: 'medium'
                  }}>
                    {authenticityResults[selectedMedicine.tokenId].message}
                  </Typography>
                </Box>
              )}



              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 3,
              }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                    Manufacturer Name
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {getManufacturerName(selectedMedicine.walletAddress)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#777", display: "block" }}>
                    Wallet: {selectedMedicine.walletAddress}
                  </Typography>
                </Box>

                {Object.entries(selectedMedicine).map(([key, value]) => {
                  if (["tokenId", "walletAddress", "uploadedFiles"].includes(key)) return null;
                  const columnName = columnNameMapping[key] || key;
                  return (
                    <Box key={key}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                        {columnName}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#555" }}>
                        {Array.isArray(value) ? value.join(", ") : value || "N/A"}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              {selectedMedicine.uploadedFiles?.map((file, index) =>
                /\.(jpeg|jpg|png|gif|webp)$/i.test(file.fileName) ? (
                  <Box key={`img-${index}`} sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C" }}>
                      Medicine Image
                    </Typography>
                    <Box
                      component="img"
                      src={`https://ipfs.io/ipfs/${file.ipfsHash}`}
                      alt={file.fileName}
                      sx={{ width: "100%", maxWidth: 300, borderRadius: 2 }}
                    />
                  </Box>
                ) : null
              )}

              {selectedMedicine.uploadedFiles?.some(f => f.fileName?.toLowerCase().endsWith(".pdf")) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#002F6C", mb: 1 }}>
                    Certificate PDF
                  </Typography>
                  {selectedMedicine.uploadedFiles.map((file, index) =>
                    file.fileName?.toLowerCase().endsWith(".pdf") ? (
                      <Button
                        key={`pdf-${index}`}
                        variant="outlined"
                        color="primary"
                        href={`https://ipfs.io/ipfs/${file.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#002F6C",
                          borderColor: "#002F6C",
                          fontWeight: "bold",
                          '&:hover': {
                            backgroundColor: "#002F6C",
                            color: "#fff",
                            borderColor: "#002F6C"
                          }
                        }}
                      >
                        View Certificate PDF
                      </Button>
                    ) : null
                  )}
                </Box>
              )}

{/* Rejection Comments for Rejected Medicines */}
{selectedMedicine.status === "Rejected" && rejectionComments[selectedMedicine.tokenId] && (
                <Box sx={{ 
                  mb: 3,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  borderLeft: '4px solid #F44336'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#F44336', mb: 1 }}>
                    Rejection Reason
                  </Typography>
                  {rejectionComments[selectedMedicine.tokenId].map((comment, index) => (
                    <Typography key={index} variant="body2" sx={{ color: '#F44336' }}>
                      {comment.rejection_comments}
                    </Typography>
                  ))}
                </Box>
              )}
              

              
              {activeSection === "pendingMedicines" && selectedMedicine.status === "Pending" && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusUpdate(selectedMedicine.tokenId, "Accepted")}
                    sx={{ backgroundColor: "#00C851", color: "#fff" }}
                    disabled={isProcessing}
                    endIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : null}
                  >
                    {isProcessing ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleRejectClick(selectedMedicine.tokenId)}
                    sx={{ backgroundColor: "#ff4444", color: "#fff" }}
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
            sx={{ color: "#002F6C" }}
            disabled={isProcessing}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRejectionDialog}
        onClose={() => !isProcessing && setShowRejectionDialog(false)}
        sx={{
          zIndex: 1800,
          '& .MuiBackdrop-root': {
            transition: 'background-color 0.5s ease',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }
        }}
      >
        <DialogTitle sx={{ color: "#002F6C" }}>Rejection Reason</DialogTitle>
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
            sx={{ color: "#002F6C" }}
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

export default MedicineSlideshow;