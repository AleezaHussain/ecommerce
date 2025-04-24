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
import { useRouter } from "next/navigation";

import { 
  addMedicineToSale , 
  updateSaleMedicine , 
  removeMedicineFromSale ,
  fetchSaleMedicinesByWallet,
  fetchAllMedicineTypes ,
} from '../../../lib/saleMedicineDb';
import { fetchMedicinesByManufacturerAndStatus } from "../testingblockchain/medicinework/walletmedicine/fetch";
import { ethers } from "ethers";
import NavBar from "../components/NavBar";

const ManufacturerDashboard = () => {
  const [activeView, setActiveView] = useState("statistics"); // 'statistics' or 'medicines'
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
  const router = useRouter();
  // With this:
const [walletStatus, setWalletStatus] = useState({
  connected: false,
  approved: false,
  loading: true,
  address: "" // Add address field
});
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

  const handleViewChange = (event, newValue) => {
    setActiveView(newValue);
  };
  const handleLogout = () => {
    // Clear any session data if needed
    setWalletStatus({
      connected: false,
      approved: false,
      loading: false,
      address: ""
    });
    setManufacturerDetails({
      name: "",
      licenseNo: "",
      certificate: ""
    });
    
    // Redirect to manufacturer login
    router.push('/manufacturerlogin');
  };


  // Detect wallet address on component mount
  useEffect(() => {
    const detectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          
          // Verify manufacturer approval
          const isApproved = await fetchManufacturerDetails(address);
          
          setWalletStatus({
            connected: true,
            approved: isApproved,
            loading: false,
            address: address
          });
        } catch (error) {
          console.error("Error detecting wallet:", error);
          setWalletStatus({
            connected: false,
            approved: false,
            loading: false,
            address: ""
          });
        }
      } else {
        setWalletStatus({
          connected: false,
          approved: false,
          loading: false,
          address: ""
        });
      }
    };
  
    detectWallet();
  }, []);


  const fetchManufacturerDetails = async (address) => {
    try {
      const approvedManufacturers = await getApprovedManufacturers();
      const manufacturer = approvedManufacturers.find(
        m => m.walletAddress && m.walletAddress.toLowerCase() === address.toLowerCase()
      );
  
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
  
      return true;
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
      // Remove this line: setWalletAddress("");
      return false;
    }
  };

  // Fetch medicines when wallet address changes
  // With this:
useEffect(() => {
  if (walletStatus.approved && walletStatus.address) {
    fetchAllMedicines();
  }
}, [walletStatus.approved, walletStatus.address]);

  // In the useEffect for initial data loading:
  useEffect(() => {
    const fetchInitialData = async () => {
      if (walletStatus.address) {
        try {
          const sales = await fetchSaleMedicinesByWallet(walletStatus.address);
          setSalesData(sales);
        } catch (error) {
          console.error('Error fetching sale medicines:', error);
        }
      }
    };
    fetchInitialData();
  }, [walletStatus.address]);


  // For example, in fetchAllMedicines:
