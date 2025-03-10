import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Persistent Login (Check if user is already logged in)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate("/explore"); // Redirect to Explore if already logged in
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Retrieve stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Find the user by email
    const user = storedUsers.find((user: any) => user.email === email);

    if (!user) {
      setError("Email not found in our system.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Save login state (Persistent Login Feature)
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Show success notification
    setOpenSnackbar(true);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email first to reset your password.");
      return;
    }

    // Simulate email reset link
    const mailtoLink = `mailto:${email}?subject=Password Reset Request&body=Click this link to reset your password: [Your Password Reset Link Here]`;
    window.location.href = mailtoLink;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    navigate("/explore"); // Redirect to Explore Screen after login confirmation
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Mobile App Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "375px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {/* Back Button */}
        <IconButton onClick={() => navigate("/")} sx={{ position: "absolute", top: 10, left: 10 }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {/* Title */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Log In
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Error Message */}
          {error && <Typography color="error">{error}</Typography>}

          {/* Login Button */}
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
            Log In
          </Button>

          {/* Forgot Password Link */}
          <Typography align="center" sx={{ mt: 2 }}>
            <Link onClick={handleForgotPassword} color="primary" underline="hover" style={{ cursor: "pointer" }}>
              Forgot your password?
            </Link>
          </Typography>
        </form>
      </Box>

      {/* Login Confirmation Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
