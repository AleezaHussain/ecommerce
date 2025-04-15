"use client";
import { useState } from "react";
import { 
  Box, Card, CardContent, CardMedia, 
  Typography, Button, Chip, Stack 
} from "@mui/material";

const SaleMedicineCards = ({ sales, onEditClick, onRemoveFromSale }) => {
  if (sales.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No sales found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: '24px'
    }}>
      {sales.map((sale) => {
        const formattedPrice = sale.price
          ? typeof sale.price === 'number'
            ? sale.price.toFixed(2)
            : parseFloat(sale.price).toFixed(2)
          : "N/A";

        return (
          <Card
            key={`sale-${sale.medicine_id}`}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              },
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={
                sale.uploadedFiles?.length > 0
                  ? `https://ipfs.io/ipfs/${sale.uploadedFiles[0].ipfsHash}`
                  : sale.image_url || "/images/placeholder.png"
              }
              alt={sale.name}
              sx={{
                objectFit: 'contain',
                backgroundColor: '#f9f9f9',
                p: 1
              }}
            />
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {sale.name}
              </Typography>
              
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Price
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${formattedPrice}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Quantity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {sale.quantity || 1}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            
            <CardContent sx={{ pt: 0 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onEditClick(sale)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Edit
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onRemoveFromSale(sale)}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': { 
                      backgroundColor: '#ffebee',
                      borderColor: '#f44336'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default SaleMedicineCards;