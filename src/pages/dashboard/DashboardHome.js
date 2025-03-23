// src/pages/dashboard/DashboardHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Grid } from "@mui/material";
import DashboardCard from "../../components/DashboardCard";

export default function DashboardHome({ token }) {
  const navigate = useNavigate();
  const goTo = (path) => navigate(path);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Select one of the options below.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Post a Job"
            description="Create a new job listing for others to find and apply."
            onClick={() => goTo("/dashboard/post-job")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Job Listings"
            description="Browse and apply to available jobs in your area."
            onClick={() => goTo("/dashboard/listings")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="My Applications"
            description="View and manage your posted jobs."
            onClick={() => goTo("/dashboard/applications")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Chat"
            description="Talk with matched posters or shovelers in real-time."
            onClick={() => goTo("/dashboard/chatlist")}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
