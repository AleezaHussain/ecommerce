"use client";
import React, { useState } from "react";
import styled from "styled-components";

// Main container covering full height
const MainContainer = styled.div`
  background: linear-gradient(to bottom, #e0f7f3, #f0f8f7);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const Container = styled.div`
  background-color: #f0f8f7;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  overflow: hidden; /* Ensures sliding effect remains inside container */
  width: 80vw;
  max-width: 1000px;
  min-height: 500px;
  position: relative;
  display: flex;
`;

const FormWrapper = styled.div`
  display: flex;
  width: 220%; /* Increased width to accommodate spacing */
  transition: transform 0.5s ease-in-out;
  transform: ${(props) => (props.isSignIn ? "translateX(0)" : "translateX(-55%)")}; /* Adjusted distance */
`;

const FormContainer = styled.div`
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0 50px; /* Added spacing between containers */
`;


// Title styling
const Title = styled.h1`
  font-weight: bold;
  margin: 0 0 20px;
  color: #2b6777;
  text-align: center;
`;

// Input styling
const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border: 1px solid #2b6777;
  }
`;

// Button styling
const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #2b6777;
  background-color: #2b6777;
  color: #fff;
  font-size: 14px;
  padding: 12px 45px;
  text-transform: uppercase;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e4a5a;
  }
`;

// Overlay container to switch between forms
const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.5s ease-in-out;
  z-index: 100;
  transform: ${(props) => (!props.isSignIn ? "translateX(-100%)" : "translateX(0)")};
`;

// Overlay styling
const Overlay = styled.div`
  background:rgba(43, 103, 119, 0.37);
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: ${(props) => (!props.isSignIn ? "translateX(50%)" : "translateX(0)")};
  transition: transform 0.5s ease-in-out;
`;

// Shared styles for overlay panels
const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.5s ease-in-out;
`;

// Left overlay panel (for returning users)
const LeftOverlayPanel = styled(OverlayPanel)`
  transform: ${(props) => (!props.isSignIn ? "translateX(0)" : "translateX(-20%)")};
`;

// Right overlay panel (for new users)
const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: ${(props) => (!props.isSignIn ? "translateX(20%)" : "translateX(0)")};
`;

// Overlay panel title
const PanelTitle = styled.h1`
  font-weight: bold;
  margin: 0;
  color: #f0f8f7;
`;

// Panel paragraph
const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Signup function
  const handleSignup = async (e) => {
    e.preventDefault();
    const userData = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      role: "user",
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      alert(data.message || "Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <MainContainer>
      <Container>
        <FormWrapper isSignIn={isSignIn}>
          {/* Sign In Form */}
          <FormContainer>
            <form onSubmit={handleLogin}>
              <Title>Sign In</Title>
              <Input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <Input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <Button type="submit">Sign In</Button>
            </form>
          </FormContainer>

          {/* Sign Up Form */}
          <FormContainer>
            <form onSubmit={handleSignup}>
              <Title>Create Account</Title>
              <Input type="text" name="username" placeholder="Username" required onChange={handleChange} />
              <Input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <Input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <Button type="submit">Sign Up</Button>
            </form>
          </FormContainer>
        </FormWrapper>

        {/* Overlay Section */}
        <OverlayContainer isSignIn={isSignIn}>
          <Overlay isSignIn={isSignIn}>
            <LeftOverlayPanel isSignIn={isSignIn}>
              <PanelTitle>Welcome Back!</PanelTitle>
              <Paragraph>To stay connected, please log in with your personal info.</Paragraph>
              <Button onClick={() => setIsSignIn(true)}>Sign In</Button>
            </LeftOverlayPanel>
            <RightOverlayPanel isSignIn={isSignIn}>
              <PanelTitle>Hello, Friend!</PanelTitle>
              <Paragraph>Enter your details and start your journey with us.</Paragraph>
              <Button onClick={() => setIsSignIn(false)}>Sign Up</Button>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </MainContainer>
  );
};

export default Login;
