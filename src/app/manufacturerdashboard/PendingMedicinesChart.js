"use client";
import React, { useState, useEffect } from "react";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const PendingMedicinesChart = ({ pendingMedicines = [] }) => {
  // Count medicines by type
  const countByType = pendingMedicines.reduce((acc, medicine) => {
    const type = medicine.types?.[0] || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the bar chart
  const barData = Object.entries(countByType).map(([name, value]) => ({
    name,
    value,
    color: getColorForType(name)
  }));
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // or a loading state
  }

  // Default data if empty
  const defaultData = [
    { name: 'Capsules', value: 0, color: '#3357FF' },
    { name: 'Tablets', value: 0, color: '#FFA500' },
    { name: 'Antibiotics', value: 0, color: '#a812e3' },
    { name: 'Other', value: 0, color: '#E91E63' }
  ];

  // Use actual data if available, otherwise use default
  const displayData = barData.length > 0 ? barData : defaultData;

  function getColorForType(type) {
    const colorMap = {
      'Capsules': '#3357FF',
      'Tablets': '#FFA500',
      'Antibiotics': '#a812e3',
      'Drugs': '#E91E63',
      'Other': '#E91E63'
    };
    return colorMap[type] || '#E91E63';
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
        Pending Medicines
      </Typography>
      <Typography variant="h4" sx={{ textAlign: "center", color: "#FFA500", my: 2 }}>
        {pendingMedicines.length}
      </Typography>
      
      <BarChart 
        width={200} 
        height={200} 
        data={displayData}
        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="name" tick={{ fill: "#000000", fontSize: 12 }} />
        <YAxis tick={{ fill: "#000000", fontSize: 12 }} />
        <Tooltip 
          formatter={(value, name) => [`${value}`, name]} 
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="value" name="Count">
          {displayData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
      
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: 'wrap' }}>
        {displayData.map((entry, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ 
              width: 15, 
              height: 15, 
              backgroundColor: entry.color, 
              borderRadius: 2 
            }} />
            <Typography variant="body2" sx={{ color: "#000000" }}>
              {entry.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PendingMedicinesChart;