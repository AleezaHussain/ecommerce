"use client";
import React, { useState, useEffect } from "react";
import {
  fetchManufacturers,
  fetchManufacturerDetails,
  acceptManufacturer,
  rejectManufacturer,
} from "../../../lib/admindatafetch";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Image from "next/image";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import handleAccept from "../blockchain/handleaccept"

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("pendingManufacturers");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pendingManufacturers, setPendingManufacturers] = useState([]);
  const [acceptedManufacturers, setAcceptedManufacturers] = useState([]);
  const [rejectedManufacturers, setRejectedManufacturers] = useState([]);
  const [showWalletAddress, setShowWalletAddress] = useState(false); // State to toggle wallet address visibility
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false); // State for reject dialog
  const [rejectComment, setRejectComment] = useState(""); // State for reject comment
  const [authenticityScore, setAuthenticityScore] = useState(null);


  const columnNameMapping = {
    name: "Manufacturer Name",
    physical_address: "Physical Address",
    phone: "Phone Number",
    licence_no: "License Number",
    email: "Email Address",
    wallet_address: "Wallet Address",
    certification_url: "Certification PDF",
    certification_no: "Certification Number",
    website_url: "Website URL",
    date_of_issue: "Date of Issue",
    reg_date: "Registration Date",
    status: "Status",
    rejection_comments: "Comments", // Add this line

  };
  // Fetch manufacturers on component mount
  useEffect(() => {
    const loadManufacturers = async () => {
      const data = await fetchManufacturers();
      console.log("Data from fetchManufacturers:", data); // Log the fetched data

      const pending = data.filter((m) => m.status === "pending");
      const accepted = data.filter((m) => m.status === "accepted");
      const rejected = data.filter((m) => m.status === "rejected");

      console.log("Pending Manufacturers:", pending);
      console.log("Accepted Manufacturers:", accepted);
      console.log("Rejected Manufacturers:", rejected);

      setPendingManufacturers(pending);
      setAcceptedManufacturers(accepted);
      setRejectedManufacturers(rejected);
    };

    loadManufacturers();
  }, []);

  // Handle View button click
  const handleView = async (id) => {
    const data = await fetchManufacturerDetails(id);
    setSelectedManufacturer(data);
    setShowWalletAddress(false); // Reset wallet address visibility when viewing a new manufacturer
  
    // Check website authenticity if website URL exists
    if (data.website_url) {
      checkWebsiteAuthenticity(data.website_url);
    } else {
      setAuthenticityScore(0); // Set score to 0% if no website URL
    }
  };




  const handleAcceptClick = async (id) => {
    await handleAccept(id, setAcceptedManufacturers, setPendingManufacturers);
    
  };











  const handleReject = async (manufacturer) => {
    console.log("📌 handleReject called with:", manufacturer);
  
    if (!manufacturer || !manufacturer.manufacturer_id) {
      console.error("❌ Invalid manufacturer data - missing manufacturer_id:", manufacturer);
      return;
    }
  
    // Set the selected manufacturer and open the reject dialog
    setSelectedManufacturer(manufacturer);
    setRejectDialogOpen(true);
  };

  // Handle Reject Dialog Submit
  const handleRejectSubmit = async () => {
    if (!selectedManufacturer) return;
  
    // Call the API to reject the manufacturer
    const result = await rejectManufacturer(selectedManufacturer.manufacturer_id, rejectComment);
  
    if (result) {
      console.log("✅ Manufacturer rejected:", result);
  
      // Update the rejected manufacturers list
      setRejectedManufacturers((prev) => [
        ...prev,
        { ...selectedManufacturer, status: "rejected" },
      ]);
  
      // Remove the manufacturer from the pending list
      setPendingManufacturers((prev) =>
        prev.filter((m) => m.manufacturer_id !== selectedManufacturer.manufacturer_id)
      );
  
      // Close the reject dialog and reset the comment
      setRejectDialogOpen(false);
      setRejectComment("");
  
      // Go back to the main table
      setSelectedManufacturer(null);
    } else {
      console.error("❌ Failed to update manufacturer status");
    }
  };


  const checkWebsiteAuthenticity = async (websiteUrl) => {
    try {
      const response = await axios.post("/api/genai/authenticmedicinewebsite", {
        website: websiteUrl,
      });
      const { probability } = response.data;
      setAuthenticityScore(parseInt(probability, 10)); // Convert probability to a number
    } catch (error) {
      // Do not log the error to the console
      setAuthenticityScore(0); // Set score to 0% on error
    }
  };

  

  // Reset selected manufacturer when switching sections
  const handleListItemClick = (section) => {
    setActiveSection(section);
    setSelectedManufacturer(null); // Reset view details when switching sections
    setSidebarVisible(false); // Close sidebar after selection
  };

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Toggle wallet address visibility
  const toggleWalletAddressVisibility = () => {
    setShowWalletAddress((prev) => !prev);
  };

  const adminDetails = {
    name: "Admin User",
    experience: "5 years",
    role: "Administrator",
  };






  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f0f0f0",
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
        {/* Left Side: Menu Icon and Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Menu Button (Inside Navbar) */}
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

          {/* Navigation Links */}
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">Contact Us</Typography>
          <Typography variant="body1">About Us</Typography>
        </Box>

        {/* Right Side: Logo & Website Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
          <Typography variant="h6" sx={{ ml: 1 }}>
            MediCare
          </Typography>
        </Box>
      </Box>

      {/* Sidebar (Appears Below Navbar) */}
      <Box
        sx={{
          position: "fixed",
          top: "60px",
          left: sidebarVisible ? 0 : "-250px",
          width: "250px",
          height: "calc(100vh - 60px)",
          bgcolor: "#ffffff",
          borderRight: "1px solid #dee2e6",
          transition: "left 0.3s ease-in-out",
          zIndex: 1400,
          boxShadow: sidebarVisible
            ? "2px 0px 10px rgba(0, 0, 0, 0.2)"
            : "none",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Sidebar Content */}
        <Typography
          variant="h6"
          sx={{ p: 2, fontWeight: "bold", color: "#016A70" }}
        >
          Admin Panel
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleListItemClick("acceptedManufacturers")}
              sx={{ "&:hover": { bgcolor: "#B2EBF2" } }}
            >
              <ListItemText primary="Accepted Manufacturers" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleListItemClick("rejectedManufacturers")}
              sx={{ "&:hover": { bgcolor: "#B2EBF2" } }}
            >
              <ListItemText primary="Rejected Manufacturers" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleListItemClick("pendingManufacturers")}
              sx={{ "&:hover": { bgcolor: "#B2EBF2" } }}
            >
              <ListItemText primary="Pending Manufacturers" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: "80px 20px 20px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
        }}
      >
        {/* Admin Details Section */}
        <Box
          sx={{
            bgcolor: "#E0F7FA",
            padding: "15px",
            borderRadius: "8px",
            display: "flex",
            height: "150px",
            border: "1px solid #81D4FA",
          }}
        >
          <Box sx={{ width: "200px", mr: 2 }}>
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
              Experience: {adminDetails.experience}
            </Typography>
            <Typography variant="body1" color="#1E88E5">
              Role: {adminDetails.role}
            </Typography>
          </Box>
          <Image
            src="/LALA.GPG.jpg"
            alt="Admin"
            width={120}
            height={120}
            style={{ objectFit: "contain", marginLeft: "auto" }}
          />
        </Box>

        {/* Table Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, color: "#016A70" }}>
            {activeSection === "acceptedManufacturers"
              ? "Accepted Manufacturers"
              : activeSection === "rejectedManufacturers"
              ? "Rejected Manufacturers"
              : "Pending Manufacturers"}
          </Typography>

          {/* Show View Table ONLY if selected */}
          {/* Show View Table ONLY if selected */}
          {selectedManufacturer ? (
  <Box>
    {/* Back Button */}
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setSelectedManufacturer(null)} // Reset selected manufacturer
        sx={{ color: "white", borderColor: "white" }}
      >
        Back
      </Button>
    </Box>

    {/* Details Table */}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, border: "1px solid #ddd" }} aria-label="simple table">
        <TableBody>
          {Object.entries(selectedManufacturer).map(([key, value]) => {
            // Skip rendering the row if the key is "manufacturer_id" or "wallet_address"
            if (key === "manufacturer_id" || key === "wallet_address") return null;

            // Skip rendering the "rejection_comments" row if the manufacturer is not rejected
            if (key === "rejection_comments" && selectedManufacturer.status !== "rejected") return null;

            return (
              <TableRow key={key}>
                <TableCell sx={{ padding: "16px" }}>
                  {columnNameMapping[key] || key} {/* Use mapped name or fallback to raw key */}
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  {key === "website_url" ? (
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
                  ) : key === "certification_url" ? (
                    <Button onClick={() => window.open(value, "_blank")} sx={{ color: "#016A70" }}>
                      View
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
                    value
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {/* Add Website Authenticity Row */}
          <TableRow>
            <TableCell sx={{ padding: "16px" }}>Website Authenticity</TableCell>
            <TableCell sx={{ padding: "16px" }}>
              {authenticityScore !== null ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={authenticityScore}
                    sx={{ width: "100%", height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2">{authenticityScore}%</Typography>
                </Box>
              ) : (
                "N/A"
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 650,
                  border: "1px solid #016A70",
                  color: "#016A70",
                }}
                aria-label="simple table"
              >
                <TableHead sx={{ bgcolor: "#016A70" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "16px",
                        color: "white",
                        borderBottom: "1px solid white",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "16px",
                        color: "white",
                        borderBottom: "1px solid white",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "16px",
                        color: "white",
                        borderBottom: "1px solid white",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "16px",
                        color: "white",
                        borderBottom: "1px solid white",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(activeSection === "acceptedManufacturers"
                    ? acceptedManufacturers
                    : activeSection === "rejectedManufacturers"
                    ? rejectedManufacturers
                    : pendingManufacturers
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: "center", color: "#016A70" }}
                      >
                        No manufacturers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (activeSection === "acceptedManufacturers"
                      ? acceptedManufacturers
                      : activeSection === "rejectedManufacturers"
                      ? rejectedManufacturers
                      : pendingManufacturers
                    ).map((manufacturer) => (
                      <TableRow
                        key={manufacturer.manufacturer_id}
                        sx={{ "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" } }}
                      >
                        <TableCell sx={{ padding: "16px", color: "#016A70" }}>
                          {manufacturer.manufacturer_id}
                        </TableCell>
                        <TableCell sx={{ padding: "16px", color: "#016A70" }}>
                          {manufacturer.name}
                        </TableCell>
                        <TableCell sx={{ padding: "16px", color: "#016A70" }}>
                          {manufacturer.status}
                        </TableCell>
                        <TableCell sx={{ padding: "16px" }}>
                          <Button
                            onClick={() =>
                              handleView(manufacturer.manufacturer_id)
                            }
                            sx={{ color: "#016A70" }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
           {selectedManufacturer && selectedManufacturer.status === "pending" && (
              <Box sx={{ textAlign: "center", padding: "16px" }}>
                <Button
                  size="small"
                  onClick={() => {
                    console.log("🟢 Clicked Accept Button!");
                    console.log("🔹 Manufacturer ID:", selectedManufacturer?.manufacturer_id);
                    console.log("🔹 Full Manufacturer Object:", selectedManufacturer);
                
                    handleAccept(
                      selectedManufacturer.manufacturer_id,
                      setAcceptedManufacturers,
                      setPendingManufacturers,
                      selectedManufacturer // Pass the full manufacturer object
                    );
                  }}
                  sx={{ color: "white", mr: 2 }}
                >
                
                  
                  Accept
                </Button>
                {/* <Button
                  size="small"
                  onClick={() => handleAccept(
                    manufacturer.manufacturer_id, 
                    setAcceptedManufacturers, 
                    setPendingManufacturers, 
                    manufacturer // Pass the full manufacturer object
                  )}
                  sx={{ color: "#016A70" }}
                >
                  Accept
                </Button> */}
                <Button
                  size="small"
                  onClick={() => handleReject(selectedManufacturer)}
                  sx={{ color: "white" }}
                >
                  Reject
                </Button>
              </Box>
            )}
        </Box>
      </Box>


      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Add Rejection Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment (Optional)"
            fullWidth
            variant="outlined"
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
