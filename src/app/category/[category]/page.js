"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from "@mui/material";
import { fetchMedicinesByType } from '../../../../lib/saleMedicineDb';

const CategoryPage = () => {
  const { category } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map your category names to the types in your database if needed
  const categoryTypeMap = {
    "Injections": "Injection",
    "Antibiotics": "Antibiotic",
    "Syrups": "Syrup",
    "Tablets": "Tablet"
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        // Get the corresponding type from your mapping
        const type = categoryTypeMap[category] || category.toLowerCase();
        const data = await fetchMedicinesByType(type);
        setMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError(err.message || "Failed to load medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [category]);

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} disableGutters sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 8 }}>
      <Box sx={{ mt: 5, textAlign: "center", px: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "left" }}>
          {category}
        </Typography>
        
        {medicines.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            No medicines found in this category.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              gap: 2,
              paddingBottom: "10px",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {medicines.map((medicine, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: "260px",
                  maxWidth: "260px",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease-in-out",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #E0E0E0",
                  position: "relative",
                  display: 'flex',
                  flexDirection: 'column',
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {/* Stock Status Badge */}
                {medicine.quantity <= 0 && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Chip 
                      label="OUT OF STOCK" 
                      color="error" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        padding: '6px 10px'
                      }} 
                    />
                  </Box>
                )}

                {/* Discount Badge */}
                {medicine.discount && (
                  <Chip
                    label={`${medicine.discount} OFF`}
                    color="success"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <CardMedia 
                  component="img" 
                  image={medicine.image_url || '/medicine-placeholder.jpg'} 
                  alt={medicine.name} 
                  sx={{ 
                    height: "140px", 
                    objectFit: "contain", 
                    padding: "10px",
                    backgroundColor: '#f5f5f5'
                  }} 
                />

                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                    {medicine.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", fontSize: "14px" }}>
                    {medicine.brand}
                  </Typography>
                  
                  {/* Quantity Indicator */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1 }}>
                    <Typography variant="caption" sx={{ mr: 1, fontSize: '12px' }}>
                      Available:
                    </Typography>
                    {medicine.quantity > 0 ? (
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                        {medicine.quantity} {medicine.quantity_unit || 'units'}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                        Out of Stock
                      </Typography>
                    )}
                  </Box>

                  {/* Short Description */}
                  {medicine.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#616161", 
                        fontSize: "13px",
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 1
                      }}
                    >
                      {medicine.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* Pricing */}
                  <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#D32F2F", fontSize: "14px" }}>
                    {medicine.original_price ? `Rs ${medicine.original_price}` : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#2E7D32", fontSize: "18px" }}>
                    Rs {medicine.price}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    disabled={medicine.quantity <= 0}
                    sx={{ 
                      backgroundColor: "#016A70", 
                      "&:hover": { backgroundColor: "#014E50" },
                      "&:disabled": {
                        backgroundColor: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    {medicine.quantity > 0 ? 'ADD TO CART' : 'NOT AVAILABLE'}
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CategoryPage;