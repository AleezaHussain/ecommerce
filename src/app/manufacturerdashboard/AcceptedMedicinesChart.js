"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AcceptedMedicinesChart = ({ data = [] }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const allowedTypes = ['Capsule', 'Injection', 'Syrup', 'Antibiotics'];
  const typeColors = {
    Capsule: '#3366FF',
    Injection: '#FF3399',
    Syrup: '#33CC33',
    Antibiotics: '#9966FF'
  };

  const countByType = data.reduce((acc, medicine) => {
    const type = medicine.types?.[0];
    if (allowedTypes.includes(type)) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = allowedTypes.map((type) => ({
    name: type,
    value: countByType[type] || 0,
    color: typeColors[type]
  }));

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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Accepted Medicines
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 700, mb: 2 }}>
          {data.length}
        </Typography>

        <Box sx={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} Medicines`, name]}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
        {chartData.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '2px', mr: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {entry.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AcceptedMedicinesChart;
