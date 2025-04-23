"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestPayment() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    amount: '',
  });

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderNumber = 'PHARM-' + Math.floor(Math.random() * 1000000);

    try {
      const res = await axios.post('/api/payment/paypro', {
        ...form,
        orderNumber,
      });

      const { paymentUrl } = res.data;

      // Save order number for status check
      localStorage.setItem('orderNumber', orderNumber);

      // Redirect to PayPro payment page
      window.location.href = paymentUrl;
    } catch (error) {
      alert('Error creating order: ' + (error?.response?.data?.error || error.message));
    }
  };

  // Check payment status after redirection
  const checkPaymentStatus = async () => {
    const orderNumber = localStorage.getItem('orderNumber');
    if (!orderNumber) {
      alert("No order number found.");
      return;
    }

    try {
      const res = await fetch(`/api/payment/status?orderNumber=${orderNumber}`);
      if (res.redirected) {
        // Redirect handled by API
        window.location.href = res.url;
      } else {
        const data = await res.json();
        alert("Payment Status: " + data.status);
      }
    } catch (error) {
      console.error("Status check failed:", error);
    }
  };

  // Auto-check on mount if we came back from PayPro
  useEffect(() => {
    const url = new URL(window.location.href);
    const cameBackFromPayment = url.searchParams.get("paypro");

    if (cameBackFromPayment) {
      setIsCheckingStatus(true);
      checkPaymentStatus();
    }
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h2>PharmaGuard – Manual Payment Gateway Test</h2>

      {isCheckingStatus ? (
        <div>
          <p>🔄 Checking payment status...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Customer Name" onChange={handleChange} required /><br />
          <input name="email" placeholder="Email" onChange={handleChange} required /><br />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required /><br />
          <input name="address" placeholder="Address" onChange={handleChange} required /><br />
          <input name="amount" placeholder="Amount (PKR)" onChange={handleChange} required /><br />
          <button type="submit">Pay Now</button>
        </form>
      )}
    </div>
  );
}
