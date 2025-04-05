"use client";
import React from "react";
import { Container } from "@mui/material";
import { CarouselSection } from "./sections/CarouselSection";
// import { Navbars } from "./sections/Navbars";
import { HealthInsightsSection } from "./sections/HealthInsightsSection";
import { FamousMedicinesSection } from "./sections/FamousMedicinesSection";
import { TopBrandsSection } from "./sections/TopBrandsSection";
import { SaleSection } from "./sections/SaleSection";
import { FooterSection } from "./sections/FooterSection";

const UserStore = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 8 }}>
      <Navbars />
      <CarouselSection />
      <HealthInsightsSection />
      <FamousMedicinesSection />
      <TopBrandsSection />
      <SaleSection />
      <FooterSection />
    </Container>
  );
};

export default UserStore;