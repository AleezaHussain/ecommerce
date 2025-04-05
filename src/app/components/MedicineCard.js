"use client";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const MedicineCard = ({ medicine, onCardClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box sx={{ 
      width: "100%", 
      height: "310px", 
      position: "relative",
      pt: 2,
      mb: 0.5
    }}>
      <Box
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
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
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
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
              paddingBottom: "50px",
              alignItems: "center",
            }}
          >
            {medicine.uploadedFiles?.length > 0 && (
              <CardMedia
                component="img"
                height="140px"
                image={`https://ipfs.io/ipfs/${medicine.uploadedFiles[0].ipfsHash}`}
                alt={medicine.name}
                sx={{
                  height: 200,
                  objectFit: "contain",
                  width: "100%",
                  mt: 2
                }}
              />
            )}
            <CardContent sx={{ 
              textAlign: "center", 
              flexGrow: 1,
              pt: 1
            }}>
              <Typography variant="h6" sx={{ fontSize: "1rem", color: "#000000" }}>
                {medicine.name}
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
            <Box sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
              <Typography variant="body1" sx={{ 
                mb: 1, 
                color: "#000000",
                px: 1
              }}>
                Description: {medicine.description || "No description available"}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: "#000000",
              }}>
                Type: {medicine.types?.join(", ") || "N/A"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => onCardClick(medicine)}
              sx={{
                backgroundColor: "#2196F3",
                color: "#FFFFFF",
                '&:hover': { backgroundColor: "#1976D2" },
                alignSelf: "center",
                width: "80%",
                mt: "auto",
                mb: 1
              }}
            >
              View Details
            </Button>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default MedicineCard;