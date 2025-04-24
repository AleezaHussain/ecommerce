"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import BarChart from "../../components/barchart";
import PieChart from "../../components/piechart";
import { styled } from "@mui/material/styles";

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const LegendItem = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

const ChartsSection = ({
  pendingMedicines,
  acceptedMedicines,
  rejectedMedicines,
}) => {
    const totalMedicines =
    pendingMedicines.length +
    acceptedMedicines.length +
    rejectedMedicines.length;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
      {/* Summary Cards */}
      <Box sx={{ gridColumn: "span 4" }}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#016A70" }}>
            Total Medicines
          </Typography>
          <Typography variant="h3" sx={{ textAlign: "center", color: "#016A70" }}>
            {totalMedicines}
          </Typography>
        </StatCard>
      </Box>
      <Box sx={{ gridColumn: "span 4" }}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2E7D32" }}>
            Approved
          </Typography>
          <Typography variant="h3" sx={{ textAlign: "center", color: "#2E7D32" }}>
            {acceptedMedicines.length}
          </Typography>
        </StatCard>
      </Box>
      <Box sx={{ gridColumn: "span 4" }}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}>
            Rejected
          </Typography>
          <Typography variant="h3" sx={{ textAlign: "center", color: "#d32f2f" }}>
            {rejectedMedicines.length}
          </Typography>
        </StatCard>
      </Box>

      {/* Charts */}
      <Box sx={{ gridColumn: "span 8" }}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#016A70" }}>
            Medicines by Status
          </Typography>
          <BarChart
            pending={pendingMedicines.length}
            accepted={acceptedMedicines.length}
            rejected={rejectedMedicines.length}
            colors={{
              pending: "#1976d2", // Blue
              accepted: "#2E7D32", // Green
              rejected: "#d32f2f"  // Red
            }}
          />
        </StatCard>
      </Box>
      <Box sx={{ gridColumn: "span 4" }}>
        <StatCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#016A70" }}>
            Status Distribution
          </Typography>
          <Box sx={{ height: "250px" }}>
            <PieChart
              pending={pendingMedicines.length}
              accepted={acceptedMedicines.length}
              rejected={rejectedMedicines.length}
              colors={{
                pending: "#1976d2", // Blue
                accepted: "#2E7D32", // Green
                rejected: "#d32f2f"  // Red
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "none" }}>
                <LegendItem color="#1976d2" label="Pending" />
                <LegendItem color="#2E7D32" label="Approved" />
                <LegendItem color="#d32f2f" label="Rejected" />
              </Box>
            </Box>
          </Box>
        </StatCard>
      </Box>
    </Box>
  );
};

export default ChartsSection;