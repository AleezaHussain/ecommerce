
"use client";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { FooterSection } from "../userstore/sections/FooterSection";



<NavBar loginButton={true}  />

const LandingPage = () => {

 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(100);
  const testimonialContainerRef = useRef(null);

  // Features section data
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-2xl">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      title: "Expert Doctors",
      description: "Specialized care"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ECDC4] text-2xl">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: "24/7 Support",
      description: "Always available"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF6B6B] text-2xl">
          <path d="M18 6h-5a2 2 0 0 0-2 2v9a2 2 0 0 1-2 2H4"></path>
          <path d="M10 18V8a2 2 0 0 1 2-2h6"></path>
        </svg>
      ),
      title: "Modern Equipment",
      description: "Latest technology"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 text-2xl">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      title: "Quality Care",
      description: "Patient-centered"
    }
  ];

  // Services section data
  const services = [
    {
      id: 1,
      title: "Cardiology",
      description: "Comprehensive heart care including diagnosis, treatment, and prevention of cardiovascular diseases.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Neurology",
      description: "Specialized care for disorders of the nervous system, including the brain, spinal cord, and nerves.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <path d="M21.8 18.4l-2.8-2.8c.2-.4.3-.8.3-1.2.1-1.5-1.1-2.7-2.6-2.6-.4 0-.8.1-1.2.3l-1.9-1.9c1.4-1.2 2.3-2.9 2.3-4.7 0-3.3-2.7-6-6-6-3.4 0-5.9 2.6-6 6v.1c0 1.8.8 3.5 2.3 4.7l-1.9 1.9c-.4-.2-.8-.3-1.2-.3C1.6 12 .4 13.2.5 14.7c0 .4.1.8.3 1.2L0 18.7c-.1.1 0 .2 0 .3 0 .1.1.2.2.2h.3l2-1 2 1h.3c.1 0 .2-.1.2-.2v-.3l-.8-2.9c.4-.3.7-.6.9-1.1.5-.9.4-2-.3-2.7l1.9-1.9c.6.3 1.2.5 1.9.5.7 0 1.3-.2 1.9-.5l1.9 1.9c-.6.7-.8 1.8-.3 2.7.2.4.6.8.9 1.1l-.8 2.9v.3c0 .1.1.2.2.2h.3l2-1 2 1h.3c.1 0 .2-.1.2-.2v-.3l-.8-2.8z"></path>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Pediatrics",
      description: "Comprehensive healthcare for infants, children, and adolescents focusing on growth and development.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <path d="M9 12h0.01M15 12h0.01M10 16c.5.3 1.1.5 2 .5s1.5-.2 2-.5"></path>
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Orthopedics",
      description: "Treatment of conditions involving the musculoskeletal system, including joints, bones, and muscles.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1620504155085-d7b35c8618f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Dentistry",
      description: "Comprehensive dental care including preventive, restorative, and cosmetic procedures for all ages.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6a2 2 0 0 0 2 3c2 1 3 2.5 3 4s-1 3-3 3a2 2 0 0 1-2 2 2 2 0 0 1-2-2c-2 0-3-1.5-3-3s1-3 3-4a2 2 0 0 0 2-3"></path>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Ophthalmology",
      description: "Specialized care for eye health including diagnosis and treatment of eye disorders and diseases.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-xl">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Doctors section data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Testimonials section data
  const testimonials = [
    {
      id: 1,
      name: "Rebecca Thompson",
      role: "Cardiac Patient",
      content: "The care I received at HealthCare Medical Center was exceptional. The doctors were knowledgeable and took the time to explain everything to me. The staff was friendly and made me feel comfortable throughout my stay.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 2,
      name: "David Martinez",
      role: "Parent of Patients",
      content: "I've been bringing my children to HealthCare for years. The pediatricians are amazing with kids and provide excellent care. The facility is clean and welcoming. I wouldn't trust anyone else with my family's health.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 3,
      name: "Jennifer Lee",
      role: "Orthopedic Patient",
      content: "After my surgery, the rehabilitation program at HealthCare was instrumental in my recovery. The therapists were skilled and supportive, pushing me to achieve my goals while ensuring my comfort and safety.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      rating: 4.5
    }
  ];

  // Contact details section data
  const contactDetails = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-2xl">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      title: "Our Location",
      details: "123 Medical Plaza Dr.\nHealthville, CA 90210\nUnited States"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-2xl">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
      title: "Phone Number",
      details: "Main: +1 (555) 123-4567\nEmergency: +1 (555) 911-0000\nFax: +1 (555) 123-4568"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-2xl">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      ),
      title: "Email Address",
      details: "info@healthcare.com\nappointments@healthcare.com\nsupport@healthcare.com"
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const updateItemWidth = () => {
    if (window.innerWidth >= 1024) {
      setItemWidth(33.333);
    } else if (window.innerWidth >= 768) {
      setItemWidth(50);
    } else {
      setItemWidth(100);
    }
  };

  useEffect(() => {
    // Set page title
    document.title = "HealthCare - Medical Center";
    
    // Update testimonial carousel width based on screen size
    updateItemWidth();
    window.addEventListener('resize', updateItemWidth);
    
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target;
      const anchorElement = target.closest('a[href^="#"]');
      
      if (anchorElement) {
        e.preventDefault();
        
        const targetId = anchorElement.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('resize', updateItemWidth);
    };
  }, []);

  const nextSlide = () => {
    const totalSlides = testimonials.length;
    const viewportSize = window.innerWidth;
    let maxIndex;
    
    if (viewportSize >= 1024) {
      maxIndex = totalSlides - 3;
    } else if (viewportSize >= 768) {
      maxIndex = totalSlides - 2;
    } else {
      maxIndex = totalSlides - 1;
    }
    
    maxIndex = Math.max(0, maxIndex);
    setCurrentTestimonialIndex(prevIndex => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    const totalSlides = testimonials.length;
    const viewportSize = window.innerWidth;
    let maxIndex;
    
    if (viewportSize >= 1024) {
      maxIndex = totalSlides - 3;
    } else if (viewportSize >= 768) {
      maxIndex = totalSlides - 2;
    } else {
      maxIndex = totalSlides - 1;
    }
    
    maxIndex = Math.max(0, maxIndex);
    setCurrentTestimonialIndex(prevIndex => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  const renderStars = (rating) => {
    return (
      <div className="text-[#FF6B6B] flex">
        {[...Array(Math.floor(rating))].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ))}
        {rating % 1 > 0 && (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <NavBar loginButton={true} />
      
      {/* Main Content */}
      <main>
        <Box
      id="home"
      sx={{
        mt: 5,
        pt: { xs: "64px", md: "64px" },
        minHeight: { xs: "500px", md: "600px" },
        backgroundColor: "#0F1A3A",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          width: { xs: "100%", md: "60%" },
          py: { xs: 4, md: 10 },
          color: "white",
          marginLeft:1,
        }}
      >
        <Box sx={{ maxWidth: "650px" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#FF6B6B",
              fontWeight: 700,
              mb: 2,
              letterSpacing: "1.5px",
              fontSize: "1.1rem",
            }}
          >
            YOUR HEALTH IS OUR PRIORITY
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            Comprehensive Medical Care For Your Family
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            Our team of board-certified physicians provides personalized healthcare 
            solutions for patients of all ages with cutting-edge medical technology.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              href="#services"
              variant="contained"
              sx={{
                backgroundColor: "#FF6B6B",
                "&:hover": { backgroundColor: "#E05555" },
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "8px",
                minWidth: "160px",
              }}
            >
              Our Services
            </Button>

            <Button
              href="#about"
              variant="outlined"
              sx={{
                borderColor: "white",
                borderWidth: 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "8px",
                minWidth: "160px",
              }}
            >
              About Us
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Right Video with mix-blend-mode */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: { xs: "100%", md: "50%" },
          zIndex: 1,
          overflow: "hidden",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            mixBlendMode: "darken", // try "screen", "multiply", or "overlay" too
            opacity: 0.9,
            backgroundColor: "#0F1A3A",
          }}
        >
          <source
            src="https://video-previews.elements.envatousercontent.com/09f79677-748f-4f1f-965b-74d3f47c934d/watermarked_preview/watermarked_preview.mp4"
            type="video/mp4"
          />
        </video>
      </Box>
    </Box>
        {/* Features Banner */}
        <section className="bg-white py-10 shadow-md">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`bg-${index === 0 ? 'primary' : index === 1 ? '[#4ECDC4]' : index === 2 ? '[#FF6B6B]' : 'gray-700'}/10 p-4 rounded-full`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 font-heading">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium mb-2">Our Medical Services</p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800">
                Comprehensive Healthcare Services
              </h2>
              <div className="w-24 h-1 bg-[#FF6B6B] mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={`${service.title} Department`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-heading text-gray-800">{service.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <a href={`#services-${service.id}`} className="text-primary font-medium flex items-center hover:text-[#FF6B6B] transition-colors">
                      Learn More
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a 
                href="#services" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md inline-block font-medium transition-colors"
              >
                View All Services
              </a>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-primary font-medium mb-2">About Us</p>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-6">
                  Providing Quality Healthcare Since 1995
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  At HealthCare Medical Center, we are dedicated to providing exceptional healthcare services to our community. With a team of highly skilled doctors, state-of-the-art facilities, and a patient-centered approach, we strive to improve the health and wellbeing of every individual we serve.
                </p>
                
                <div className="space-y-4 mb-8">
                  {["Experienced team of medical professionals", 
                    "Advanced diagnostic and treatment technologies", 
                    "Compassionate and patient-centered care", 
                    "Comprehensive range of medical services"].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#FF6B6B] mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-gray-600">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <a 
                  href="#doctors" 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium transition-colors"
                >
                  Meet Our Doctors
                </a>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Medical Staff at HealthCare Medical Center" 
                  className="rounded-lg shadow-xl w-full h-auto max-h-[500px] object-cover"
                />
                <div className="absolute -bottom-5 -left-5 bg-[#FF6B6B] text-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="font-heading font-bold text-3xl mb-1">25+</div>
                  <div className="text-sm">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Doctors Section */}
        <section id="doctors" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium mb-2">Our Medical Team</p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800">
                Meet Our Expert Doctors
              </h2>
              <div className="w-24 h-1 bg-[#FF6B6B] mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="#" className="text-white hover:text-[#FF6B6B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#FF6B6B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#FF6B6B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect width="4" height="12" x="2" y="9"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold font-heading text-gray-800">{doctor.name}</h3>
                    <p className="text-primary mb-2">{doctor.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium mb-2">Patient Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800">
                What Our Patients Say
              </h2>
              <div className="w-24 h-1 bg-[#FF6B6B] mx-auto mt-4"></div>
            </div>
            
            <div className="relative">
              <div 
                ref={testimonialContainerRef}
                className="testimonial-container overflow-x-hidden flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialIndex * itemWidth}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-4"
                  >
                    <div className="bg-white p-6 rounded-lg shadow-md h-full">
                      <div className="flex items-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-600 mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800 font-heading">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-primary hover:text-[#FF6B6B] focus:outline-none hidden md:block" 
                aria-label="Previous testimonial"
                onClick={prevSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button 
                className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-primary hover:text-[#FF6B6B] focus:outline-none hidden md:block" 
                aria-label="Next testimonial"
                onClick={nextSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mt-8 md:hidden">
              <button 
                className="bg-white p-3 rounded-full shadow-md text-primary hover:text-[#FF6B6B] focus:outline-none mx-2" 
                aria-label="Previous testimonial"
                onClick={prevSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button 
                className="bg-white p-3 rounded-full shadow-md text-primary hover:text-[#FF6B6B] focus:outline-none mx-2" 
                aria-label="Next testimonial"
                onClick={nextSlide}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
<section id="contact" className="py-16 bg-gray-100">
  <div className="container mx-auto px-4">
    {/* Section Header */}
    <div className="text-center mb-12">
      <p className="text-primary font-medium mb-2">Get In Touch</p>
      <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800">
        Contact Us
      </h2>
      <div className="w-24 h-1 bg-[#FF6B6B] mx-auto mt-4"></div>
    </div>
    
    {/* Contact Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {contactDetails.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold font-heading text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-600 whitespace-pre-line">
            {item.details}
          </p>
        </div>
      ))}
    </div>
    
    {/* Map Container */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-[400px] w-full relative">
        {/* Google Maps Iframe */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.24368848478973!3d34.05297998060799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c648d9808fbd%3A0xabc7cabc37d719d5!2s123%20S%20Main%20St%2C%20Los%20Angeles%2C%20CA%2090012%2C%20USA!5e0!3m2!1sen!2sus!4v1656526152776!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
          className="absolute inset-0"
        ></iframe>
        
        {/* Fallback content in case map doesn't load */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary mb-4"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Our Location</h3>
          <p className="text-gray-600 text-center whitespace-pre-line">
            123 Medical Plaza Dr.<br />
            Healthville, CA 90210<br />
            United States
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<FooterSection/>

      </main>
      
          </div>
  );
};

export default LandingPage;
