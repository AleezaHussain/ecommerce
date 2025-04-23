"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MedicineSlideshow = ({
  medicines,
  activeSection,
  handleView,
  handleAccept,
  handleReject,
  selectedMedicine,
  setSelectedMedicine,
  authenticityScore,
  rejectDialogOpen,
  setRejectDialogOpen,
  rejectComment,
  setRejectComment,
  handleRejectSubmit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [showRejectCommentBox, setShowRejectCommentBox] = useState(false);

  // Utility function to convert excipients to camel case and comma-separated format
// Utility function to capitalize the first letter and convert the rest to camel case
const formatExcipients = (excipients) => {
  if (!excipients) return "";

  // If excipients is a string, split it into an array
  const excipientsArray = Array.isArray(excipients) ? excipients : excipients.split(",");

  // Convert each excipient to camel case with the first letter capitalized
  const formattedExcipients = excipientsArray.map((excipient) => {
    return excipient
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word, index) => 
        index === 0 
          ? word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of the first word
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of subsequent words
      )
      .join(""); // Join words without spaces (camel case)
  });

  // Join the formatted excipients with commas
  return formattedExcipients.join(", ");
};
  // Column mapping for medicine details
  const columnNameMapping = {
    medicine_id:"Medicine ID",
    medicine_name: "Medicine Name",
    batch_number: "Batch Number",
    manufacture_date: "Manufacture Date",
    expiry_date: "Expiry Date",
    medicine_type: "Medicine Type",
    description: "Description",
    excipients: "Excipients",
    status: "Status",
    certificate_pdf: "Certificate PDF",
    rejection_comments: "Rejection Comments",
  };

  // Filter medicines based on activeSection
  const filteredMedicines = medicines.filter((medicine) => {
    if (activeSection === "pendingMedicines") {
      return medicine.status === "pending";
    } else if (activeSection === "acceptedMedicines") {
      return medicine.status === "accepted";
    } else if (activeSection === "rejectedMedicines") {
      return medicine.status === "rejected";
    }
    return true;
  });

  // Handle navigation between medicines
  const handleNavigation = (direction) => {
    if (direction === "previous" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < filteredMedicines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get the current medicine
  const currentMedicine = filteredMedicines[currentIndex];

  // Ensure medicines are defined and not empty
  if (filteredMedicines.length === 0) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6" sx={{ color: "#016A70" }}>
          No medicines available.
        </Typography>
      </Box>
    );
  }

  // Handle View Details button click
  const handleViewDetails = (medicineId) => {
    handleView(medicineId); // Fetch medicine details
    setDetailsModalOpen(true); // Open the details modal
    setShowRejectCommentBox(false); // Reset reject comment box visibility
  };

  // Handle Reject button click
  const handleRejectClick = () => {
    setShowRejectCommentBox(true); // Show the reject comment box
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
      {/* Navigation Arrows */}
      <>
        <IconButton
          onClick={() => handleNavigation("previous")}
          disabled={currentIndex === 0}
          sx={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#016A70",
            zIndex: 1300,
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={() => handleNavigation("next")}
          disabled={currentIndex === filteredMedicines.length - 1}
          sx={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#016A70",
            zIndex: 1300,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </>

      {/* Medicine Card */}
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          display: "flex", // Use flexbox for layout
          alignItems: "center", // Center items vertically
          gap: "20px", // Add spacing between image and details
        }}
      >
        {/* Medicine Image on the Left */}
        {currentMedicine?.medicine_image && (
          <Box
            sx={{
              width: "150px", // Fixed width for the image
              height: "150px", // Fixed height for the image
              borderRadius: "8px",
              overflow: "hidden", // Ensure the image doesn't overflow
            }}
          >
            <img
              src={currentMedicine.medicine_image}
              alt="Medicine"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} // Ensure the image covers the box
            />
          </Box>
        )}

        {/* Medicine Details on the Right */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#016A70", mb: 2 }}>
            {currentMedicine?.medicine_name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
            Status: {currentMedicine?.status}
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleViewDetails(currentMedicine.id)}
            sx={{ backgroundColor: "#016A70", color: "#fff" }}
          >
            View Details
          </Button>
        </Box>
      </Paper>

      {/* Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
          },
          "& .MuiDialog-paper": {
            marginTop: "70px",
            marginBottom: "200px",
          },
        }}
      >
        <DialogTitle>Medicine Details</DialogTitle>
        <DialogContent>
          {selectedMedicine && (
            <Box>
              {/* Medicine Image at the Top */}
              {selectedMedicine.medicine_image && (
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <img
                    src={selectedMedicine.medicine_image}
                    alt="Medicine"
                    style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                  />
                </Box>
              )}

              {/* Medicine Details with Column Mapping */}
              // Inside the MedicineSlideshow component, modify the rendering of excipients
{Object.entries(selectedMedicine).map(([key, value]) => {
  if (key === "id" || key === "qr_hash" || key === "medicine_image") return null;
  if (key === "rejection_comments" && selectedMedicine.status !== "rejected") return null;

  // Get the mapped column name
  const columnName = columnNameMapping[key] || key;

  // Format excipients if the key is "excipients"
  const displayValue = key === "excipients" ? formatExcipients(value) : value;

  return (
    <Box key={key} sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#016A70" }}>
        {columnName}
      </Typography>
      <Typography variant="body1" sx={{ color: "#555" }}>
        {key === "certificate_pdf" ? (
          <Button onClick={() => window.open(value, "_blank")} sx={{ color: "#016A70" }}>
            View Certificate
          </Button>
        ) : key === "rejection_comments" ? (
          value.length > 0 ? (
            <ul>
              {value.map((comment, index) => (
                <li key={index}>{comment.comments}</li>
              ))}
            </ul>
          ) : (
            "No comments"
          )
        ) : (
          displayValue // Use the formatted value for excipients
        )}
      </Typography>
    </Box>
  );
})}

              {/* Accept/Reject Buttons */}
              {selectedMedicine.status === "pending" && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleAccept(selectedMedicine.id)}
                    sx={{ backgroundColor: "#00C851", color: "#fff" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRejectClick}
                    sx={{ backgroundColor: "#ff4444", color: "#fff" }}
                  >
                    Reject
                  </Button>
                </Box>
              )}

              {/* Reject Comment Box */}
              {showRejectCommentBox && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Rejection Comment (Optional)"
                    fullWidth
                    variant="outlined"
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleRejectSubmit}
                    sx={{ mt: 2, backgroundColor: "#ff4444", color: "#fff" }}
                  >
                    Submit Rejection
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
    </Box>
  );
};

export default MedicineSlideshow;