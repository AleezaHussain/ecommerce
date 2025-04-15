"use client";
import React from "react";
import { Container } from "@mui/material";
import { CarouselSection } from "./sections/CarouselSection";
import Allnavbar from "./sections/Allnavbar";  // Make sure this matches the export
import { HealthInsightsSection } from "./sections/HealthInsightsSection";
import { FamousMedicinesSection } from "./sections/FamousMedicinesSection";
import { TopBrandsSection } from "./sections/TopBrandsSection";
import { SaleSection } from "./sections/SaleSection";
import { FooterSection } from "./sections/FooterSection";
import CategorySection from "./sections/CategorySection";

const UserStore = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 8 }}>
      <Allnavbar/>
      <CarouselSection />
      <HealthInsightsSection />
      <FamousMedicinesSection />
      <CategorySection/>
      <TopBrandsSection />
      <SaleSection />
      <FooterSection />
    </Container>
  );
};

export default UserStore;