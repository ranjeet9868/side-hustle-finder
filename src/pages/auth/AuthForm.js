// src/pages/auth/AuthForm.js
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { login, register } from "../../services/authService";

export default function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegister) {
      const data = await register(email, password);
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert("Registration successful! Please switch to login.");
      }
    } else {
      const data = await login(email, password);
      if (data.token) {
        onAuthSuccess(data.token);
      } else {
        alert("Login failed: " + (data.error || "Unknown error"));
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
          }}
        >
          {/* App Name */}
          <Typography
            component="h1"
            variant="h3"
            sx={{ fontWeight: "bold", mb: 2 }}
            color="primary"
          >
            sideHustleFinder
          </Typography>

          {/* Avatar Icon */}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          {/* Form Title */}
          <Typography component="h2" variant="h5">
            {isRegister ? "Register" : "Login"}
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              {isRegister ? "Register" : "Login"}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => setIsRegister(!isRegister)}
                  sx={{ cursor: "pointer" }}
                >
                  {isRegister
                    ? "Already have an account? Login"
                    : "No account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
