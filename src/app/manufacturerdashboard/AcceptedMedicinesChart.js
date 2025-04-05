"use client";
import React, { useState, useEffect } from "react";

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

const AcceptedMedicinesChart = ({ acceptedMedicines = [] }) => {
  const pieData = [
    { 
      name: 'Accepted Medicines', 
      value: acceptedMedicines.length,
      color: '#4CAF50',
      unfilledColor: '#E0E0E0'
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
        Accepted Medicines
      </Typography>
      <Typography variant="h4" sx={{ textAlign: "center", color: "#4CAF50", my: 2 }}>
        {acceptedMedicines.length}
      </Typography>
      <PieChart width={200} height={200}>
        <Pie
          data={[
            { name: 'Accepted', value: acceptedMedicines.length },
            { name: 'Empty', value: Math.max(1, 10 - acceptedMedicines.length) }
          ]}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          <Cell fill="#4CAF50" />
          <Cell fill="#E0E0E0" />
        </Pie>
        <Tooltip />
      </PieChart>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 15, height: 15, backgroundColor: "#4CAF50", borderRadius: 2 }}></Box>
          <Typography variant="body2" sx={{ color: "#000000" }}>Accepted</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AcceptedMedicinesChart;