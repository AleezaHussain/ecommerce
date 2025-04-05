"use client";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const SaleMedicineCards = ({ sales, onEditClick, onRemoveFromSale }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (sales.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        No sales found
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(240px, 1fr))",
        gap: 3,
      }}
    >
      {sales.map((sale) => {
        // Updated to use medicine_id instead of tokenId
        const uniqueKey = sale.medicine_id
          ? `sale-${sale.medicine_id}`
          : `sale-${sale.name}-${sale.saleDate || new Date().toISOString()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`;

        // Safely handle price formatting
        const formattedPrice = sale.price
          ? typeof sale.price === "number"
            ? sale.price.toFixed(2)
            : parseFloat(sale.price).toFixed(2)
          : "N/A";

        return (
          <Box
            key={uniqueKey}
            sx={{ width: "100%", height: "330px", position: "relative" }}
          >
            <Box
              onMouseEnter={() => setHoveredCard(uniqueKey)}
              onMouseLeave={() => setHoveredCard(null)}
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
                  transform:
                    hoveredCard === uniqueKey
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
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
                    paddingBottom: "30px",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      sale.uploadedFiles?.length > 0
                        ? `https://ipfs.io/ipfs/${sale.uploadedFiles[0].ipfsHash}`
                        : sale.image_url || "/images/placeholder.png"
                    }
                    alt={sale.name}
                    sx={{
                      height: 200,
                      objectFit: "contain",
                      width: "100%",
                      mt: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: "1rem", color: "#000000" }}>
                      {sale.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000" }}>
                      Sold on: {sale.saleDate || new Date().toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000" }}>
                      Price: ${formattedPrice}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000" }}>
                      Qty: {sale.quantity || 1}
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
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, color: "#000000" }}
                    >
                      <strong>Price:</strong> ${formattedPrice}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: "#000000" }}>
                      <strong>Quantity:</strong> {sale.quantity || 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, color: "#000000" }}
                    >
                      <strong>Sold on:</strong> {sale.saleDate || new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => onEditClick(sale)} // Pass the sale object to edit handler
                    sx={{
                      backgroundColor: "#2196F3",
                      color: "#FFFFFF",
                      "&:hover": { backgroundColor: "#1976D2" },
                      alignSelf: "center",
                      width: "80%",
                      mt: "auto",
                      mb: 1,
                    }}
                  >
                    Edit Sale
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => onRemoveFromSale(sale)} // Pass the sale object to remove handler
                    sx={{
                      backgroundColor: "#f44336",
                      color: "#FFFFFF",
                      "&:hover": { backgroundColor: "#d32f2f" },
                      alignSelf: "center",
                      width: "80%",
                      mb: 1,
                    }}
                  >
                    Remove from Sale
                  </Button>
                </Card>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default SaleMedicineCards;