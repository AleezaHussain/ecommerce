"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import InputAdornment from "@mui/material/InputAdornment";
import LockIcon from '@mui/icons-material/Lock';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from "@mui/icons-material/Add";
import MedicineForm from '../medicineregistration/page';
import { SuccessMsgBox, ErrorMsgBox, InfoMsgBox } from '../components/MsgBox';
import AcceptedMedicinesChart from './AcceptedMedicinesChart';
import PendingMedicinesChart from './PendingMedicinesChart';
import RejectedMedicinesChart from './RejectedMedicinesChart';
import { handleSubmit } from '../testpage3/formsubmit';
import PendingMedicineCards from './PendingMedicineCards';
import AcceptedMedicineCards from './AcceptedMedicineCards';
import RejectedMedicineCards from './RejectedMedicineCards';
import SaleMedicineCards from './SaleMedicineCards';
import { fetchMedicinesByStatus } from '../testingblockchain/medicinework/accepted-rejected/fetch';
import MedicineDetails from './MedicineDetails';
import { getApprovedManufacturers } from "../testingblockchain/accepted-rejected-manufacturer/fetch";

import { 
  addMedicineToSale, 
  updateSaleMedicine, 
  removeMedicineFromSale,
  fetchAllSaleMedicines
} from '../../../lib/saleMedicineDb';
import { fetchMedicinesByManufacturerAndStatus } from "../testingblockchain/medicinework/walletmedicine/fetch";
import { ethers } from "ethers";
import NavBar from "../components/NavBar";
const ManufacturerDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);  
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState({ open: false, message: "" });
  const [errorMsg, setErrorMsg] = useState({ open: false, message: "" });
  const [infoMsg, setInfoMsg] = useState({ open: false, message: "" });
  const [pendingMedicines, setPendingMedicines] = useState([]);
  const [acceptedMedicines, setAcceptedMedicines] = useState([]);
  const [rejectedMedicines, setRejectedMedicines] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [manufacturerDetails, setManufacturerDetails] = useState({
    name: "",
    licenseNo: "",
    certificate: ""
  });
  const [loading, setLoading] = useState({
    pending: false,
    accepted: false,
    rejected: false,
    wallet: true
  });

  // Detect wallet address on component mount
  useEffect(() => {
    // Update the detectWallet function in useEffect
const detectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // First verify the manufacturer is approved
      await fetchManufacturerDetails(address);
      
      // Only set wallet address if verification passed
      setWalletAddress(address);
    } catch (error) {
      console.error("Error detecting wallet:", error);
      setErrorMsg({ 
        open: true, 
        message: error.message || "Failed to connect wallet" 
      });
    } finally {
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  } else {
    setLoading(prev => ({ ...prev, wallet: false }));
    setErrorMsg({ 
      open: true, 
      message: "MetaMask not detected. Please install MetaMask." 
    });
  }
};

    detectWallet();
  }, []);

  const fetchManufacturerDetails = async (address) => {
    try {
      // Fetch all approved manufacturers from blockchain
      const approvedManufacturers = await getApprovedManufacturers();
      console.log("Approved manufacturers:", approvedManufacturers); // Debug log
      
      // Find the manufacturer with matching wallet address
      const manufacturer = approvedManufacturers.find(
        m => m.walletAddress && m.walletAddress.toLowerCase() === address.toLowerCase()
      );
  
      console.log("Found manufacturer:", manufacturer); // Debug log
  
      if (!manufacturer) {
        throw new Error("Your account is not approved as a manufacturer");
      }
  
      setManufacturerDetails({
        name: manufacturer.manufacturerName || "Not available",
        licenseNo: manufacturer.licenceNo || "Not available",
        certificate: manufacturer.pdfCID ? `https://ipfs.io/ipfs/${manufacturer.pdfCID}` : "",
        certificationNumber: manufacturer.certificationNumber || "Not available",
        dateOfIssue: manufacturer.dateOfIssue || "Not available",
        email: manufacturer.email || "Not available",
        phoneNumber: manufacturer.phoneNumber || "Not available",
        physicalAddress: manufacturer.physicalAddress || "Not available",
        website: manufacturer.website || "Not available"
      });
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
      setErrorMsg({ 
        open: true, 
        message: error.message || "Failed to fetch manufacturer details" 
      });
      
      // If there's an error (including not being approved), reset wallet address
      setWalletAddress("");
    }
  };


  // Fetch medicines when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchAllMedicines();
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sales = await fetchAllSaleMedicines();
        setSalesData(sales);
      } catch (error) {
        console.error('Error fetching sale medicines:', error);
      }
    };
    fetchInitialData();
  }, []);

  
