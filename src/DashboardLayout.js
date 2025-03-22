// src/DashboardLayout.js
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is exactly "/dashboard"
  const isDashboardHome = location.pathname === "/dashboard";

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          {!isDashboardHome && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleBackClick}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            sideHustleFinder Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
