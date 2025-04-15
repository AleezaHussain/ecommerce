'useclient';

import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create styled versions of MUI Grid
const StyledContainer = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
}));

const StyledItem = styled(MuiGrid)(({ theme }) => ({
  // Base styles for grid items
}));

// Container Grid
export const GridContainer = ({
  children,
  spacing = 2,
  alignItems,
  justifyContent,
  direction,
  sx,
}) => {
  return (
    <StyledContainer
      container
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
      direction={direction}
      sx={sx}
    >
      {children}
    </StyledContainer>
  );
};

// Item Grid
export const GridItem = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  sx,
}) => {
  // Create dynamic props object
  const gridProps = { item: true, sx };
  
  // Convert size props to sx format
  const sizeProps = {};
  if (xs !== undefined) sizeProps.gridColumn = { xs: `span ${xs}` };
  if (sm !== undefined) sizeProps.gridColumn = { ...sizeProps.gridColumn, sm: `span ${sm}` };
  if (md !== undefined) sizeProps.gridColumn = { ...sizeProps.gridColumn, md: `span ${md}` };
  if (lg !== undefined) sizeProps.gridColumn = { ...sizeProps.gridColumn, lg: `span ${lg}` };
  if (xl !== undefined) sizeProps.gridColumn = { ...sizeProps.gridColumn, xl: `span ${xl}` };
  
  if (Object.keys(sizeProps).length > 0) {
    gridProps.sx = { ...sx, ...sizeProps };
  }

  return (
    <StyledItem {...gridProps}>
      {children}
    </StyledItem>
  );
};