const fetchAllMedicines = async () => {
  if (!walletStatus.address || !walletStatus.approved) {
    setErrorMsg({ open: true, message: "Wallet not connected or not approved" });
    return;
  }

  try {
    setLoading({
      pending: true,
      accepted: true,
      rejected: true
    });

    const { pending, accepted, rejected } = await fetchMedicinesByManufacturerAndStatus(walletStatus.address);
    
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
  if (!walletStatus.address) return;  {/* Changed from !walletAddress */}
  
  setLoading(prev => ({ ...prev, pending: true }));
  try {
    const { pending } = await fetchMedicinesByManufacturerAndStatus(walletStatus.address);  {/* Changed from walletAddress */}
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

  const confirmSale = async () => {
    if (selectedMedicine && walletStatus.address) {
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

        // Add to database with all medicine data including excipients
        const newSaleItem = await addMedicineToSale({
          ...selectedMedicine,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 1,
          walletAddress: walletStatus.address,
          excipients: selectedMedicine.excipients || selectedMedicine.ingredients || []
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
    } else if (!walletStatus.address) {
      setErrorMsg({
        open: true,
        message: "Wallet not connected. Please connect your wallet first."
      });
    }
  };

  // Update handleRemoveFromSale function
  const handleRemoveFromSale = async (saleToRemove) => {
    try {
      await removeMedicineFromSale(saleToRemove.medicine_id, walletStatus.address);
      setSalesData(salesData.filter(sale => sale.medicine_id !== saleToRemove.medicine_id));
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

  const handleSaveChanges = async () => {
    try {
      const updates = {
        price: parseFloat(price),
        quantity: parseInt(quantity) || 1
      };

      // Update in database
      await updateSaleMedicine(selectedMedicine.medicine_id, updates, walletStatus.address);

      // Update local state
      const updatedSales = salesData.map(sale => 
        sale.medicine_id === selectedMedicine.medicine_id 
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

  const MedicineDetailsModal = ({ 
    open, 
    onClose, 
    medicine, 
    onAddToSale, 
    showSaleButton = false,
    isInSales = false
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
          backgroundColor: "#ffffff",
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
                isInSales={isInSales}
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
      backgroundColor: "#f5f7fa",
      position: 'relative',
    }}>
      {/* Main Content - will be blurred when wallet is not approved */}
      <Box sx={{
        filter: !walletStatus.loading && !walletStatus.approved ? 'blur(5px)' : 'none',
        pointerEvents: !walletStatus.loading && !walletStatus.approved ? 'none' : 'auto',
        width: '100%',
        height: '100%',
        transition: 'filter 0.3s ease'
      }}>
        <NavBar 
  walletStatus={walletStatus} 
  manufacturerDetails={manufacturerDetails}
  onLogout={() => {
    // Clear any session data if needed
    router.push('/manufacturerlogin');
  }}
/>
        {/* Secondary Navigation */}
        <Box sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: '115px', // Height of NavBar
          zIndex: 1100
        }}>
          <Tabs
            value={activeView}
            onChange={handleViewChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: '#1976d2'
              }
            }}
          >
            <Tab 
              label="Statistics" 
              value="statistics" 
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'unset',
                padding: '12px 24px',
                color: activeView === 'statistics' ? '#1976d2' : '#555'
              }}
            />
            <Tab 
              label="Medicines by Status" 
              value="medicines" 
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'unset',
                padding: '12px 24px',
                color: activeView === 'medicines' ? '#1976d2' : '#555'
              }}
            />
          </Tabs>
        </Box>

        
        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          padding: '30px',
          maxWidth: '1600px',
          margin: '100px auto 0px auto',
          width: '100%',
          
        }}>
          {activeView === 'statistics' ? (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: '24px',
              mb: '10px'
            }}>
              <AcceptedMedicinesChart data={acceptedMedicines} />
              <PendingMedicinesChart data={pendingMedicines} />
              <RejectedMedicinesChart data={rejectedMedicines} />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                mb: 3
              }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      height: 3,
                      backgroundColor: '#1976d2'
                    }
                  }}
                >
                  <Tab
                    label="Pending Medicines"
                    value="pending"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'unset',
                      padding: '12px 24px',
                      color: activeTab === 'pending' ? '#1976d2' : '#555'
                    }}
                  />
                  <Tab
                    label="Accepted Medicines"
                    value="accepted"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'unset',
                      padding: '12px 24px',
                      color: activeTab === 'accepted' ? '#1976d2' : '#555'
                    }}
                  />
                  <Tab
                    label="Rejected Medicines"
                    value="rejected"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'unset',
                      padding: '12px 24px',
                      color: activeTab === 'rejected' ? '#1976d2' : '#555'
                    }}
                  />
                  <Tab
                    label="Sales"
                    value="sales"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'unset',
                      padding: '12px 24px',
                      color: activeTab === 'sales' ? '#1976d2' : '#555'
                    }}
                  />
                </Tabs>

                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={handleOpenModal}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                >
                  Add Medicine
                </Button>
              </Box>


            {/* Medicine Cards */}
            {loading.wallet ? (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
    <CircularProgress />
  </Box>
            ) : !walletStatus.address ? (
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
        )}
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
      
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            width: "90%", 
            maxWidth: "900px",
            maxHeight: "60vh",
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
    top: "59.5%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    width: 400,
    bgcolor: "background.paper", 
    boxShadow: 24, 
    p: 3,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    zIndex: 1000,
    maxHeight: "90vh", // Reduced from 80% to 60vh
    overflow: "auto", // Add scroll if content exceeds height
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
            height="140" // Reduced from 150
            image={`https://ipfs.io/ipfs/${selectedMedicine.uploadedFiles[0].ipfsHash}`} 
            alt={selectedMedicine.name} 
            sx={{ 
              objectFit: "contain", 
              width: "100%", 
              mb: 1, // Reduced from mb: 2
              maxHeight: 150 // Reduced from 200
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
                  onClick={handleSaveChanges}
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
      
      {(!walletStatus.loading && !walletStatus.approved) && (
  <Box sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    p: 3
  }}>
    <LockIcon sx={{ fontSize: 80, mb: 3, color: 'white' }} />
    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
      Access Denied
    </Typography>
    {walletStatus.connected ? (
      <>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Your manufacturer account is not approved
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', mb: 4 }}>
          The connected wallet is not registered as an approved manufacturer.
          Please contact the administrator if you believe this is an error.
        </Typography>
      </>
    ) : (
      <>
        <Typography variant="h6" sx={{ mb: 3 }}>
          No approved wallet connected
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', mb: 4 }}>
          Please connect an approved manufacturer wallet to access this dashboard.
        </Typography>
      </>
    )}
    <Button 
      variant="contained" 
      color="primary"
      onClick={() => router.push('/manufacturerlogin')}
      sx={{ mt: 2 }}
    >
      Go to Login
    </Button>
  </Box>
)}

    </Box>
  );
};

export default ManufacturerDashboard;