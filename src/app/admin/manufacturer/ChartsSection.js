"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import BarChart from "../../components/barchart";
import PieChart from "../../components/piechart";
import LineChart from "../../components/linechart";

const ChartsSection = ({
  pendingManufacturers,
  acceptedManufacturers,
  rejectedManufacturers,
}) => {
  const totalManufacturers =
    pendingManufacturers.length +
    acceptedManufacturers.length +
    rejectedManufacturers.length;

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#EEF2F6",
        paddingLeft: "0px",
        paddingBottom: "20px",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ display: "flex", gap: "10px", height: "300px" }}>
        {/* Bar Chart */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, color: "#016A70" }}
          >
            Manufacturers by Status
          </Typography>
          <BarChart
            pending={pendingManufacturers.length}
            accepted={acceptedManufacturers.length}
            rejected={rejectedManufacturers.length}
          />
        </Box>

        {/* Pie Chart and Total Manufacturers */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#016A70", mb: 2 }}
          >
            Total Manufacturers: {totalManufacturers}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              height: "100%",
            }}
          >
            <Box sx={{ width: "60%", height: "100%" }}>
              <PieChart
                pending={pendingManufacturers.length}
                accepted={acceptedManufacturers.length}
                rejected={rejectedManufacturers.length}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Pending Label */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      bgcolor: "#059212",
                      borderRadius: "4px",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "#059212", fontWeight: "bold" }}
                  >
                    Pending
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    textAlign: "left",
                    fontSize: "20px",
                    pl: "28px",
                  }}
                >
                  {pendingManufacturers.length}
                </Typography>
              </Box>

              {/* Accepted Label */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      bgcolor: "#982176",
                      borderRadius: "4px",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "#982176", fontWeight: "bold" }}
                  >
                    Accepted
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: "20px",
                    textAlign: "left",
                    pl: "28px",
                  }}
                >
                  {acceptedManufacturers.length}
                </Typography>
              </Box>

              {/* Rejected Label */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      bgcolor: "#F5004F",
                      borderRadius: "4px",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "#F5004F", fontWeight: "bold" }}
                  >
                    Rejected
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    textAlign: "left",
                    fontSize: "20px",
                    pl: "28px",
                  }}
                >
                  {rejectedManufacturers.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Line Chart
        <Box
          sx={{
            flex: 1,
            bgcolor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "20px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#016A70",
              textAlign: "center",
            }}
          >
            Manufacturers Status Over Time
          </Typography>
          <LineChart />
        </Box> */}
      </Box>
    </Box>
  );
};

export default ChartsSection; 