// App.js
"use client";
// App.js
import React, { useState } from 'react';
import { SuccessMsgBox, ErrorMsgBox } from '../components/MsgBox';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleSuccessClick = () => {
    setSuccessOpen(true);
  };

  const handleErrorClick = () => {
    setErrorOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  return (
    <Router>
      <div>
        <Button variant="contained" color="success" onClick={handleSuccessClick}>
          Show Success Message
        </Button>
        <Button variant="contained" color="error" onClick={handleErrorClick}>
          Show Error Message
        </Button>

        {/* Success Message Box with Routing */}
        <SuccessMsgBox
          open={successOpen}
          onClose={handleClose}
          message="Login successful!"
          routeButton={{ path: '/login', label: 'Go to Login' }} // Custom button for routing
        />

        {/* Error Message Box */}
        <ErrorMsgBox
          open={errorOpen}
          onClose={handleClose}
          message="An error occurred. Please try again."
        />

        {/* Routes for demonstration */}
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;