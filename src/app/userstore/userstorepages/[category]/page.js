"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Grid } from "@mui/material";
import Link from "next/link"; // Add at the top
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Container,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { fetchMedicinesByType } from "../../../../../lib/saleMedicineDb";
import Allnavbar from "../../sections/Allnavbar";
import { FooterSection } from "../../sections/FooterSection";

const CategoryPage = () => {
  const { category } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize category names
  const getDbCategory = (urlCategory) => {
    const map = {
      'Injection': 'Injection',
      'Antibiotic': 'Antibiotic',
      'Syrup': 'Syrup',
      'Capsule': 'Capsule'
    };
    return map[urlCategory] || urlCategory.toLowerCase();
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dbCategory = getDbCategory(category);
        const data = await fetchMedicinesByType(dbCategory);
        
        if (!data) {
          throw new Error('No response from server');
        }
        
        setMedicines(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [category]);

  return (
    <>
      <Allnavbar />
      
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          minHeight: 'calc(100vh - 200px)', // Adjust based on your navbar/footer height
          mt: 15, // Matches your navbar height
          mb: 8, // Space before footer
          px: 5
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{ 
                fontWeight: "bold", 
                mb: 3,
                mt:20, 
                textAlign: "left",
                color: "#002f6c",
                px: 2
              }}
            >
              {category}
            </Typography>

            {medicines.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                No medicines found in this category.
              </Typography>
            ) : (
              <Grid container spacing={2}>
  {medicines.map((medicine) => (
  <Grid item xs={12} sm={6} md={3} key={medicine.medicine_id}>
    <Link
      href={`/userstore/userstorepages/allmedicines/${medicine.medicine_id}`}
      passHref
      style={{ textDecoration: 'none' }}
    >
      <Card
        sx={{
          height: 340, // Match height with AllMedicines card
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 1,
          borderRadius: 1,
          transition: 'transform 0.3s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 3
          }
        }}
      >
        {medicine.image_url && (
          <CardMedia
            component="img"
            image={medicine.image_url || "/medicine-placeholder.jpg"}
            alt={medicine.name}
            sx={{
              objectFit: 'contain',
              p: 1,
              height: 140,
              backgroundColor: '#f5f5f5'
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#002F6C' }}>
            {medicine.name}
          </Typography>

          {medicine.brand && (
            <Typography variant="caption" color="text.secondary">
              {medicine.brand}
            </Typography>
          )}

          {medicine.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#616161",
                fontSize: "13px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                my: 1,
              }}
            >
              {medicine.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              Rs. {medicine.price}
            </Typography>
            <Typography variant="body2">
              Qty: {medicine.quantity > 0 ? medicine.quantity : 'Out of Stock'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  </Grid>
))}

</Grid>

            )}
          </>
        )}
      </Container>
      
      <FooterSection />
    </>
  );
};

export default CategoryPage;