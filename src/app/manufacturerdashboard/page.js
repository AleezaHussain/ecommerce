"use client";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import MedicineForm from '../medicineregistration/page';

import { fetchPendingMedicines } from "../pendingmedicine/fetchfunction"; 



// Sample data for medicine uses
const medicineUses = {
  1: "Used to relieve pain and reduce fever.",
  2: "An antibiotic used to treat bacterial infections.",
  3: "A vitamin supplement to boost immunity.",
  4: "Used to relieve pain, inflammation, and fever.",
  5: "Used to relieve pain, fever, and inflammation.",
  6: "An antihistamine used to treat allergies.",
  7: "Used to relieve pain, inflammation, and fever.",
  8: "An antibiotic used to treat bacterial infections.",
  9: "Used to reduce pain, fever, and inflammation.",
  10: "An antihistamine used to treat allergies.",
};

// Medicine data for each tab with external image links
const medicinesData = {
  pending: [
    {
      id: 1,
      name: "Paracetamol",
      type: "Tablet",
      image: "/images/p.png",
      batchNumber: "BATCH-001",
      manufactureDate: "01/01/2023",
      expiryDate: "01/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 2,
      name: "Amoxicillin",
      type: "Antibiotic",
      image: "/images/han.png",
      batchNumber: "BATCH-002",
      manufactureDate: "02/01/2023",
      expiryDate: "02/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 3,
      name: "Vitamin C",
      type: "Capsule",
      image: "/images/c.webp",
      batchNumber: "BATCH-003",
      manufactureDate: "03/01/2023",
      expiryDate: "03/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 4,
      name: "Ibuprofen",
      type: "Tablet",
      image: "/images/j.png",
      batchNumber: "BATCH-004",
      manufactureDate: "04/01/2023",
      expiryDate: "04/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 5,
      name: "Aspirin",
      type: "Tablet",
      image: "/images/l.png",
      batchNumber: "BATCH-005",
      manufactureDate: "05/01/2023",
      expiryDate: "05/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 6,
      name: "Cetirizine",
      type: "Capsule",
      image: "/images/cet.jpg",
      batchNumber: "BATCH-006",
      manufactureDate: "06/01/2023",
      expiryDate: "06/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
  ],
  accepted: [
    {
      id: 5,
      name: "Aspirin",
      type: "Tablet",
      image: "/images/l.png",
      batchNumber: "BATCH-005",
      manufactureDate: "05/01/2023",
      expiryDate: "05/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 4,
      name: "Ibuprofen",
      type: "Tablet",
      image: "/images/j.png",
      batchNumber: "BATCH-004",
      manufactureDate: "04/01/2023",
      expiryDate: "04/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
  ],
  rejected: [
    {
      id: 9,
      name: "Aspirin",
      type: "Tablet",
      image: "https://via.placeholder.com/150",
      batchNumber: "BATCH-009",
      manufactureDate: "09/01/2023",
      expiryDate: "09/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
    {
      id: 10,
      name: "Cetirizine",
      type: "Capsule",
      image: "https://via.placeholder.com/150",
      batchNumber: "BATCH-010",
      manufactureDate: "10/01/2023",
      expiryDate: "10/01/2025",
      excipients: ["STARCH", "MAGNESIUM STEARATE", "TALC"],
    },
  ],
};

const acceptedData = [
  { name: "Drugs", value: 50, color: "#E91E63", unfilledColor: "#E0E0E0" },
  { name: "Capsules", value: 17, color: "#3357FF", unfilledColor: "#E0E0E0" },
  { name: "Tablets", value: 30, color: "#FFA500", unfilledColor: "#E0E0E0" },
  { name: "Antibiotics", value: 66, color: "#a812e3", unfilledColor: "#E0E0E0" },
];

const pendingData = JSON.parse(JSON.stringify([
  { name: "Capsules", Capsules: 10 },
  { name: "Tablets", Tablets: 20 },
  { name: "Antibiotics", Antibiotics: 15 },
  { name: "Drugs", Drugs: 25 },
]));

const rejectedData = [
  { name: "Capsules", value: 5, color: "#3357FF" },
  { name: "Tablets", value: 10, color: "#FFA500" },
  { name: "Antibiotics", value: 20, color: "#a812e3" },
  { name: "Drugs", value: 15, color: "#E91E63" },
];

const ManufacturerDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [openModal, setOpenModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", type: "", image: "" });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);  
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);




  // edited by aleeza
  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingMedicines().then(setPendingMedicines);
      console.log
    }
  }, [activeTab]); // Fetch pending medicines when the active tab changes






  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#ADD8E6", position: "relative" }}>
        <video autoPlay loop muted style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "absolute", top: 0, left: 0 }}>
          <source src="/color.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Typography variant="h4" sx={{ position: "relative", color: "white", fontWeight: "bold", zIndex: 1 }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  const handleEditClick = (medicine) => {
    setSelectedMedicine(medicine);
    setPrice(medicine.price || 0);  // If price exists, use it; otherwise, default to 0
    setQuantity(medicine.quantity || 1);  // If quantity exists, use it; otherwise, default to 1
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
  const handleAddMedicine = (medicine) => {
    if (medicine.name && medicine.type && medicine.image) {
      if (selectedMedicine) {
        // Update existing medicine in salesData
        const updatedSalesData = salesData.map((sale) =>
          sale.id === selectedMedicine.id ? { ...sale, ...medicine } : sale
        );
        setSalesData(updatedSalesData);
      } else {
        // Add new medicine to the active tab
        medicinesData[activeTab].push({
          id: medicinesData[activeTab].length + 1,
          ...medicine,
        });
      }
      setNewMedicine({ name: "", type: "", image: "" });
      setSelectedMedicine(null); // Reset selected medicine
      handleCloseModal();
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCardClick = (medicine) => {
    setSelectedMedicine(medicine);
    setDetailsModalOpen(true);
  };

  const handleOpenSaleModal = (medicine) => {
    setSelectedMedicine(medicine);
    setSaleModalOpen(true);
  };
  

  const handleCloseSaleModal = () => {
    setSaleModalOpen(false);
    setSelectedMedicine(null);
  };

  const confirmSale = () => {
    if (selectedMedicine) {
      setSalesData([...salesData, { ...selectedMedicine, saleDate: new Date().toLocaleDateString() }]);
      setSaleModalOpen(false);
      setSelectedMedicine(null);
    }
  };
  const handleEditSale = (sale) => {
    setSelectedMedicine(sale); // Set the selected medicine for editing
    setOpenModal(true); // Open the modal
  };

  const MedicineDetailsModal = ({ open, onClose, medicine }) => {
    if (!medicine) return null;

    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{ position: "absolute", top: "53%", left: "50%", transform: "translate(-50%, -50%)", width: 400, boxShadow: 24, p: 4, borderRadius: 2 , backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)"}}>
          <Typography variant="h6" sx={{ mb: 2 }}>{medicine.name}</Typography>
          <CardMedia
            component="img"
            height="200"
            image={medicine.image}
            alt={medicine.name}
            sx={{ objectFit: "contain", width: "100%", mb: 2 }}
          />
          <Typography variant="body1">Type: {medicine.type}</Typography>
          <Typography variant="body1">Medicine ID: {medicine.id}</Typography>
          <Typography variant="body1">Batch Number: {medicine.batchNumber || "N/A"}</Typography>
          <Typography variant="body1">Manufacture Date: {medicine.manufactureDate || "N/A"}</Typography>
          <Typography variant="body1">Expiry Date: {medicine.expiryDate || "N/A"}</Typography>
          <Typography variant="body1">Excipients: {medicine.excipients?.join(", ") || "N/A"}</Typography>
          <Button variant="contained" fullWidth onClick={onClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    );
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#ADD8E6" }}>
      {/* Navbar */}
      <Box sx={{ width: "100%", bgcolor: "#FFFFFF", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", top: 0, zIndex: 1500, height: "60px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar} sx={{ backgroundColor: "#FFFFDD", color: "#016A70", borderRadius: "50%", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">Contact Us</Typography>
          <Typography variant="body1">About Us</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/healthcare (1).png" alt="Logo" width={50} height={50} />
          <Typography variant="h6" sx={{ ml: 1 }}>MediCare</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, paddingTop: "80px", paddingBottom: "20px", display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        {/* Graph Boxes */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, padding: "0 20px", marginBottom: "20px" }}>
          {/* Accepted Medicines - Multi-Ring Donut Chart */}
          <Box
            sx={{
              padding: '15px',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
              flex: 1,
              backdropFilter: "blur(25px) ",
              WebkitBackdropFilter: "blur(25px) saturate(180%)",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", color: "#000000" }}>Accepted Medicines</Typography>
            {isClient && (
              <PieChart width={200} height={200}>
                {acceptedData.map((category, index) => (
                  <Pie
                    key={category.name}
                    data={[
                      { name: category.name, value: category.value },
                      { name: "Remaining", value: 100 - category.value },
                    ]}
                    cx={100}
                    cy={100}
                    innerRadius={30 + index * 15}
                    outerRadius={45 + index * 15}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill={category.color} stroke="white" strokeWidth={3} />
                    <Cell fill={category.unfilledColor} stroke="white" strokeWidth={3} />
                  </Pie>
                ))}
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {acceptedData.map((category) => (
                <Box key={category.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 15, height: 15, backgroundColor: category.color, borderRadius: 2 }}></Box>
                  <Typography variant="body2" sx={{ color: "#000000" }}>{category.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Pending Medicines - Bar Chart */}
          <Box
            sx={{
              padding: '15px',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
              flex: 1,
              backdropFilter: "blur(25px) ",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", color: "#000000" }}>Pending Medicines</Typography>
            <BarChart width={200} height={200} data={pendingData}>
              <XAxis width={150} dataKey="name" tick={{ fill: "#000000" }} />
              <YAxis tick={{ fill: "#000000" }} />
              <Tooltip formatter={(value, name) => [`${value} pending`, name]} />
              <Bar dataKey="Capsules" fill="#3357FF" name="Capsules" barSize={20} />
              <Bar dataKey="Tablets" fill="#FFA500" name="Tablets" barSize={20} />
              <Bar dataKey="Antibiotics" fill="#a812e3" name="Antibiotics" barSize={20} />
              <Bar dataKey="Drugs" fill="#E91E63" name="Drugs" barSize={20} />
            </BarChart>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {acceptedData.map((category) => (
                <Box key={category.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 15, height: 15, backgroundColor: category.color, borderRadius: 2 }}></Box>
                  <Typography variant="body2" sx={{ color: "#000000" }}>{category.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Rejected Medicines - Pie Chart */}
          <Box
            sx={{
              padding: '15px',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
              flex: 1,
              backdropFilter: "blur(25px)",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", color: "#000000" }}>Rejected Medicines</Typography>
            <PieChart width={200} height={200}>
              <Pie
                data={rejectedData}
                cx={100}
                cy={100}
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {rejectedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} rejected`, name]} />
            </PieChart>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {rejectedData.map((category) => (
                <Box key={category.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 15, height: 15, backgroundColor: category.color, borderRadius: 2 }}></Box>
                  <Typography variant="body2" sx={{ color: "#000000" }}>{category.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Tabs for Medicines */}
        <Box sx={{ mt: 2, padding: "0 20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs
  value={activeTab}
  onChange={handleTabChange}
  centered
>
  {/* Pending Tab */}
  {/* <Tab
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
  /> */}


{/* aleeza code */}
<Tab
  label="Pending Medicines"
  value="pending"
  onClick={async () => {
    const medicines = await fetchPendingMedicines();
    setPendingMedicines(medicines); // ✅ Store the data in state
  }}
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




  {/* Accepted Tab */}
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

  {/* Rejected Tab */}
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

  {/* Sales Tab */}
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
          {activeTab === "sales" ? (
  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(240px, 1fr))", gap: 3, mt: 2 }}>
    {salesData.map((sale) => (
      <Card key={sale.id} sx={{ width: "100%", height: "340px", position: "relative" , backgroundColor: "rgba(255, 255, 255, 0.5)", }}>


        
        
        <CardMedia
          component="img"
          height="140"
          image={sale.image}
          alt={sale.name}
          sx={{
            height:200,
            objectFit: "contain",
            width: "100%",
          }}
        />
        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1rem", color: "#000000" }}>
            {sale.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#000000" }}>
            Sold on: {sale.saleDate}
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            bottom: "10px",
          
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            backgroundColor: "#2196F3",
            color: "#FFFFFF",
            fontSize: "0.875rem",
            '&:hover': { backgroundColor: "#1976D2" },
          }}
          onClick={() => handleEditClick(sale)} // Open modal with sale data
        >
          Edit
        </Button>
      </Card>
    ))}
  </Box>
) : (
  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(240px, 1fr))", gap: 3, mt: 2 }}>
    {medicinesData[activeTab].map((medicine) => (
      <Box key={medicine.id} sx={{ width: "100%", height: "310px", position: "relative" }}>
        {/* Flipping Card Container */}
        <Box
          onMouseEnter={() => setHoveredCard(medicine.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick(medicine)}
          sx={{
            perspective: "1000px",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: hoveredCard === medicine.id ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of the Card */}
            <Card
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                backfaceVisibility: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingBottom: "50px",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                height="140px"
                image={medicine.image}
                alt={medicine.name}
                sx={{
                  height: 220,
                  objectFit: "contain",
                  width: "100%",
                }}
              />

              {/* Medicine Name */}
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem", color: "#000000" }}>
                  {medicine.name}
                </Typography>
              </CardContent>
            </Card>

            {/* Back of the Card */}
            <Card
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 2,
              }}
            >
              <Typography variant="body1" sx={{ color: "#000000" }}>
                {medicineUses[medicine.id] || "No use information available."}
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Fixed "Add to Sale" Button - Stays Below Card */}
        {activeTab === "accepted" && (
          <Box sx={{ 
            position: "absolute", 
            bottom: "8px", 
            left: "50%", 
            transform: "translateX(-50%)", 
            width: "90%", 
            display: "flex", 
            justifyContent: "center",
          }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2196F3",
                color: "#FFFFFF",
                fontSize: "0.875rem",
                width: "100%",
                '&:hover': { backgroundColor: "#45a049" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSaleModal(medicine);
              }}
            >
              Add to Sale
            </Button>
          </Box>
        )}
      </Box>
    ))}
  </Box>
)}
        </Box>
      </Box>

      {/* Add to Sale Modal */}
      <Modal open={saleModalOpen} onClose={handleCloseSaleModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2,backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
          <Typography variant="h6">Confirm Sale</Typography>
          {selectedMedicine && (
            <>
              <CardMedia component="img" height="200" image={selectedMedicine.image} alt={selectedMedicine.name} sx={{ objectFit: "contain", width: "100%", mb: 2 }} />
              <Typography variant="body1">Medicine: {selectedMedicine.name}</Typography>
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={confirmSale}>
                Confirm Sale
              </Button>
            </>
          )}
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleCloseSaleModal}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal open={openModal} onClose={handleCloseModal}>
  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, boxShadow: 0, p: 0, borderRadius: 0, overflowY: 'auto', maxHeight: '80vh' }}>
    <MedicineForm
      medicine={selectedMedicine} // Pass selected medicine for editing
      onSave={handleAddMedicine} // Handle save action
      onClose={handleCloseModal} // Handle close action
    />
  </Box>
</Modal>


<Modal open={editModalOpen} onClose={handleCloseEditModal}>
  <Box sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
    backdropFilter: "blur(10px)",
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Edit Medicine Details
    </Typography>

    {/* Price Field */}
    <TextField
      label="Price ($)"
      type="number"
      fullWidth
      margin="normal"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
    />

    {/* Quantity Control */}
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mt: 2
    }}>
      <Button 
        variant="contained" 
        onClick={() => setQuantity(quantity - 1)} 
        disabled={quantity <= 1}
      >
        -
      </Button>
      
      <Typography variant="h6">{quantity}</Typography>
      
      <Button variant="contained" onClick={() => setQuantity(quantity + 1)}>
        +
      </Button>
    </Box>

    {/* Save Button */}
    <Button 
      variant="contained" 
      fullWidth 
      sx={{ mt: 3 }} 
      onClick={handleCloseEditModal}
    >
      Save Changes
    </Button>
  </Box>
</Modal>



      {/* Add Medicine Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, boxShadow: 0, p: 0, borderRadius: 0, overflowY: 'auto', maxHeight: '80vh' }}>
          <MedicineForm />
        </Box>
      </Modal>

      {/* Medicine Details Modal */}
      <MedicineDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        medicine={selectedMedicine}
        
      />
    </Box>
  );
};

// const MedicineForm = ({ medicine, onSave, onClose }) => {
//   const [formData, setFormData] = useState(medicine || { name: "", type: "", image: "" });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <TextField
//         label="Name"
//         value={formData.name}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Type"
//         value={formData.type}
//         onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Image URL"
//         value={formData.image}
//         onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//         fullWidth
//         margin="normal"
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         Save
//       </Button>
//       <Button onClick={onClose} variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }}>
//         Cancel
//       </Button>
//     </Box>
//   );
// };
export default ManufacturerDashboard;