"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Cell } from 'recharts';

const PendingMedicinesChart = ({ data = [] }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const allowedTypes = ['Capsule', 'Injection', 'Antibiotics', 'Syrup'];

const countByType = data.reduce((acc, medicine) => {
  const type = medicine.types?.[0];
  if (allowedTypes.includes(type)) {
    acc[type] = (acc[type] || 0) + 1;
  }
  return acc;
}, {});


  // Enhanced color palette with more distinct colors
  const getColorForType = (type) => {
    const colorMap = {
      'Capsules': '#3366FF',  // Vibrant blue
      'Tablets': '#FF9933',   // Orange
      'Syrup': '#33CC33',     // Green
      'Injection': '#FF3399', // Pink
      'Antibiotics': '#9966FF', // Purple
      'Ointment': '#FF6666',  // Red
      'Drops': '#66CCFF',     // Light blue
      'Suspension': '#FFCC66', // Light orange
      'Suppository': '#CC99FF', // Lavender
      'Other': '#999999'      // Gray
    };
    
    // If type not in map, generate a random color
    if (!colorMap[type]) {
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      colorMap[type] = randomColor;
    }
    
    return colorMap[type];
  };

  const chartData = Object.entries(countByType).map(([name, value]) => ({
    name,
    value,
    color: getColorForType(name)
  }));

  // Default data if empty - now with more types and colors
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Capsule', value: 0, color: '#3366FF' },
    { name: 'Injection', value: 0, color: '#FF3399' },
    { name: 'Antibiotics', value: 0, color: '#9966FF' },
    { name: 'Syrup', value: 0, color: '#33CC33' },
  ];
  

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" sx={{ 
        mb: 2, 
        fontWeight: 600,
        color: 'text.primary'
      }}>
        Pending Medicines
      </Typography>
      
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h3" sx={{ 
          color: '#FFA500', 
          fontWeight: 700,
          mb: 2,
          textAlign: 'center'
        }}>
          {data.length}
        </Typography>
        
        <Box sx={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value} Medicines`]}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="value" name="Count">
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2,
        pt: 2,
        borderTop: '1px solid #f0f0f0'
      }}>
        {displayData.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              backgroundColor: entry.color,
              borderRadius: '2px',
              mr: 1
            }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {entry.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PendingMedicinesChart;