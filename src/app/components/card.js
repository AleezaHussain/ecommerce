// import React from 'react';
// import { 
//   Card as MuiCard, 
//   CardContent as MuiCardContent,
//   CardHeader as MuiCardHeader,
//   CardActions as MuiCardActions,
//   CardMedia as MuiCardMedia,
//   Typography,
//   styled
// } from '@mui/material';

// // Styled components
// const StyledCard = styled(MuiCard)(({ theme, elevation = 1 }) => ({
//   borderRadius: '16px',
//   transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
//   '&:hover': {
//     boxShadow: theme.shadows[elevation + 2],
//     transform: 'translateY(-5px)'
//   }
// }));

// const StyledCardMedia = styled(MuiCardMedia)(({ theme }) => ({
//   height: 0,
//   paddingTop: '56.25%', // 16:9 aspect ratio
// }));

// // Components
// export const Card = ({ children, elevation = 1, className, onClick, ...props }) => {
//   return (
//     <StyledCard elevation={elevation} className={className} onClick={onClick} {...props}>
//       {children}
//     </StyledCard>
//   );
// };

// export const CardContent = ({ children, className, ...props }) => {
//   return (
//     <MuiCardContent className={className} {...props}>
//       {children}
//     </MuiCardContent>
//   );
// };

// export const CardHeader = ({ title, subheader, avatar, action, className, ...props }) => {
//   return (
//     <MuiCardHeader
//       title={title}
//       subheader={subheader}
//       avatar={avatar}
//       action={action}
//       className={className}
//       {...props}
//     />
//   );
// };

// export const CardActions = ({ children, className, disableSpacing = false, ...props }) => {
//   return (
//     <MuiCardActions className={className} disableSpacing={disableSpacing} {...props}>
//       {children}
//     </MuiCardActions>
//   );
// };

// export const CardMedia = ({ image, title, height, className, ...props }) => {
//   return (
//     <StyledCardMedia
//       image={image}
//       title={title}
//       sx={{ height: height }}
//       className={className}
//       {...props}
//     />
//   );
// };

// // For convenience, export both the individual components and as a combined object
// export default {
//   Card,
//   CardContent,
//   CardHeader,
//   CardActions,
//   CardMedia
// };