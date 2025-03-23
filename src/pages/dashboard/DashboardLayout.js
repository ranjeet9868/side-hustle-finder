// src/pages/dashboard/DashboardLayout.js
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { logout } from "../../services/authService";

export default function DashboardLayout({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    // Use the logout function from authService
    logout(setToken, navigate);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {!isMainDashboard && (
            <IconButton edge="start" color="inherit" onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Outlet />
    </>
  );
}
