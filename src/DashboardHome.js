// src/DashboardHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

export default function DashboardHome({ token }) {
  const navigate = useNavigate();

  // Quick helper to route to a certain path
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
        {/* Post a Job */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Post a Job
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new job listing for others to find and apply.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => goTo("/dashboard/post-job")}
              >
                Go
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Job Listings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Job Listings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse and apply to available jobs in your area.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => goTo("/dashboard/listings")}
              >
                Go
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* My Applications */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                My Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your posted jobs.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => goTo("/dashboard/applications")}
              >
                Go
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Chat */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Talk with matched posters or shovelers in real-time.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => goTo("/dashboard/chat")}
              >
                Go
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
