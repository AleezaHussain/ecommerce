"use client";
import { Box } from "@mui/material";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F4F6F8",
      }}
    >
      {/* Sidebar - Fixed width */}
      <Box
        sx={{
          width: "240px",
          flexShrink: 0,
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Content - Offset by sidebar width */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "240px", // Match sidebar width
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar - Fixed position */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
          <Navbar />
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;