//   // Add this useEffect to redirect or show error if wallet is not approved
// useEffect(() => {
//   {/* Wallet Rejection Overlay */}
// {!loading.wallet && !walletAddress && (
//   <Box sx={{
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     zIndex: 2000,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: 'white',
//     backdropFilter: 'blur(4px)'
//   }}>
//     <LockIcon sx={{ fontSize: 80, mb: 3 }} />
//     <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
//       Access Denied
//     </Typography>
//     <Typography variant="body1" sx={{ maxWidth: '600px', textAlign: 'center', mb: 3 }}>
//       Your account is not approved as a manufacturer or has been rejected by the admin.
//       Please contact the administrator if you believe this is an error.
//     </Typography>
//     <Button 
//       variant="contained" 
//       color="error"
//       onClick={() => window.location.reload()}
//       sx={{ mt: 2 }}
//     >
//       Refresh Page
//     </Button>
//   </Box>
// )}
// }, [loading.wallet, walletAddress]);
 

  // Fetch medicines when tab changes
  useEffect(() => {
    if (walletAddress) {
      if (activeTab === 'pending') {
        fetchPendingMedicines();
      } else if (activeTab === 'accepted') {
        fetchAcceptedMedicines();
      } else if (activeTab === 'rejected') {
        fetchRejectedMedicines();
      }
    }
  }, [activeTab, walletAddress]);

  // Update fetchAllMedicines and other fetch functions to include this check
