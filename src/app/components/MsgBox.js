"use client";
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

// Alert component for styling
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Success Message Box Component
export const SuccessMsgBox = ({ open, onClose, message, routeButton }) => {
  const router = useRouter();

  React.useEffect(() => {
    if (open && routeButton) {
        const timer = setTimeout(() => {
            onClose();
            router.push(routeButton.path);
        }, 3000); // Redirect after 3 seconds
        
        return () => clearTimeout(timer);
    }
}, [open, routeButton, router, onClose]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Auto-close after 6 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{ width: '100%' }}
        action={
          routeButton ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                onClose(); // Close the Snackbar
                router.push(routeButton.path);
              }}
            >
              {routeButton.label}
            </Button>
          ) : (
            <Button color="inherit" size="small" onClick={onClose}>
              OK
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export const ErrorMsgBox = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000} // Longer duration for rejection messages
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="error"
        sx={{ 
          width: '90%',
          whiteSpace: 'pre-line' // Preserve line breaks in the message
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Info Message Box Component
export const InfoMsgBox = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Auto-close after 6 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="info"
        sx={{ width: '100%' }}
        action={
          <Button color="inherit" size="small" onClick={onClose}>
            OK
          </Button>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export const StatusMsgBox = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
        action={
          <Button color="inherit" size="small" onClick={onClose}>
            OK
          </Button>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
