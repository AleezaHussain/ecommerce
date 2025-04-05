// AcceptedMedicineCards.js
"use client";
import MedicineCard from "../components/MedicineCard";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const AcceptedMedicineCards = ({ medicines, loading, onCardClick, onAddToSale }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (medicines.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        No accepted medicines found
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 3 }}>
      {medicines.map((medicine) => (
        <MedicineCard 
          key={medicine.tokenId} 
          medicine={medicine} 
          onCardClick={onCardClick}
        />
      ))}
    </Box>
  );
};

export default AcceptedMedicineCards;