const fetchAllMedicines = async () => {
  if (!walletAddress) {
    setErrorMsg({ open: true, message: "Wallet not connected or not approved" });
    return;
  }

  try {
    setLoading({
      pending: true,
      accepted: true,
      rejected: true
    });

    const { pending, accepted, rejected } = await fetchMedicinesByManufacturerAndStatus(walletAddress);
    
    setPendingMedicines(pending);
    setAcceptedMedicines(accepted);
    setRejectedMedicines(rejected);

  } catch (error) {
    console.error('Error fetching medicines:', error);
    setErrorMsg({ open: true, message: 'Failed to fetch medicines' });
  } finally {
    setLoading({
      pending: false,
      accepted: false,
      rejected: false
    });
  }
};

  const fetchPendingMedicines = async () => {
    if (!walletAddress) return;
    
    setLoading(prev => ({ ...prev, pending: true }));
    try {
      const { pending } = await fetchMedicinesByManufacturerAndStatus(walletAddress);
      setPendingMedicines(pending);
    } catch (error) {
      console.error('Error fetching pending medicines:', error);
      setErrorMsg({ open: true, message: 'Failed to fetch pending medicines' });
    } finally {
      setLoading(prev => ({ ...prev, pending: false }));
    }
  };

  const fetchAcceptedMedicines = async () => {
    if (!walletAddress) return;
    
    setLoading(prev => ({ ...prev, accepted: true }));
    try {
      const { accepted } = await fetchMedicinesByManufacturerAndStatus(walletAddress);
      setAcceptedMedicines(accepted);
    } catch (error) {
      console.error('Error fetching accepted medicines:', error);
      setErrorMsg({ open: true, message: 'Failed to fetch accepted medicines' });
    } finally {
      setLoading(prev => ({ ...prev, accepted: false }));
    }
  };

  const fetchRejectedMedicines = async () => {
    if (!walletAddress) return;
    
    setLoading(prev => ({ ...prev, rejected: true }));
    try {
      const { rejected } = await fetchMedicinesByManufacturerAndStatus(walletAddress);
      setRejectedMedicines(rejected);
    } catch (error) {
      console.error('Error fetching rejected medicines:', error);
      setErrorMsg({ open: true, message: 'Failed to fetch rejected medicines' });
    } finally {
      setLoading(prev => ({ ...prev, rejected: false }));
    }
  };

  const handleEditClick = (medicine) => {
    setSelectedMedicine(medicine);
    setPrice(medicine.price ? medicine.price.toString() : "0");
    setQuantity(medicine.quantity ? medicine.quantity.toString() : "1");
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMedicine(null);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddMedicine = async (medicineData) => {
    try {
      setInfoMsg({ open: true, message: "Please confirm transaction in MetaMask..." });
      
      const syntheticEvent = { preventDefault: () => {} };
      const dummySetMedicine = () => {};
      
      await handleSubmit(syntheticEvent, medicineData, dummySetMedicine);
      
      setSuccessMsg({ open: true, message: "✅ Medicine registration submitted successfully!" });
      handleCloseModal();
      fetchPendingMedicines();
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg({ open: true, message: error.message || "❌ Failed to register medicine" });
    } finally {
      setInfoMsg({ open: false, message: "" });
    }
  };

  const handleCardClick = (medicine) => {
    setSelectedMedicine(medicine);
    setDetailsModalOpen(true);
  };

  const handleOpenSaleModal = (medicine) => {
    setSelectedMedicine(medicine);
    setPrice(medicine.price || 0);
    setQuantity(medicine.quantity || 1);
    setSaleModalOpen(true);
  };

  const handleCloseSaleModal = () => {
    setSaleModalOpen(false);
    setSelectedMedicine(null);
  };

  // Update the confirmSale function
const confirmSale = async () => {
  if (selectedMedicine) {
    try {
      // Check if already in sales
      const isAlreadyInSales = salesData.some(
        sale => sale.medicine_id === selectedMedicine.tokenId
      );

      if (isAlreadyInSales) {
        setErrorMsg({ 
          open: true, 
          message: "This medicine is already in sale!" 
        });
        return;
      }

      // Add to database
      const newSaleItem = await addMedicineToSale({
        ...selectedMedicine,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 1
      });

      // Update local state
      setSalesData([...salesData, newSaleItem]);
      setSaleModalOpen(false);
      setSelectedMedicine(null);
      setSuccessMsg({ 
        open: true, 
        message: "Medicine added to Sale successfully!" 
      });
    } catch (error) {
      console.error('Error adding to sale:', error);
      setErrorMsg({ 
        open: true, 
        message: error.message || "Failed to add medicine to sale" 
      });
    }
  }
};


// Update handleRemoveFromSale function
const handleRemoveFromSale = async (saleToRemove) => {
  try {
    await removeMedicineFromSale(saleToRemove.tokenId);
    setSalesData(salesData.filter(sale => sale.medicine_id !== saleToRemove.tokenId));
    setSuccessMsg({ 
      open: true, 
      message: "Medicine removed from sale successfully!" 
    });
  } catch (error) {
    console.error('Error removing from sale:', error);
    setErrorMsg({
      open: true,
      message: error.message || "Failed to remove medicine from sale"
    });
  }
};

  const handleEditSale = (sale) => {
    setSelectedMedicine(sale);
    setEditModalOpen(true);
  };

  // Update handleSaveChanges function
const handleSaveChanges = async () => {
  try {
    const updates = {
      price: parseFloat(price),
      quantity: parseInt(quantity) || 1
    };

    // Update in database
    await updateSaleMedicine(selectedMedicine.tokenId, updates);

    // Update local state
    const updatedSales = salesData.map(sale => 
      sale.medicine_id === selectedMedicine.tokenId 
        ? { ...sale, ...updates } 
        : sale
    );
    
    setSalesData(updatedSales);
    handleCloseEditModal();
    setSuccessMsg({ open: true, message: "Sale details updated successfully!" });
  } catch (error) {
    console.error("Error updating sale details:", error);
    setErrorMsg({ open: true, message: "Failed to update sale details" });
  }
};

  // In ManufacturerDashboard.js
// In ManufacturerDashboard.js
const MedicineDetailsModal = ({ 
  open, 
  onClose, 
  medicine, 
  onAddToSale, 
  showSaleButton = false,
  isInSales = false  // Add this prop
}) => {
  if (!medicine) return null;

  const handleAddToSaleClick = () => {
    onClose();
    onAddToSale(medicine);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: "absolute", 
        top: "55%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        width: "80%", 
        maxWidth: "800px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: 24, 
        p: 4, 
        borderRadius: 2,
        backgroundColor: "#ffffff", // Pure white background
      }}>
        {/* Close button (X) in top right corner */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {medicine.uploadedFiles?.length > 0 && (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                image={`https://ipfs.io/ipfs/${medicine.uploadedFiles[0].ipfsHash}`}
                alt={medicine.name}
                sx={{ 
                  maxHeight: "300px", 
                  width: "auto", 
                  objectFit: "contain",
                  borderRadius: "8px"
                }}
              />
            </Box>
          )}
          <Box sx={{ flex: 2 }}>
          <MedicineDetails 
        medicine={medicine} 
        onAddToSale={handleAddToSaleClick}
        showSaleButton={showSaleButton}
        isInSales={isInSales}  // Pass the prop
      />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

return (
  <Box sx={{ 
    display: "flex", 
    flexDirection: "column", 
    minHeight: "100vh", 
    fontFamily: "sans-serif", 
    backgroundColor: "#ADD8E6",
    position: 'relative',
    
  }}>
      <NavBar/>
      {/* Manufacturer Details Section */}
<Box sx={{ 
  mt: "80px", 
  p: 3, 
  backgroundColor: "#FFFFFF", 
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  mb: 3
}}>
  <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Manufacturer Details</Typography>
  
  {loading.wallet ? (
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
  ) : !walletAddress ? null : (  // Removed the error message here since we have overlay
    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, 
      gap: 3 
    }}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Manufacturer Name:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.name}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Wallet Address:</Typography>
        <Typography variant="body1" sx={{ 
          fontFamily: "monospace",
          wordBreak: "break-word"
        }}>
          {walletAddress}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>License Number:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.licenseNo}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Certification Number:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.certificationNumber}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Date of Issue:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.dateOfIssue}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Email:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.email}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Phone Number:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.phoneNumber}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Physical Address:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.physicalAddress}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Website:</Typography>
        <Typography variant="body1">
          {manufacturerDetails.website}
        </Typography>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Certificate:</Typography>
        {manufacturerDetails.certificate ? (
          <Button 
            variant="outlined" 
            sx={{ mt: 1 }}
            onClick={() => window.open(manufacturerDetails.certificate, '_blank')}
          >
            View Certificate
          </Button>
        ) : (
          <Typography variant="body1">No certificate available</Typography>
        )}
      </Box>
    </Box>
  )}
