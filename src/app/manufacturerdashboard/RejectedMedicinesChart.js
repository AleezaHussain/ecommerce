"use client";
import React, { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const RejectedMedicinesChart = ({ rejectedMedicines = [] }) => {
  // Prepare data for the pie chart
  const pieData = [
    { 
      name: 'Rejected', 
      value: rejectedMedicines.length,
      color: '#FF5252'
    },
    { 
      name: 'Empty', 
      value: Math.max(1, 10 - rejectedMedicines.length),
      color: '#E0E0E0'
    }
  ];
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // or a loading state
  }

  return (
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
      <Typography variant="h6" sx={{ textAlign: "center", color: "#000000" }}>
        Rejected Medicines
      </Typography>
      <Typography variant="h4" sx={{ textAlign: "center", color: "#FF5252", my: 2 }}>
        {rejectedMedicines.length}
      </Typography>
      
      <PieChart width={200} height={200}>
        <Pie
          data={pieData}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              stroke="white" 
              strokeWidth={3} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value}`, name]} 
        />
      </PieChart>
      
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ 
            width: 15, 
            height: 15, 
            backgroundColor: "#FF5252", 
            borderRadius: 2 
          }} />
          <Typography variant="body2" sx={{ color: "#000000" }}>
            Rejected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RejectedMedicinesChart;