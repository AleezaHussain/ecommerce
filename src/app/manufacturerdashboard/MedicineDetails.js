"use client";
import { Typography, Box, Button, Stack, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchRejectionComments } from "../../../lib/adminmedicinefetch";

const MedicineDetails = ({ 
    medicine, 
    onAddToSale, 
    showSaleButton = false, 
    isInSales = false
}) => {
    const [rejectionComments, setRejectionComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (medicine?.status === 1) { // Status 1 = Rejected
            const fetchComments = async () => {
                setLoadingComments(true);
                try {
                    const comments = await fetchRejectionComments(medicine.tokenId);
                    setRejectionComments(comments);
                } catch (error) {
                    console.error("Failed to fetch rejection comments:", error);
                } finally {
                    setLoadingComments(false);
                }
            };
            fetchComments();
        }
    }, [medicine]);

    if (!medicine) return null;

    // Map status number to text
    const getStatusText = (status) => {
        switch(status) {
            case 0: return "Pending";
            case 1: return "Rejected";
            case 2: return "Accepted";
            default: return "Unknown";
        }
    };

    // Map status to color
    const getStatusColor = (status) => {
        switch(status) {
            case 0: return "orange";
            case 1: return "red";
            case 2: return "green";
            default: return "black";
        }
    };
    

    return (
        <Box sx={{ 
            mt: 3, // This is your existing top margin (3 = 24px)
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <Box>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 3, 
                        textAlign: "left", 
                        fontWeight: "bold",
                        color: 'black'
                    }}
                >
                    {medicine.name}
                </Typography>
                
                <Box sx={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: 2,
                    mb: 3
                }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Medicine ID:</Typography>
                        <Typography variant="body1">{medicine.medicineId || "N/A"}</Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Batch Number:</Typography>
                        <Typography variant="body1">{medicine.batchNumber || "N/A"}</Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Manufacture Date:</Typography>
                        <Typography variant="body1">{medicine.manufactureDate || "N/A"}</Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Expiry Date:</Typography>
                        <Typography variant="body1">{medicine.expiryDate || "N/A"}</Typography>
                    </Box>
                    
                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Excipients:</Typography>
                        <Typography variant="body1">
                            {medicine.ingredients?.join(", ") || "N/A"}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Types:</Typography>
                        <Typography variant="body1">
                            {medicine.types?.join(", ") || "N/A"}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Status:</Typography>
                        <Typography variant="body1" sx={{ 
                            color: getStatusColor(medicine.status),
                            fontWeight: "bold"
                        }}>
                            {getStatusText(medicine.status)}
                        </Typography>
                    </Box>
                </Box>

                {/* Rejection Comments Section - Only shown for rejected medicines (status 1) */}
                {medicine.status === 1 && (
                    <Box sx={{ gridColumn: "1 / -1", mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            Rejection Reason:
                        </Typography>
                        {loadingComments ? (
                            <Typography variant="body1">Loading comments...</Typography>
                        ) : rejectionComments.length > 0 ? (
                            rejectionComments.map((comment, index) => (
                                <Box key={index} sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    backgroundColor: '#FFF8F8',
                                    borderRadius: '4px',
                                    borderLeft: '4px solid #FF5252'
                                }}>
                                    <Typography variant="body1">
                                        {comment.rejection_comments}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                                No rejection comments available
                            </Typography>
                        )}
                    </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Description:</Typography>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                        {medicine.description || "No description available"}
                    </Typography>
                </Box>
            </Box>

            <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="flex-end"
                sx={{ mb: 4 }}
            >
                {showSaleButton && (
                    <Tooltip 
                        title={isInSales ? "This medicine is already in sale" : "Add this medicine to sale"}
                        placement="top"
                    >
                        <span> {/* Wrap button in span for tooltip to work when disabled */}
                            <Button
                                variant="contained"
                                sx={{ width: '100%' }}
                                onClick={onAddToSale}
                                disabled={isInSales}
                            >
                                {isInSales ? "Already in Sale" : "Add to Sale"}
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Stack>
        </Box>
    );
};

export default MedicineDetails;