</Box>


      {/* Main Content */}
      <Box sx={{ flex: 1, paddingTop: "80px", paddingBottom: "20px", display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        {/* Graph Boxes */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, padding: "0 20px", marginBottom: "20px" }}>
          <AcceptedMedicinesChart data={acceptedMedicines} />
          <PendingMedicinesChart data={pendingMedicines} />
          <RejectedMedicinesChart data={rejectedMedicines} />
        </Box>

        {/* Tabs for Medicines */}
        <Box sx={{ mt: 2, padding: "0 20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
            >
              <Tab
                label="Pending Medicines"
                value="pending"
                sx={{
                  fontSize: "1rem",
                  padding: "12px 24px",
                  color: "#000000",
                  fontWeight: activeTab === "pending" ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
              <Tab
                label="Accepted Medicines"
                value="accepted"
                sx={{
                  fontSize: "1rem",
                  padding: "12px 24px",
                  color: activeTab === "accepted" ? "#4CAF50" : "#000000",
                  fontWeight: activeTab === "accepted" ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
              <Tab
                label="Rejected Medicines"
                value="rejected"
                sx={{
                  fontSize: "1rem",
                  padding: "12px 24px",
                  color: activeTab === "rejected" ? "#F44336" : "#000000",
                  fontWeight: activeTab === "rejected" ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
              <Tab
                label="Sales"
                value="sales"
                sx={{
                  fontSize: "1rem",
                  padding: "12px 24px",
                  color: activeTab === "sales" ? "#2196F3" : "#000000",
                  fontWeight: activeTab === "sales" ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
            </Tabs>

            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
              Add Medicine
            </Button>
          </Box>

          {/* Medicine Cards */}
          {loading.wallet ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : !walletAddress ? (
            <Typography sx={{ textAlign: "center", mt: 4 }}>
              Please connect your wallet to view medicines
            </Typography>
          ) : activeTab === "pending" ? (
            <PendingMedicineCards 
              medicines={pendingMedicines}
              loading={loading.pending}
              onCardClick={handleCardClick} 
            />
          ) : activeTab === "accepted" ? (
            <AcceptedMedicineCards 
              medicines={acceptedMedicines}
              loading={loading.accepted}
              onCardClick={handleCardClick} 
              onAddToSale={handleOpenSaleModal}
            />
          ) : activeTab === "rejected" ? (
            <RejectedMedicineCards 
              medicines={rejectedMedicines}
              loading={loading.rejected}
              onCardClick={handleCardClick} 
            />
          ) : (
            <SaleMedicineCards 
              sales={salesData.map(sale => ({
                ...sale,
                tokenId: sale.medicine_id,
                uploadedFiles: sale.image_url ? [{ ipfsHash: sale.image_url.replace('https://ipfs.io/ipfs/', '') }] : []
              }))} 
              onEditClick={handleEditSale}
              onRemoveFromSale={handleRemoveFromSale}
            />
          )}
        </Box>
      </Box>

      {/* Message Boxes */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          pointerEvents: "none",
        }}
      >
        <SuccessMsgBox
          open={successMsg.open}
          onClose={() => setSuccessMsg({ open: false, message: "" })}
          message={successMsg.message}
        />
        <ErrorMsgBox
          open={errorMsg.open}
          onClose={() => setErrorMsg({ open: false, message: "" })}
          message={errorMsg.message}
        />
        <InfoMsgBox
          open={infoMsg.open}
          onClose={() => setInfoMsg({ open: false, message: "" })}
          message={infoMsg.message}
        />
      </Box>  
      {/* Add this overlay right before the closing </Box> */}
    {!loading.wallet && !walletAddress && (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 3000, // Higher than other elements
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        backdropFilter: 'blur(4px)'
      }}>
        <LockIcon sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', textAlign: 'center', mb: 3 }}>
          Your account is not approved as a manufacturer or has been rejected by the admin.
          Please contact the administrator if you believe this is an error.
        </Typography>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Box>
    )}

    {/* Add this wrapper div to handle the blur and pointer events */}
    <Box sx={{
      filter: !loading.wallet && !walletAddress ? 'blur(2px)' : 'none',
      pointerEvents: !loading.wallet && !walletAddress ? 'none' : 'auto',
      width: '100%',
      height: '100%'
    }}>
</Box>
      

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ 
          position: "absolute", 
          top: "55%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          width: "90%", 
          maxWidth: "900px",
          maxHeight: "90vh",
          p: 0,
          borderRadius: 2,
          zIndex: 2000 
        }}>
          <MedicineForm 
            onSubmit={async (medicineData) => {
              try {
                await handleAddMedicine(medicineData);
              } catch (error) {
                console.error("Error:", error);
                setErrorMsg({ open: true, message: error.message || "❌ Failed to register medicine" });
              }
            }}
            onClose={handleCloseModal}
            initialValues={{
              certificate: "",
              name: "",
              medicineId: "",
              batchNumber: "",
              manufactureDate: "",
              expiryDate: "",
              excipients: [""],
              types: [],
              description: "",
              image: "",
              walletAddress: "",
            }}
          />
        </Box>
      </Modal>

      <Modal open={saleModalOpen} onClose={handleCloseSaleModal}>
  <Box sx={{ 
    position: "absolute", 
    top: "55%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    width: 400,
    bgcolor: "background.paper", 
    boxShadow: 24, 
    p: 3,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    zIndex: 1000
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h6">Confirm Sale</Typography>
      <IconButton onClick={handleCloseSaleModal} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
    
    {selectedMedicine && (
      <>
        {selectedMedicine.uploadedFiles?.length > 0 && (
          <CardMedia 
            component="img" 
            height="150"
            image={`https://ipfs.io/ipfs/${selectedMedicine.uploadedFiles[0].ipfsHash}`} 
            alt={selectedMedicine.name} 
            sx={{ 
              objectFit: "contain", 
              width: "100%", 
              mb: 2,
              maxHeight: 200
            }} 
          />
        )}
        
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Medicine:</strong> {selectedMedicine.name}
        </Typography>
        
        <TextField
          label="Price ($)"
          type="number"
          fullWidth
          margin="normal"
          size="small"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          size="small"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 1 }}
          inputProps={{ min: 1 }}
        />
        
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={confirmSale}
            sx={{ 
              py: 1,
              backgroundColor: "#4CAF50",
              '&:hover': {
                backgroundColor: "#388E3C"
              }
            }}
          >
            Confirm
          </Button>
        </Box>
      </>
    )}
  </Box>
</Modal>

<Modal open={editModalOpen} onClose={handleCloseEditModal}>
  <Box sx={{
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    zIndex: 1000
  }}>
    {/* Close button in top right corner */}
    <IconButton
      aria-label="close"
      onClick={handleCloseEditModal}
      sx={{
        position: 'absolute',
        right: 16,
        top: 16,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>

    <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
      Edit Sale Price
    </Typography>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {selectedMedicine?.uploadedFiles?.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CardMedia
            component="img"
            image={`https://ipfs.io/ipfs/${selectedMedicine.uploadedFiles[0].ipfsHash}`}
            alt={selectedMedicine.name}
            sx={{ 
              maxHeight: "130px",
              width: "auto",
              objectFit: "contain",
              borderRadius: "8px"
            }}
          />
        </Box>
      )}

      <Typography variant="body1" sx={{ textAlign: "center", mb: 0.5}}>
        <strong>{selectedMedicine?.name}</strong>
      </Typography>

      <TextField
        label="Price ($)"
        type="number"
        fullWidth
        size="small"
        margin="normal"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <TextField
        label="Quantity"
        type="number"
        fullWidth
        size="small"
        margin="normal"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        inputProps={{ min: 1 }}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={handleCloseEditModal}
          sx={{ py: 1 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSaveChanges}  // Changed from handleCloseEditModal to handleSaveChanges
          sx={{ 
            py: 1,
            backgroundColor: "#4CAF50",
            '&:hover': {
              backgroundColor: "#388E3C"
            }
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  </Box>
</Modal>

<MedicineDetailsModal
  open={detailsModalOpen}
  onClose={() => setDetailsModalOpen(false)}
  medicine={selectedMedicine}
  onAddToSale={handleOpenSaleModal}
  showSaleButton={activeTab === "accepted"}
  isInSales={selectedMedicine ? 
    salesData.some(sale => sale.tokenId === selectedMedicine.tokenId) : 
    false
  }
/>
    </Box>
  );
};

export default ManufacturerDashboard;