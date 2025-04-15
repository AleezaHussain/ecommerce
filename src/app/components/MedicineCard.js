"use client";
import { useState } from "react";
import { 
  Box, Card, CardContent, CardMedia, 
  Typography, Button, Chip 
} from "@mui/material";

const MedicineCard = ({ medicine, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 0: return { bg: '#FFF8E1', text: '#FF8F00' }; // Pending
      case 1: return { bg: '#FFEBEE', text: '#D32F2F' }; // Rejected
      case 2: return { bg: '#E8F5E9', text: '#388E3C' }; // Accepted
      default: return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  const status = getStatusColor(medicine.status);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? '0 6px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {medicine.uploadedFiles?.length > 0 && (
        <CardMedia
          component="img"
          height="160"
          image={`https://ipfs.io/ipfs/${medicine.uploadedFiles[0].ipfsHash}`}
          alt={medicine.name}
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f9f9f9',
            p: 1
          }}
        />
      )}
      
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={
              medicine.status === 0 ? 'Pending' : 
              medicine.status === 1 ? 'Rejected' : 'Accepted'
            }
            size="small"
            sx={{
              backgroundColor: status.bg,
              color: status.text,
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {medicine.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {medicine.description || "No description available"}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onCardClick(medicine)}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              textTransform: 'none',
              fontWeight: 500,
              py: 1
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;